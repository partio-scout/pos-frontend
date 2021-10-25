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
export const getMemberCompletedTasks = (member, taskGroupTasks) => {
  if (member && member.tasks) {
    const completedTasks = taskGroupTasks.reduce((acc, task) => {
      if (member.tasks[task.wp_guid] === 'COMPLETED') {
        acc++
      }
      return acc
    }, 0)
    return completedTasks
  }
}
/* TODO: Check if member task is completed and then check whether the task is required or optional
 *  and add +1 to the corresponding value in the accumulator
 *
 *  { mandatory: 0, optional: 0 }
 */

/**
 * Get a list of task group items from completed tasks
 * @param itemsByGuid
 * @param completedTaskItems
 */
export const getTaskGroupsWithItems = (itemsByGuid, completedTaskItems) =>
  Object.values(itemsByGuid)
    .filter((item) => item.type === 'TASK_GROUP' && item.item.activities.length)
    .reduce((acc, item) => {
      const itemTasks = completedTaskItems.filter((task) => {
        return item.item.activities.find((groupTask) => {
          return groupTask.wp_guid === task.item.wp_guid
        })
      })
      if (itemTasks.length) {
        acc[item.item.wp_guid] = itemTasks
      }
      return acc
    }, {})

/**
 * Get the parent groups for a task group with the tasks array as the value for the last child group
 * @param itemsByGuid
 * @param groupGuid
 * @param groupTasks
 */
export const getGroupParent = (itemsByGuid, groupGuid, groupTasks) => {
  const group = itemsByGuid[groupGuid]
  // if (group.parentGuid === group.ageGroupGuid) {
  if (groupTasks) {
    return {
      [group.id]: groupTasks,
    }
  }
  return group.id
  // }
  // return {
  //   [getGroupParent(itemsByGuid, group.parentGuid)]: {
  //     [groupGuid]: groupTasks,
  //   },
  // }
}

/**
 * Get all the child groups for a group
 * @param itemsByGuid
 * @param completedTasks
 */
export const getTaskGroupsWithChildTaskGroups = (
  itemsByGuid,
  completedTasks
) => {
  const completedTaskItems = completedTasks.map(
    (taskGuid) => itemsByGuid[taskGuid]
  )
  const taskGroupsWithItems = getTaskGroupsWithItems(
    itemsByGuid,
    completedTaskItems
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
