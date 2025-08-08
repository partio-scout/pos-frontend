import React, { useState } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AgeGroupListItem from 'components/AgeGroupListItem'
import { API_URL, fetchProfile } from 'api'

import { X } from 'react-feather'
import {
  determineLanguageFromUrl,
  getTermInLanguage,
  getAgeGroupTasks,
  getAgeGroupCompletion,
  getActivityGroupIcon,
  getItemId,
  filterActivityGroupsWithCompletedAgegroup,
} from 'helpers'
import ListItem from 'components/ListItem'
import {
  COMPLETION_STATUS,
  AGE_GROUPS,
  ITEM_TYPES,
  TASK_GROUP_STATUS,
} from 'consts'
import CompletedTasks from './CompletedTasks'
import CompletionBadges from './CompletionBadges'
import {
  getTaskGroupsWithChildTaskGroups,
  getCompletionBadgesWithCompletedItems,
} from '../../helpers/groupTasks'
import { actionTypes } from 'components/Actions'
import OngoingTaskList from './OngoingTaskList'

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
  const userTaskGroups = useSelector((state) => state.userActivityGroups)
  const userAgeGroups = useSelector((state) => state.userAgeGroups)
  const ageGroups = useSelector((state) => state.ageGroups)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const favourites = useSelector((state) =>
    state.favourites.map((favourite) => state.itemsByGuid[favourite])
  )
  const activityGroups = useSelector((state) => state.activityGroups)
  const translations = useSelector((state) => state.translations)

  if (!itemsByGuid || !translations || !favourites || !activityGroups)
    return null
  if (favourites === undefined || activityGroups === undefined) return null

  const completedTasks = Object.keys(userTasks).filter(
    (guid) => userTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const completionBadges = Object.keys(userAgeGroups).map(
    (id) => itemsByGuid[id]
  )

  const completedTaskGroups = Object.keys(userTaskGroups)
    .filter((guid) => userTaskGroups[guid] === TASK_GROUP_STATUS.COMPLETED)
    .map((id) => itemsByGuid[id] || activityGroups[id])

  const completedTaskGroupsGuids = completedTaskGroups.map(
    (group) => group && group.id
  )

  const completionBadgeAgegroupIds = Object.keys(userAgeGroups).map((id) => id)

  const taskGroupsWithChildTaskGroups = getTaskGroupsWithChildTaskGroups(
    itemsByGuid,
    completedTasks,
    language,
    getItemId
  )

  const completedAgeGroupsFiltered = filterActivityGroupsWithCompletedAgegroup(
    taskGroupsWithChildTaskGroups,
    completionBadgeAgegroupIds,
    itemsByGuid
  )
  const parentTaskGroupGuids = Object.keys(completedAgeGroupsFiltered)
  /* Migrated data from Kuksa uses id instead of wp_guid, which is used mostly in the application, also some of the migrated activitygroups belongs to "Seikkailijat Vanha"-agegroup,
   * which is not published yet - they need to be filtered. This looks messy
   */

  const taskGroupsMarkedCompleted = completedTaskGroupsGuids
    .filter((guid) => !parentTaskGroupGuids.includes(guid))
    .map((id) => itemsByGuid[id] || activityGroups[id])

  const filterUndefined = taskGroupsMarkedCompleted.filter(
    (taskgroup) =>
      taskgroup !== undefined &&
      !completionBadgeAgegroupIds.includes(
        taskgroup.item?.age_group?.wp_guid ||
          taskgroup.item?.age_group?.id ||
          taskgroup.age_group?.wp_guid ||
          taskgroup.age_group?.id
      )
  )

  const taskgroupsMarkedCompletedWhenAgeGroupMarkedCompleted =
    taskGroupsMarkedCompleted.filter(
      (taskgroup) =>
        taskgroup !== undefined &&
        completionBadgeAgegroupIds.includes(
          taskgroup.item?.age_group?.wp_guid ||
            taskgroup.item?.age_group?.id ||
            taskgroup.age_group?.wp_guid ||
            taskgroup.age_group?.id
        )
    )

  const filteredTaskGroupsMarkedCompleted = filterUndefined.filter(
    (taskgroup) =>
      !taskgroup.age_group || Object.keys(taskgroup.age_group).length > 0
  )

  const completionBadgesWithCompletedItems =
    getCompletionBadgesWithCompletedItems(
      completionBadges,
      taskGroupsWithChildTaskGroups
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

      if (ageGroupItem === undefined) return null

      const isAgeGroupCompleted = getAgeGroupCompletion(
        ageGroupItem,
        userTasks,
        activityGroups
      )
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
        if (userProfileData === undefined) return null

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
            {favourites.length > 0 &&
              favourites
                .filter((x) => x !== undefined && x.item.locale == language)
                .map((favourite) => {
                  const parent =
                    activityGroups[favourite.item.activity_group.id]
                  return (
                    parent && (
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
                  )
                })}
          </TaskList>
          <h4>
            {getTermInLanguage(translations, 'aktiviteetit')} /{' '}
            {getTermInLanguage(translations, 'tyon-alla')}
          </h4>
          <OngoingTaskList
            list={ongoingTasks}
            itemsByGuid={itemsByGuid}
            activityGroups={activityGroups}
            language={language}
            favourites={favourites}
          />
          <h4>{getTermInLanguage(translations, 'suoritetut')}</h4>
          <TaskList>
            {completedAgeGroupsFiltered && (
              <CompletedTasks
                language={language}
                itemsByGuid={itemsByGuid}
                taskGroupsWithChildTaskGroups={completedAgeGroupsFiltered}
                actionsComponent={actionTypes.openTaskActions}
                completedTaskGroupsGuids={completedTaskGroupsGuids}
                parentTaskGroupGuids={parentTaskGroupGuids}
              />
            )}
            {filteredTaskGroupsMarkedCompleted &&
              filteredTaskGroupsMarkedCompleted.map((taskGroup) => {
                if (!taskGroup) return null
                return (
                  <ListItem
                    key={taskGroup.id}
                    guid={getItemId(taskGroup)}
                    ageGroupGuid={taskGroup.ageGroupGuid}
                    title={taskGroup.title || taskGroup.item.title}
                    subTitle={getTermInLanguage(
                      translations,
                      'kokonaisuus-valmis'
                    )}
                    icon={getActivityGroupIcon(taskGroup.item || taskGroup)}
                    language={language}
                    itemType={ITEM_TYPES.TASK_GROUP}
                    actionsComponent={actionTypes.openTaskActions}
                    showActions
                  />
                )
              })}
            {completedAgeGroups &&
              completedAgeGroups.map((ageGroup) => {
                return (
                  <AgeGroupListItem
                    key={ageGroup.id}
                    ageGroup={ageGroup}
                    language={language}
                    subTitle={getTermInLanguage(
                      translations,
                      'ikakausi-valmis'
                    )}
                  />
                )
              })}
          </TaskList>
          <h4>{getTermInLanguage(translations, 'paatosmerkit')}</h4>
          <CompletionBadges
            itemsByGuid={itemsByGuid}
            completedItems={completionBadgesWithCompletedItems}
            language={language}
            taskgroupsMarkedCompleted={
              taskgroupsMarkedCompletedWhenAgeGroupMarkedCompleted
            }
            actionsComponent={actionTypes.openTaskActions}
            completedtasks={useSelector((state) => state.tasks)}
          />
        </BodyContent>
      </Content>
    </Background>
  )
}

export default Profile
