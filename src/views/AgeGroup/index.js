import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X } from 'react-feather'
import UserAgeGroup from './userAgeGroup'
import TaskGroupItem from 'components/TaskGroupItem'
import { ITEM_TYPES } from '../../consts'
import { setSelectedAgeGroup } from 'redux/actionCreators'
import {
  determineLanguageFromUrl,
  getTermInLanguage,
  getActivityGroupIcon,
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

  let categories = ageGroup.activity_groups.reduce((prev, curr) => {
    const activityGroup = activityGroupById[curr.id]
    const category = activityGroup.activity_group_category
    let i = prev.findIndex((x) => x.category === (category?.name || ''))
    if (i > -1) {
      prev[i].groups.push(activityGroup)
    } else {
      prev.push({
        category: category?.name || '',
        sort_order:
          activityGroup.activity_group_category?.sort_order || Infinity,
        groups: [
          { ...activityGroup, sort_order: activityGroup.sort_order || 1000 },
        ],
      })
    }
    return prev
  }, [])

  categories = categories.sort((categoryA, categoryB) =>
    categoryA.sort_order < categoryB.sort_order ? -1 : 1
  )

  const categoryWithNoNameIndex = categories.findIndex((c) => c.category === '')

  let categoryWithNoName

  if (categoryWithNoNameIndex) {
    categoryWithNoName = categories.splice(categoryWithNoNameIndex, 1)[0]
  }

  if (categoryWithNoName) {
    categories = [categoryWithNoName, ...categories]
  }

  const completedGroups = []
  const unfinishedGroups = []

  const getCompletedActivityGroups = (categories) => {
    user.loggedIn && categories
      ? categories.map(({ groups }) => {
          groups.map((group) => {
            const activities = group.activities
            const completedTasks = activities.reduce((taskCount, task) => {
              if (userTasks[task.wp_guid] === 'COMPLETED') {
                taskCount++
              }
              return taskCount
            }, 0)
            if (completedTasks === activities.length) {
              completedGroups.push(group)
            } else {
              unfinishedGroups.push(group)
            }
          })
        })
      : null
  }
  getCompletedActivityGroups(categories)

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
          {user.loggedIn ? (
            <UserAgeGroup
              language={language}
              ageGroupGuid={ageGroupGuid}
              completedGroups={completedGroups}
              unfinishedGroups={unfinishedGroups}
            />
          ) : (
            ageGroup.activity_groups.map((activityGroup) => {
              return (
                <TaskGroupItem
                  key={activityGroup.id}
                  taskGroup={activityGroup}
                  ageGroupGuid={ageGroupGuid}
                  language={language}
                  icon={getActivityGroupIcon(activityGroup)}
                  itemType={ITEM_TYPES.TASK_GROUP}
                />
              )
            })
          )}
        </BodyContent>
      </Content>
    </Background>
  )
}

export default AgeGroup
