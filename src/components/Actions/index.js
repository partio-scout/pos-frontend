import React, { useState } from 'react'
import TaskActions from 'components/TaskActions'
import { MoreHorizontal } from 'react-feather'
import { postTaskEntry } from 'api'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'

const Actions = ({ guid, itemType, className }) => {
  const [showActions, setShowActions] = useState(false)

  const markTaskDone = async () => {
    await postTaskEntry({
      user_guid: 1,
      created_by: 1,
      task_guid: guid,
      completion_status: COMPLETION_STATUS.COMPLETED,
    })
    setShowActions(false)
  }

  return (
    <>
      <MoreHorizontal
        onClick={() => setShowActions(true)}
        className={className}
      />
      {itemType === ITEM_TYPES.TASK && showActions && (
        <TaskActions
          onCancel={() => setShowActions(false)}
          onMarkDone={() => markTaskDone()}
        />
      )}
    </>
  )
}

export default Actions
