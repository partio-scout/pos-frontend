import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X } from 'react-feather'
import TaskGroupItem from 'components/TaskGroupItem'
import { actionTypes } from 'components/Actions'
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

  const getTerm = (activityGroup) => {
    const group = activityGroupById[activityGroup.id]
    const term = `${
      group.activities.length > 1
        ? group.subactivity_term.plural
        : group.subactivity_term.singular
    }`
    const subtitle = term
      ? `${group.activities.length} ${term}`
      : group.activities.length
    return subtitle
  }

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
          {ageGroup.activity_groups.length > 0 &&
            ageGroup.activity_groups
              .sort((a, b) => a.order - b.order)
              .map((activityGroup) => (
                <TaskGroupItem
                  key={activityGroup.id}
                  taskGroup={activityGroup}
                  ageGroupGuid={ageGroupGuid}
                  language={language}
                  icon={getActivityGroupIcon(activityGroup)}
                  tasksTerm={language === 'fi' ? getTerm(activityGroup) : null}
                  itemType={ITEM_TYPES.TASK_GROUP}
                  actionsComponent={actionTypes.taskGroupActions}
                  showActions
                />
              ))}
        </BodyContent>
      </Content>
    </Background>
  )
}

export default AgeGroup
