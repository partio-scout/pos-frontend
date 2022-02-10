import React from 'react'
import { useSelector } from 'react-redux'
import TaskGroupItem from 'components/TaskGroupItem'
import { actionTypes } from 'components/Actions'
import { ITEM_TYPES } from '../../consts'
import {
  getTermInLanguage,
  getActivityGroupIcon,
  getTaskGroupStatus,
} from 'helpers'

const UserAgeGroup = ({
  language,
  ageGroupGuid,
  completedGroups,
  unfinishedGroups,
}) => {
  const translations = useSelector((state) => state.translations)
  const userTasks = useSelector((state) => state.tasks)
  const activityGroupById = useSelector((state) => state.activityGroups)
  const user = useSelector((state) => state.user)

  if (user === undefined) return null

  const renderTaskGroupItem = (activityGroup) => {
    const status = getTaskGroupStatus(
      activityGroupById[activityGroup.id],
      userTasks,
      getTermInLanguage(translations, 'tehdyt')
    )

    const isGroupLeader = user.userGroups ? user.userGroups.length > 0 : false

    return (
      <TaskGroupItem
        key={activityGroup.id}
        taskGroup={activityGroup}
        ageGroupGuid={ageGroupGuid}
        language={language}
        icon={getActivityGroupIcon(activityGroup)}
        tasksTerm={status}
        itemType={ITEM_TYPES.TASK_GROUP}
        actionsComponent={actionTypes.taskGroupActions}
        showActions={isGroupLeader ? true : false}
      />
    )
  }

  return (
    <>
      <h4>
        <strong>{getTermInLanguage(translations, 'tehdyt')}</strong>
      </h4>
      {completedGroups.length > 0 ? (
        completedGroups.map((activityGroup) => {
          return renderTaskGroupItem(activityGroup)
        })
      ) : (
        <p>
          <span>
            {getTermInLanguage(
              translations,
              'ei-suoritettuja-aktiviteettiryhmia'
            )}
          </span>
        </p>
      )}
      <h4>
        <strong>{getTermInLanguage(translations, 'ei-viela-tehty')}</strong>
      </h4>
      {unfinishedGroups.length > 0 ? (
        unfinishedGroups.map((activityGroup) => {
          return renderTaskGroupItem(activityGroup)
        })
      ) : (
        <p>
          <span>
            {getTermInLanguage(
              translations,
              'ei-suoritettamattomia-aktiviteettiryhmia'
            )}
          </span>
        </p>
      )}
    </>
  )
}

export default UserAgeGroup
