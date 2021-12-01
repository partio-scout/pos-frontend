import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X } from 'react-feather'
import TaskGroupItem from 'components/TaskGroupItem'
import { ITEM_TYPES } from '../../consts'
import { setSelectedAgeGroup } from 'redux/actionCreators'
import {
  determineLanguageFromUrl,
  getTermInLanguage,
  getActivityGroupIcon,
  getTaskGroupStatus,
} from 'helpers'

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.color.gradientDark};
  pointer-events: all;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 19rem;
    background: ${({ theme, ageGroupGuid }) => `
    linear-gradient(
      to bottom,
      ${
        theme.color.ageGroupGradients[ageGroupGuid] ||
        theme.color.ageGroupGradients.default
      },
      ${theme.color.gradientDark}
    );
    `};
  }
`

// TODO take icon from feather icons and remove px width & height
const CloseIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  display: grid;
  grid-template-rows: 19rem minmax(0, 1fr);
  overflow: hidden;
`

const HeadingContent = styled.div`
  padding-top: 7rem;
  margin: 0 auto;
  text-align: center;

  > h3 {
    font-size: 24px;
  }
`

const BodyContent = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding: 1rem;
  padding-bottom: 2rem;
  overflow: scroll;

  > :first-child {
    padding-bottom: 1rem;
    text-align: center;
    font-size: 18px;
  }

  > h4 {
    font-weight: normal;
    text-transform: capitalize;
  }
`

const MainSymbol = styled.img`
  width: 8rem;
  height: 8rem;
  margin: 0 auto;
`

const AgeGroup = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const groupHeadingTranslations = useSelector(
    (state) => state.translations.aktiviteettipaketin_ylakasite
  )
  const activityTranslations = useSelector(
    (state) => state.translations.aktiviteetin_ylakasite
  )

  const { id } = useParams()
  const language = determineLanguageFromUrl(window.location)
  const user = useSelector((state) => state.user)
  const userTasks = useSelector((state) => state.tasks)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const generalTranslations = useSelector((state) => state.translations.yleiset)
  const activityGroupById = useSelector((state) => state.activityGroups)
  const ageGroup = itemsByGuid[id] ? itemsByGuid[id].item : undefined

  useEffect(() => {
    if (ageGroup) {
      dispatch(setSelectedAgeGroup(ageGroup))
    }
  }, [ageGroup, dispatch])

  if (!ageGroup || !groupHeadingTranslations) {
    return null
  }

  const ageGroupGuid = ageGroup ? ageGroup.wp_guid : 'default'

  const getTitle = (subtask_term) => {
    let title = getTermInLanguage(
      groupHeadingTranslations,
      `${subtask_term}_plural`,
      language
    )

    if (subtask_term === 'askel') {
      title = getTermInLanguage(activityTranslations, 'paw_plural', language)
    }
    return title
  }

  const completedGroups = []
  const unfinishedGroups = []

  const getCompletedActivityGroups = (ageGroup) => {
    user.loggedIn && ageGroup.activity_groups
      ? ageGroup.activity_groups.map((activityGroup) => {
          const activities = activityGroupById[activityGroup.id].activities
          const completedTasks = activities.reduce((taskCount, task) => {
            if (userTasks[task.wp_guid] === 'COMPLETED') {
              taskCount++
            }
            return taskCount
          }, 0)
          if (completedTasks === activities.length) {
            completedGroups.push(activityGroup)
          } else {
            unfinishedGroups.push(activityGroup)
          }
        })
      : null
  }
  getCompletedActivityGroups(ageGroup)

  return (
    <Background ageGroupGuid={ageGroupGuid}>
      <Content>
        <CloseIcon>
          <X onClick={() => history.push(`/?lang=${language}`)} />
        </CloseIcon>
        <HeadingContent>
          <MainSymbol alt={ageGroup.title} src={ageGroup.logo.url} />
          <h3>{ageGroup.title}</h3>
        </HeadingContent>
        <BodyContent>
          <h4>{getTitle(ageGroup.subactivitygroup_term)}</h4>
          <h4>
            <strong>Suoritetut</strong>
          </h4>
          {completedGroups.length > 0 ? (
            completedGroups.map((activityGroup) => {
              const status = user.loggedIn
                ? getTaskGroupStatus(
                    activityGroupById[activityGroup.id],
                    userTasks,
                    getTermInLanguage(generalTranslations, 'done', language)
                  )
                : null
              return (
                <TaskGroupItem
                  key={activityGroup.id}
                  taskGroup={activityGroup}
                  ageGroupGuid={ageGroupGuid}
                  language={language}
                  icon={getActivityGroupIcon(activityGroup)}
                  tasksTerm={status}
                  itemType={ITEM_TYPES.TASK_GROUP}
                />
              )
            })
          ) : (
            <p>
              <span>Ei suoritettuja aktiviteettiryhmiä</span>
            </p>
          )}

          <h4>
            <strong>Suorittamattomat</strong>
          </h4>
          {unfinishedGroups.length > 0 ? (
            unfinishedGroups.map((activityGroup) => {
              const status = user.loggedIn
                ? getTaskGroupStatus(
                    activityGroupById[activityGroup.id],
                    userTasks,
                    getTermInLanguage(generalTranslations, 'done', language)
                  )
                : null
              return (
                <TaskGroupItem
                  key={activityGroup.id}
                  taskGroup={activityGroup}
                  ageGroupGuid={ageGroupGuid}
                  language={language}
                  icon={getActivityGroupIcon(activityGroup)}
                  tasksTerm={status}
                  itemType={ITEM_TYPES.TASK_GROUP}
                />
              )
            })
          ) : (
            <p>
              <span>Ei suorittamattomia aktiviteettiryhmiä</span>
            </p>
          )}
        </BodyContent>
      </Content>
    </Background>
  )
}

export default AgeGroup
