import React from 'react'
import { useSelector } from 'react-redux'
import TaskGroupItem from 'components/TaskGroupItem'
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
  const generalTranslations = useSelector((state) => state.translations.yleiset)
  const userTasks = useSelector((state) => state.tasks)
  const activityGroupById = useSelector((state) => state.activityGroups)

  const renderTaskGroupItem = (activityGroup) => {
    const status = getTaskGroupStatus(
      activityGroupById[activityGroup.id],
      userTasks,
      getTermInLanguage(generalTranslations, 'done', language)
    )
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
  }

  return (
    <>
      <h4>
        <strong>Tehdyt</strong>
      </h4>
      {completedGroups.length > 0 ? (
        completedGroups.map((activityGroup) => {
          return renderTaskGroupItem(activityGroup)
        })
      ) : (
        <p>
          <span>Ei suoritettuja aktiviteettiryhmiä</span>
        </p>
      )}
      <h4>
        <strong>Ei vielä tehty</strong>
      </h4>
      {unfinishedGroups.length > 0 ? (
        unfinishedGroups.map((activityGroup) => {
          return renderTaskGroupItem(activityGroup)
        })
      ) : (
        <p>
          <span>Ei suorittamattomia aktiviteettiryhmiä</span>
        </p>
      )}
    </>
  )
}

export default UserAgeGroup
