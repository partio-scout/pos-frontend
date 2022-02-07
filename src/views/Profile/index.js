import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AgeGroupListItem from 'components/AgeGroupListItem'
import {
  API_URL,
  //fetchActivityGroups,
  fetchProfile,
} from 'api'

import { X } from 'react-feather'
import {
  determineLanguageFromUrl,
  getTermInLanguage,
  getAgeGroupTasks,
  getAgeGroupCompletion,
  getActivityGroupIcon,
  getItemId,
} from 'helpers'
import ListItem from 'components/ListItem'
import { ITEM_TYPES, COMPLETION_STATUS, AGE_GROUPS } from 'consts'
import CompletedTasks from './CompletedTasks'
import { getTaskGroupsWithChildTaskGroups } from '../../helpers/groupTasks'
import { actionTypes } from 'components/Actions'

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
  display: flex;
  flex-direction: column;
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
  const userTasks = useSelector((state) => state.tasks)
  const ageGroups = useSelector((state) => state.ageGroups)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const favourites = useSelector((state) =>
    state.favourites.map((favourite) => state.itemsByGuid[favourite])
  )
  const activityGroups = useSelector((state) => state.activityGroups)

  const translations = useSelector((state) => state.translations)

  if (!itemsByGuid || !translations) return null

  const completedTasks = Object.keys(userTasks).filter(
    (guid) => userTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const taskGroupsWithChildTaskGroups = getTaskGroupsWithChildTaskGroups(
    itemsByGuid,
    completedTasks,
    language,
    getItemId
  )

  const ongoingTasks = Object.keys(userTasks).filter(
    (guid) =>
      userTasks[guid] === COMPLETION_STATUS.ACTIVE ||
      userTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const completedAgeGroups = ageGroups
    .filter((ageGroup) => {
      const items = itemsByGuid[getItemId(ageGroup)]
      const ageGroupItem = items && items.item
      const isAgeGroupCompleted = getAgeGroupCompletion(ageGroupItem, userTasks)
      if (isAgeGroupCompleted) {
        const ageGroupTasks = getAgeGroupTasks(
          itemsByGuid[getItemId(ageGroup)].item
        )
        ageGroupTasks.mandatory.forEach((task) => {
          const taskIndex = completedTasks.indexOf(task)
          if (taskIndex > -1) {
            completedTasks.splice(taskIndex, 1)
          }
        })

        ageGroupTasks.optional.forEach((task) => {
          const taskIndex = completedTasks.indexOf(task)
          if (taskIndex > -1) {
            completedTasks.splice(taskIndex, 1)
          }
        })
      }
      return isAgeGroupCompleted
    })
    .map((ageGroup) => itemsByGuid[ageGroup.guid])

  if (
    !Object.entries(userData).length &&
    !isFetchingProfile &&
    !errorFetchingProfile
  ) {
    setIsFetchingProfile(true)
    fetchProfile()
      .then((userProfileData) => {
        const defaultTroop = userProfileData.troops.filter(
          (x) => x.id === userProfileData.defaultTroopId
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
      .catch((error) => {
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
          <h4>{getTermInLanguage(translations, 'suosikit')}</h4>
          <TaskList>
            {favourites &&
              favourites
                .filter((x) => x.item.locale == language)
                .map((favourite) => {
                  const parent = activityGroups[favourite.item.activity_group]
                  return (
                    <ListItem
                      key={favourite.id}
                      guid={getItemId(favourite.item)}
                      ageGroupGuid={favourite.ageGroupGuid}
                      title={favourite.item.title}
                      subTitle={parent.title}
                      icon={getActivityGroupIcon(parent)}
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
            {getTermInLanguage(translations, 'aktiviteetit')} /{' '}
            {getTermInLanguage(translations, 'tyon-alla')}
          </h4>
          <TaskList>
            {ongoingTasks.map((taskGuid) => {
              const task = itemsByGuid[taskGuid]
              if (!task) return null
              if (task.item.locale !== language) return null
              const parent = activityGroups[task.item.activity_group]
              const finder = (favourite) => taskGuid === favourite.guid
              const isFavourite = !!favourites.find(finder)
              return (
                <ListItem
                  key={task.id}
                  guid={getItemId(task.item)}
                  ageGroupGuid={task.ageGroupGuid}
                  title={task.item.title}
                  subTitle={parent.title}
                  language={language}
                  icon={getActivityGroupIcon(parent)}
                  itemType={ITEM_TYPES.TASK}
                  showActions
                  showFavourite
                  isFavourite={isFavourite}
                />
              )
            })}
          </TaskList>
          <h4>{getTermInLanguage(translations, 'suoritetut')}</h4>
          <TaskList>
            {taskGroupsWithChildTaskGroups && (
              <CompletedTasks
                language={language}
                itemsByGuid={itemsByGuid}
                taskGroupsWithChildTaskGroups={taskGroupsWithChildTaskGroups}
                actionsComponent={actionTypes.openTaskActions}
              />
            )}
            {completedAgeGroups.map((ageGroup) => {
              return (
                <AgeGroupListItem
                  key={ageGroup.id}
                  ageGroup={ageGroup}
                  language={language}
                  subTitle={getTermInLanguage(translations, 'ikakausi-valmis')}
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
