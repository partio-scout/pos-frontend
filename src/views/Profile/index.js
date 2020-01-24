import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TaskGroupItem from 'components/TaskGroupItem'
import AgeGroupListItem from 'components/AgeGroupListItem'

import { X } from 'react-feather'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import ListItem from 'components/ListItem'
import { ITEM_TYPES } from 'consts'

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
    font-weight: normal;
  }
`

const BodyContent = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding: 1rem;
  padding-bottom: 2rem;
  overflow: scroll;

  > h4 {
    font-weight: normal;
    text-transform: capitalize;
    padding-bottom: 1rem;
    text-align: center;
    font-size: 18px;
  }
`
const Picture = styled.div`
  background: white;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  margin: 0 auto;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
`

const Profile = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const user = useSelector(state => state.user)

  //TODO: Get these from the api
  const ageGroup1 = useSelector(
    state => state.itemsByGuid['053fa231362e95cb211c5eb85c3cbedb']
  )
  const ageGroup2 = useSelector(
    state => state.itemsByGuid['4ed7e03516698ffba67d342b529358c0']
  )
  const inProgress = useSelector(
    state => state.itemsByGuid['fd0083b9a325c06430ba29cc6c6d1bac']
  )
  const favourites = useSelector(state =>
    state.favourites.map(favourite => state.itemsByGuid[favourite])
  )

  const activityTranslations = useSelector(
    state => state.translations.aktiviteetin_ylakasite
  )
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const getTranslation = taskOrTaskGroup => {
    return taskOrTaskGroup.languages.find(x => x.lang === language)
  }
  if (!inProgress || !activityTranslations) return null

  const taskGroups = inProgress.item.taskgroups.slice(1, 4)
  const item = inProgress.item

  //TODO: Maybe we can get users age from PartioID and compare it to groups
  const ageGroupGuid = 'fd0083b9a325c06430ba29cc6c6d1bac'
  return (
    <Background ageGroupGuid={ageGroupGuid}>
      <Content>
        <CloseIcon>
          <X onClick={() => history.goBack()} />
        </CloseIcon>
        <HeadingContent>
          <Picture />
          <h3>{user.name}</h3>
        </HeadingContent>
        <BodyContent>
          <h4>
            {getTermInLanguage(generalTranslations, 'favourites', language)}
          </h4>
          <TaskList>
            <ListItem
              key={'test-favourite'}
              ageGroupGuid={'fd0083b9a325c06430ba29cc6c6d1bac'}
              title={'Example favourite'}
              subTitle={'Esimerkki suosikki'}
              language={'fi'}
              itemType={ITEM_TYPES.TASK}
              showFavourite
              showActions
              isFavourite
            />
            {favourites.map(favourite => {
              const taskTranslation = getTranslation(favourite.item)

              return (
                <ListItem
                  key={favourite.guid}
                  guid={favourite.guid}
                  ageGroupGuid={favourite.ageGroupGuid}
                  title={
                    taskTranslation
                      ? taskTranslation.title
                      : favourite.item.title
                  }
                  language={language}
                  itemType={ITEM_TYPES.TASK}
                  showActions
                  showFavourite
                  isFavourite
                />
              )
            })}
          </TaskList>
          <h4>
            {getTermInLanguage(generalTranslations, 'completed', language)}
          </h4>
          <TaskList>
            {taskGroups.map(subTaskGroup => {
              const tasksTerm =
                item.subtask_term && item.subtask_term.name
                  ? getTermInLanguage(
                      activityTranslations,
                      `${item.subtask_term.name}_plural`,
                      language
                    )
                  : getTermInLanguage(
                      activityTranslations,
                      'aktiviteetti_plural',
                      language
                    )
              return (
                <TaskGroupItem
                  key={subTaskGroup.guid}
                  taskGroup={subTaskGroup}
                  ageGroupGuid={inProgress.ageGroupGuid}
                  language={language}
                  tasksTerm={tasksTerm}
                />
              )
            })}
            {[ageGroup2, ageGroup1].map(ageGroup => {
              return (
                <AgeGroupListItem
                  key={ageGroup.guid}
                  ageGroup={ageGroup}
                  language={language}
                  subTitle={getTermInLanguage(
                    generalTranslations,
                    'agegroup_completed',
                    language
                  )}
                />
              )
            })}
          </TaskList>
        </BodyContent>
      </Content>
    </Background>
  )
}

export default Profile
