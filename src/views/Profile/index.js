import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TaskGroupItem from 'components/TaskGroupItem'
import AgeGroupListItem from 'components/AgeGroupListItem'
import { API_URL, fetchProfile } from 'api'

import { X } from 'react-feather'
import {
  determineLanguageFromUrl,
  getTermInLanguage,
  getAgeGroupTasks,
  getGroupTasks,
  getAgeGroupCompletion,
  getCompletedTaskGroups,
} from 'helpers'
import ListItem from 'components/ListItem'
import { ITEM_TYPES, COMPLETION_STATUS, AGE_GROUPS } from 'consts'

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
  padding-top: 6rem;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 24px;

  > h3 {
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 5px;
  }
  > span {
    color: ${({ theme }) => theme.color.subText};
  }
  > div {
    margin-top: 10px;
  }
  > div a {
    color: white;
    text-decoration: none;
  }
`

const BodyContent = styled.div`
  box-sizing: border-box;
  height: 100%;
  margin-top: 2rem;
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
  const [userData, setUserData] = useState({})
  const [isFetchingProfile, setIsFetchingProfile] = useState(false)
  const [errorFetchingProfile, setErrorFetchingProfile] = useState(false)
  const userTasks = useSelector(state => state.tasks)
  const ageGroups = useSelector(state => state.ageGroups)
  const itemsByGuid = useSelector(state => state.itemsByGuid)
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

  if (!itemsByGuid || !activityTranslations) return null

  const completedTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const ongoingTasks = Object.keys(userTasks).filter(
    guid =>
      userTasks[guid] === COMPLETION_STATUS.ACTIVE ||
      userTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const completedAgeGroups = ageGroups
    .filter(ageGroup => {
      const items = itemsByGuid[ageGroup.guid]
      const ageGroupItem = items && items.item
      const isAgeGroupCompleted = getAgeGroupCompletion(ageGroupItem, userTasks)

      if (isAgeGroupCompleted) {
        const ageGroupTasks = getAgeGroupTasks(itemsByGuid[ageGroup.guid].item)
        ageGroupTasks.mandatory.forEach(task => {
          const taskIndex = completedTasks.indexOf(task)
          if (taskIndex > -1) {
            completedTasks.splice(taskIndex, 1)
          }
        })

        ageGroupTasks.optional.forEach(task => {
          const taskIndex = completedTasks.indexOf(task)
          if (taskIndex > -1) {
            completedTasks.splice(taskIndex, 1)
          }
        })
      }
      return isAgeGroupCompleted
    })
    .map(ageGroup => itemsByGuid[ageGroup.guid])

  const taskGroups = ageGroups
    .filter(ageGroup => !completedAgeGroups.includes(ageGroup.guid))
    .map(ageGroup => {
      const ageGroupItem = itemsByGuid[ageGroup.guid].item
      const completedTaskGroups = getCompletedTaskGroups(
        ageGroupItem,
        userTasks
      )

      if (completedTaskGroups.length > 0) {
        completedTaskGroups.forEach(taskGroupGuid => {
          const taskGroupTasks = getGroupTasks(itemsByGuid[taskGroupGuid].item)

          taskGroupTasks.mandatory.forEach(task => {
            const taskIndex = completedTasks.indexOf(task)
            if (taskIndex > -1) {
              completedTasks.splice(taskIndex, 1)
            }
          })

          taskGroupTasks.optional.forEach(task => {
            const taskIndex = completedTasks.indexOf(task)
            if (taskIndex > -1) {
              completedTasks.splice(taskIndex, 1)
            }
          })
        })
      }

      const completedSubGroups = ageGroupItem.taskgroups
        .filter(taskGroup => !completedTaskGroups.includes(taskGroup.guid))
        .map(taskGroup => getCompletedTaskGroups(taskGroup, userTasks))
        .flat()

      if (completedSubGroups.length > 0) {
        completedSubGroups.forEach(taskGroupGuid => {
          const taskGroupTasks = getGroupTasks(itemsByGuid[taskGroupGuid].item)

          taskGroupTasks.mandatory.forEach(task => {
            const taskIndex = completedTasks.indexOf(task)
            if (taskIndex > -1) {
              completedTasks.splice(taskIndex, 1)
            }
          })

          taskGroupTasks.optional.forEach(task => {
            const taskIndex = completedTasks.indexOf(task)
            if (taskIndex > -1) {
              completedTasks.splice(taskIndex, 1)
            }
          })
        })
      }

      return completedTaskGroups.concat(completedSubGroups)
    })
    .flat()
    .map(guid => itemsByGuid[guid])

  if (
    !Object.entries(userData).length &&
    !isFetchingProfile &&
    !errorFetchingProfile
  ) {
    setIsFetchingProfile(true)
    fetchProfile()
      .then(userProfileData => {
        const defaultTroop = userProfileData.troops.filter(
          x => x.id === userProfileData.defaultTroopId
        )[0]
        const ageGroupGuid = AGE_GROUPS[userProfileData.ageGroupId]
        if (defaultTroop) {
          userProfileData = Object.assign(userProfileData, {
            defaultTroopName: defaultTroop.name,
            ageGroupGuid: ageGroupGuid,
          })
        }
        setUserData(userProfileData)
      })
      .catch(error => {
        console.error('Fetch profile failed: ', error)
        setErrorFetchingProfile(true)
        return error
      })
      .finally(() => {
        setIsFetchingProfile(false)
      })
  }

  const ageGroupGuid = userData.ageGroupGuid
  return (
    <Background ageGroupGuid={ageGroupGuid}>
      <Content>
        <CloseIcon>
          <X onClick={() => history.goBack()} />
        </CloseIcon>
        <HeadingContent>
          <Picture />
          {userData.name && userData.troops && (
            <>
              <h3>{userData.name}</h3>
              <span>{userData.defaultTroopName}</span>
              <div>
                <a href={`${API_URL}/logout`}>Logout</a>
              </div>
            </>
          )}
        </HeadingContent>
        <BodyContent>
          <h4>
            {getTermInLanguage(generalTranslations, 'favourites', language)}
          </h4>
          <TaskList>
            {favourites &&
              favourites.map(favourite => {
                const taskTranslation = getTranslation(favourite.item)
                const parent = itemsByGuid[favourite.parentGuid]
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
                    subTitle={parent.item.title}
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
            {getTermInLanguage(
              activityTranslations,
              'aktiviteetti_plural',
              language
            )}{' '}
            /{' '}
            {getTermInLanguage(generalTranslations, 'working_on_it', language)}
          </h4>
          <TaskList>
            {ongoingTasks.map(taskGuid => {
              const task = itemsByGuid[taskGuid]
              if (!task) return null

              const taskTranslation = getTranslation(task.item)
              const parent = itemsByGuid[task.parentGuid]
              const finder = favourite => taskGuid === favourite.guid
              const isFavourite = !!favourites.find(finder)

              return (
                <ListItem
                  key={task.guid}
                  guid={task.guid}
                  ageGroupGuid={task.ageGroupGuid}
                  title={
                    taskTranslation ? taskTranslation.title : task.item.title
                  }
                  subTitle={parent.item.title}
                  language={language}
                  itemType={ITEM_TYPES.TASK}
                  showActions
                  showFavourite
                  isFavourite={isFavourite}
                />
              )
            })}
          </TaskList>
          <h4>
            {getTermInLanguage(generalTranslations, 'completed', language)}
          </h4>
          <TaskList>
            {completedTasks.map(taskGuid => {
              const task = itemsByGuid[taskGuid]
              if (!task) return null

              const taskTranslation = getTranslation(task.item)
              const parent = itemsByGuid[task.parentGuid]

              return (
                <ListItem
                  key={task.guid}
                  guid={task.guid}
                  ageGroupGuid={task.ageGroupGuid}
                  title={
                    taskTranslation ? taskTranslation.title : task.item.title
                  }
                  subTitle={parent.item.title}
                  language={language}
                  itemType={ITEM_TYPES.TASK}
                />
              )
            })}
            {taskGroups.map(subTaskGroup => {
              return (
                <TaskGroupItem
                  key={subTaskGroup.guid}
                  taskGroup={subTaskGroup.item}
                  ageGroupGuid={subTaskGroup.ageGroupGuid}
                  language={language}
                />
              )
            })}
            {completedAgeGroups.map(ageGroup => {
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
