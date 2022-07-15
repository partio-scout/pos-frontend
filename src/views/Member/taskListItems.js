import React from 'react'

import ListItem from 'components/ListItem'
import { actionTypes } from 'components/Actions'
import { ITEM_TYPES } from '../../consts'
import { getActivityGroupIcon, getItemId } from '../../helpers'

export const LIST_ITEM_TYPES = {
  ACTIVE_LIST_ITEM: 'activeListItem',
  COMPLETION_REQUEST_LIST_ITEM: 'completionRequestItem',
}

const ActiveListItem = ({ task, parent }) => (
  <ListItem
    key={getItemId(task.item)}
    guid={task.id}
    title={task.item.title}
    subTitle={parent.title}
    icon={getActivityGroupIcon(parent)}
    itemType={ITEM_TYPES.TASK}
    actionsComponent={actionTypes.groupLeaderActions}
  />
)

const CompletionRequestedItem = ({ task, parent, groupId, memberId }) => (
  <ListItem
    key={getItemId(task.item)}
    guid={task.id}
    groupGuid={Number(groupId)}
    userGuid={Number(memberId)}
    title={task.item.title}
    icon={getActivityGroupIcon(parent)}
    subTitle={parent.title}
    itemType={ITEM_TYPES.TASK}
    actionsComponent={actionTypes.groupLeaderActions}
    showActions
  />
)

const LIST_ITEMS = {
  [LIST_ITEM_TYPES.ACTIVE_LIST_ITEM]: ActiveListItem,
  [LIST_ITEM_TYPES.COMPLETION_REQUEST_LIST_ITEM]: CompletionRequestedItem,
}

const MemberTaskListItem = ({
  itemsByGuid,
  taskGuid,
  activityGroups,
  language,
  type,
  ...props
}) => {
  const task = itemsByGuid[taskGuid]

  if (!task || !task.item || task.item.locale !== language) return null

  const parent = activityGroups[task.item.activity_group]
  if (!parent) return null

  const Component = LIST_ITEMS[type]

  return Component ? <Component {...props} task={task} parent={parent} /> : null
}

export default MemberTaskListItem
