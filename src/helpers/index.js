import { ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'

export const determineLanguageFromUrl = (url) => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get('lang') || 'fi'
}

export const getAgeGroupTitleWithoutAges = (title) =>
  title.split('(')[0].split(':')[0].trim()

export const getTermInLanguage = (translationGroup, termKey, language) => {
  const translationsInLanguage = translationGroup.find(
    (translation) => translation.lang === language
  )
  if (translationsInLanguage) {
    const item = translationsInLanguage.items.find(
      (item) => item.key === termKey
    )
    if (item && item.value) {
      return item.value
    }
  }
}

export const getItemType = (item) => {
  const { activity_groups, activities } = item
  if (activities) return ITEM_TYPES.TASK_GROUP
  if (activity_groups) return ITEM_TYPES.AGE_GROUP
  return ITEM_TYPES.TASK
}

export const deepFlatten = (items) => {
  const flattener = (items) => {
    const CHILD_GROUPS = ['activities']

    if (!items) {
      return
    }
    const parsedItems = items.map((x) => ({
      id: x.wp_guid,
      item: x,
      type: getItemType(x),
    }))

    return [
      ...parsedItems,
      ...items
        .map((x) =>
          CHILD_GROUPS.map((childrenKey) =>
            flattener(x[childrenKey], x.wp_guid)
          )
        )
        .flat()
        .filter(Boolean),
    ]
  }

  return flattener(items)
    .flat(Infinity)
    .reduce((acc, item) => {
      acc[item.id] = item
      return acc
    }, {})
}

export const getTaskGroupStatus = (taskGroup, userTasks, label) => {
  const completedTasks = taskGroup.activities.reduce((taskCount, task) => {
    if (userTasks[task.wp_guid] === 'COMPLETED') {
      taskCount++
    }
    return taskCount
  }, 0)
  return `${label}: ${completedTasks} / ${taskGroup.activities.length}`
}

export const getGroupTasks = (group) => {
  const taskTypes = {
    mandatory: [],
    optional: [],
  }
  const mandatoryTasks = group.activities.filter(
    (activity) => activity.mandatory === true
  )
  taskTypes.mandatory = taskTypes.mandatory.concat(
    mandatoryTasks.map((mandatory) => mandatory.wp_guid)
  )

  if (mandatoryTasks.length !== group.activities.length) {
    taskTypes.optional = taskTypes.optional.concat(
      group.activities
        .filter((activity) => !taskTypes.mandatory.includes(activity.wp_guid))
        .map((activity) => activity.wp_guid)
    )
  }
  return taskTypes
}

export const getAgeGroupTasks = (ageGroup) => {
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  return ageGroup.activity_groups.reduce(
    (acc, curr) => {
      const activityGroup = itemsByGuid[curr.wp_guid]
      const groupTask = getGroupTasks(activityGroup.item)
      acc.mandatory = acc.mandatory.concat(groupTask.mandatory)
      acc.optional = acc.optional.concat(groupTask.optional)
      return acc
    },
    {
      mandatory: [],
      optional: [],
    }
  )
}

/**
 * Get all the translated task groups from a list of task groups for a specific language
 * @param taskGroups The list of the task group guids
 * @param itemsByGuid An object containing all items with guid as the key
 * @param language The selected language
 * @returns {Array[string]} An array of TaskGroup guids
 */
// export const getTranslatedTaskGroups = (taskGroups, itemsByGuid, language) => {
//   return taskGroups.reduce((acc, taskGroupGuid) => {
//     const taskGroup =
//       itemsByGuid[taskGroupGuid.guid] && itemsByGuid[taskGroupGuid.guid].item
//     if (!taskGroup) return acc

//     const taskGroupTranslations = taskGroup.localizations.find(
//       group => group.lang === language
//     )
//     const hasTranslatedTasks = taskGroupHasTranslatedTasks(taskGroup, language)
//     if (
//       taskGroupTranslations &&
//       taskGroupTranslations.title &&
//       hasTranslatedTasks
//     ) {
//       acc.push(taskGroupGuid.guid)
//     }
//     return acc
//   }, [])
// }

/**
 * Check if a task group has 1 or more tasks translated to the given language
 * @param taskGroup The task group to check
 * @param language The language to check the translations for
 * @returns {boolean} True if the task group or its sub task group has translated tasks and false otherwise
 */
// export const taskGroupHasTranslatedTasks = (taskGroup, language) => {
//   const hasSubTaskGroups =
//     taskGroup.taskgroups && taskGroup.taskgroups.length > 0
//   if (!hasSubTaskGroups) {
//     return getTranslatedTasks(taskGroup.tasks, language).length > 0
//   } else {
//     for (let group of taskGroup.taskgroups) {
//       if (taskGroupHasTranslatedTasks(group, language)) {
//         return true
//       }
//     }
//     return false
//   }
// }

/**
 * Checks if The given age group has translated task groups
 * @param ageGroup The ageGroup object to check
 * @param itemsByGuid An object containing all items with guid as the key
 * @param language The selected language
 * @returns {boolean} True if age groups has translated task groups and false otherwise
 */
// export const ageGroupHasTranslatedTaskGroups = (
//   ageGroup,
//   itemsByGuid,
//   language
// ) => {
//   return (
//     getTranslatedTaskGroups(ageGroup.activity_groups, itemsByGuid, language).length >
//     0
//   )
// }

export const getAgeGroupStatus = (ageGroup, userTasks) => {
  const ageGroupTasks = getAgeGroupTasks(ageGroup)
  const completedMandatory = ageGroupTasks.mandatory.filter(
    (task) => userTasks[task] === 'COMPLETED'
  )
  const completedOptional = ageGroupTasks.optional.filter(
    (task) => userTasks[task] === 'COMPLETED'
  )

  return {
    mandatory: `${completedMandatory.length} / ${ageGroupTasks.mandatory.length}`,
    optional: `${completedOptional.length} / ${ageGroupTasks.optional.length}`,
  }
}

export const getCompletedTaskGroups = (ageGroup, userTasks) => {
  return ageGroup.activity_groups
    .filter((taskGroup) => {
      const mandatory = taskGroup.mandatory_tasks.split(',')
      if (mandatory.length === 0) return false
      return mandatory.every((guid) => userTasks[guid] === 'COMPLETED')
    })
    .map((taskGroup) => taskGroup.guid)
}

export const getAgeGroupCompletion = (ageGroup, userTasks) => {
  const ageGroupTasks = getAgeGroupTasks(ageGroup)
  const completedMandatory = ageGroupTasks.mandatory.filter(
    (task) => userTasks[task] === 'COMPLETED'
  )

  return (
    completedMandatory.length === ageGroupTasks.mandatory.length &&
    completedMandatory.length > 0
  )
}

/* taskgroupeilla ei ole enään sisäisiä taskgroupeja */
// const reduceTaskGroup = (accumulator, taskGroup) => {
//   const itemsByGuid = useSelector((state) => state.itemsByGuid)
//   const activityGroup = itemsByGuid[taskGroup.wp_guid]
//     //const mandatoryTasks = []
//   activityGroup.item.activities.map(activity => {

//   })
//   if (taskGroup.mandatory_tasks.length) {
//     accumulator.mandatoryTasks.push(...taskGroup.mandatory_tasks.split(','))
//   }
//   accumulator.taskGroupRequirements[taskGroup.guid] = {
//     additionalTasksCount: taskGroup.additional_tasks_count,
//     mandatoryTasks: taskGroup.mandatory_tasks.split(','),
//   }
//   return accumulator
// }

// export const getTaskGroupRequirements = ageGroups => {
//   return ageGroups.reduce(
//     (value, ageGroup) => {
//       const taskGroupRequirements = ageGroup.activity_groups.reduce(
//         reduceTaskGroup,
//         { taskGroupRequirements: {}, mandatoryTasks: [] }
//       )
//       value = {
//         taskGroupRequirements: {
//           ...value.taskGroupRequirements,
//           ...taskGroupRequirements.taskGroupRequirements,
//         },
//         mandatoryTasks: [
//           ...value.mandatoryTasks,
//           ...taskGroupRequirements.mandatoryTasks,
//         ],
//       }
//       return value
//     },
//     { taskGroupRequirements: {}, mandatoryTasks: [] }
//   )
// }

//TODO: favourites, activeTasks, completedTasks, isFavourite, isActive and isCompleted helpers
