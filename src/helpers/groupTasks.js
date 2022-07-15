import { getItemId } from 'helpers'
/**
 * Get the tasks of group leaders group member or undefined if the group or member is not found
 * @param groupsId
 * @param memberId
 */
export const getMemberTasks = (groupId, memberId, groups) => {
  const group = groups.find((group) => group.id === Number(groupId))
  const member =
    group &&
    group.members.find((member) => member.memberId === Number(memberId))
  return member && member.memberTasks
}

/**
 * Get all the completed tasks for a member
 * @param member
 * @returns {null|*}
 */
export const getMemberCompletedTasks = (member, mandatoryTasks) => {
  if (member && member.tasks) {
    return mandatoryTasks.reduce((acc, task) => {
      if (member.tasks[getItemId(task)] === 'COMPLETED') {
        acc++
      }
      return acc
    }, 0)
  }
}

/**
 * Get a list of task group items from completed tasks
 * @param itemsByGuid
 * @param completedTaskItems
 */
export const getTaskGroupsWithItems = (itemsByGuid, completedTaskItems) => {
  const getActivities = (item) =>
    (item && item.item && item.item.activities) || []

  return Object.values(itemsByGuid)
    .filter((item) => item.type === 'TASK_GROUP' && getActivities(item).length)
    .reduce((acc, taskGroup) => {
      const itemTasks = completedTaskItems.filter((task) => {
        const activities = getActivities(taskGroup)
        return activities.find(
          (groupTask) =>
            groupTask &&
            task &&
            task.item &&
            getItemId(groupTask) === getItemId(task.item)
        )
      })
      if (itemTasks.length && taskGroup.item) {
        acc[getItemId(taskGroup.item)] = itemTasks
      }
      return acc
    }, {})
}

/**
 * Get the parent groups for a task group with the tasks array as the value for the last child group
 * @param itemsByGuid
 * @param groupGuid
 * @param groupTasks
 */
export const getGroupParent = (itemsByGuid, groupGuid, groupTasks) => {
  const group = itemsByGuid[groupGuid]
  if (groupTasks) {
    return {
      [group.id]: groupTasks,
    }
  }
  return group.id
}

/**
 * Get all the child groups for a group
 * @param itemsByGuid
 * @param completedTasks
 */
export const getTaskGroupsWithChildTaskGroups = (
  itemsByGuid,
  completedTasks,
  language,
  getItemId
) => {
  const completedTaskItems = completedTasks.map(
    (taskGuid) => itemsByGuid[taskGuid]
  )
  const taskGroupsWithItems = getTaskGroupsWithItems(
    itemsByGuid,
    completedTaskItems,
    getItemId
  )
  return Object.keys(taskGroupsWithItems).reduce((acc, taskGroupGuid) => {
    const parent = getGroupParent(
      itemsByGuid,
      taskGroupGuid,
      taskGroupsWithItems[taskGroupGuid]
    )
    const parentGuid = Object.keys(parent)[0]
    if (acc[parentGuid]) {
      const parentValue = Object.values(parent)[0]

      acc[parentGuid] = {
        ...acc[parentGuid],
        ...parentValue,
      }
      return acc
    }
    return {
      ...acc,
      ...parent,
    }
  }, {})
}
