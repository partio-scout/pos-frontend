import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X } from 'react-feather'
import TaskGroupItem from 'components/TaskGroupItem'
import { setSelectedAgeGroup } from 'redux/actionCreators'
import {
  getAgeGroupTitleWithoutAges,
  determineLanguageFromUrl,
  getTermInLanguage,
} from 'helpers'
import { getAgeGroupIcon } from 'graphics/ageGroups'

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
      ${theme.color.ageGroupGradients[ageGroupGuid] ||
        theme.color.ageGroupGradients.default},
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
  border-radius: 50%;
`

const AgeGroup = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const itemsByGuid = useSelector(state => state.itemsByGuid)
  const userTasks = useSelector(state => state.tasks)
  const user = useSelector(state => state.user)
  const groupHeadingTranslations = useSelector(
    state => state.translations.aktiviteettipaketin_ylakasite
  )
  const activityTranslations = useSelector(
    state => state.translations.aktiviteetin_ylakasite
  )
  const generalTranslations = useSelector(state => state.translations.yleiset)

  const { guid } = useParams()
  const language = determineLanguageFromUrl(window.location)

  const ageGroup = itemsByGuid[guid] ? itemsByGuid[guid].item : undefined

  useEffect(() => {
    if (ageGroup) {
      dispatch(setSelectedAgeGroup(ageGroup))
    }
  }, [ageGroup, dispatch])

  if (!ageGroup || !groupHeadingTranslations) {
    return null
  }
  const ageGroupGuid = ageGroup ? ageGroup.guid : 'default'
  const languageInfo = ageGroup.languages.find(x => x.lang === language)

  const getTerm = (title, subtask_term) => {
    let term = getTermInLanguage(
      activityTranslations,
      `${subtask_term ? subtask_term.name : 'aktiviteetti'}_plural`,
      language
    )

    if (title === 'Haasteet') {
      term = getTermInLanguage(generalTranslations, 'challenges', language)
    }

    if (term === 'askeleet' && title !== 'Tervetuloa' && title !== 'Siirtymä') {
      term = getTermInLanguage(activityTranslations, 'paw_plural', language)
    }
    return term
  }

  const getTitle = subtask_term => {
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
          <MainSymbol
            alt={ageGroup.title}
            src={getAgeGroupIcon(
              itemsByGuid[ageGroup.guid],
              userTasks,
              user.loggedIn
            )}
          />
          <h3>
            {getAgeGroupTitleWithoutAges(
              languageInfo ? languageInfo.title : ageGroup.title
            )}
          </h3>
        </HeadingContent>
        <BodyContent>
          <h4>{getTitle(ageGroup.subtaskgroup_term.name)}</h4>
          {ageGroup.taskgroups.length > 0 &&
            ageGroup.taskgroups
              .sort((a, b) => a.order - b.order)
              .map(taskGroup => (
                <TaskGroupItem
                  key={taskGroup.guid}
                  taskGroup={taskGroup}
                  ageGroupGuid={ageGroupGuid}
                  language={language}
                  tasksTerm={getTerm(taskGroup.title, taskGroup.subtask_term)}
                />
              ))}
        </BodyContent>
      </Content>
    </Background>
  )
}

export default AgeGroup
