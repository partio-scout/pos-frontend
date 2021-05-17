import { ITEM_TYPES } from 'consts'

export const determineLanguageFromUrl = url => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get('lang') || 'fi'
}

export const getAgeGroupTitleWithoutAges = title =>
  title
    .split('(')[0]
    .split(':')[0]
    .trim()

export const getTermInLanguage = (translationGroup, termKey, language) => {
  const translationsInLanguage = translationGroup.find(
    translation => translation.lang === language
  )
  if (translationsInLanguage) {
    const item = translationsInLanguage.items.find(item => item.key === termKey)
    if (item && item.value) {
      return item.value
    }
  }
}

export const getItemType = item => {
  const { taskgroups, tasks } = item
  if ((taskgroups, tasks)) return ITEM_TYPES.TASK_GROUP
  if (taskgroups) return ITEM_TYPES.AGE_GROUP
  return ITEM_TYPES.TASK
}

export const deepFlatten = items => {
  const flattener = (items, depth = 0, parentGuid, ageGroupGuid) => {
    const CHILD_GROUPS = ['taskgroups', 'tasks']

    if (!items) {
      return
    }

    const parsedItems = items.map(x => ({
      depth,
      parentGuid,
      item: x,
      guid: x.guid,
      type: getItemType(x),
      ageGroupGuid: depth === 0 ? x.guid : ageGroupGuid,
    }))

    return [
      ...parsedItems,
      ...items
        .map(x =>
          CHILD_GROUPS.map(childrenKey =>
            flattener(
              x[childrenKey],
              depth + 1,
              x.guid,
              depth === 0 ? x.guid : ageGroupGuid
            )
          )
        )
        .flat()
        .filter(Boolean),
    ]
  }

  return flattener(items)
    .flat(Infinity)
    .reduce((acc, item) => {
      acc[item.guid] = item
      return acc
    }, {})
}

export const getTaskGroupStatus = (taskGroup, userTasks, label) => {
  const completedTasks = taskGroup.tasks.reduce((taskCount, task) => {
    if (userTasks[task.guid] === 'COMPLETED') {
      taskCount++
    }
    return taskCount
  }, 0)
  return `${label}: ${completedTasks} / ${taskGroup.tasks.length}`
}

export const getGroupTasks = group => {
  const taskTypes = {
    mandatory: [],
    optional: [],
  }
  const mandatory = group.mandatory_tasks.split(',').filter(task => task !== '')
  taskTypes.mandatory = taskTypes.mandatory.concat(mandatory)

  if (mandatory.length !== group.tasks.length) {
    taskTypes.optional = taskTypes.optional.concat(
      group.tasks
        .filter(task => !mandatory.includes(task.guid))
        .map(task => task.guid)
    )
  }

  if (group.taskgroups.length > 0) {
    group.taskgroups
      .map(taskGroup => getGroupTasks(taskGroup))
      .reduce((acc, curr) => {
        acc.mandatory = acc.mandatory.concat(curr.mandatory)
        acc.optional = acc.optional.concat(curr.optional)
        return acc
      }, taskTypes)
  }

  return taskTypes
}

export const getAgeGroupTasks = ageGroup => {
  return ageGroup.taskgroups
    .map(group => getGroupTasks(group))
    .reduce(
      (acc, curr) => {
        acc.mandatory = acc.mandatory.concat(curr.mandatory)
        acc.optional = acc.optional.concat(curr.optional)
        return acc
      },
      {
        mandatory: [],
        optional: [],
      }
    )
}

/**
 * Get a list of the task group guids for the task groups that have their title translated
 * and contain at least one translated task from the given language
 * @param ageGroup The ageGroup object to get the task groups for
 * @param itemsByGuid An object containing all items with guid as the key
 * @param language The selected language
 * @returns {Array[string]} An array of TaskGroup guids
 */
export const getAgeGroupsTranslatedTaskGroups = (
  ageGroup,
  itemsByGuid,
  language
) => {
  return ageGroup.taskgroups.reduce((acc, taskGroupGuid) => {
    const taskGroup = itemsByGuid[taskGroupGuid.guid].item
    const taskGroupTranslations = taskGroup.languages.find(
      group => group.lang === language
    )
    const hasTranslatedTasks = taskGroupHasTranslatedTasks(taskGroup, language)
    if (
      taskGroupTranslations &&
      taskGroupTranslations.title &&
      hasTranslatedTasks
    ) {
      acc.push(taskGroupGuid.guid)
    }
    return acc
  }, [])
}

/**
 * Get all the translated tasks for a task group for a specific language
 * @param taskGroup The task group to get the tasks for
 * @param language The language to filter by
 * @returns {Array[Task]} Return an array of task objects
 */
export const getTaskGroupsTranslatedTasks = (taskGroup, language) => {
  return taskGroup.tasks.reduce((acc, task) => {
    const translations = task.languages.find(lang => lang.lang === language)
    if (translations && translations.title) {
      acc.push(task)
    }
    return acc
  }, [])
}

/**
 * Check if a task group has 1 or more tasks translated to the given language
 * @param taskGroup The task group to check
 * @param language The language to check the translations for
 * @returns {boolean} True if task group has translated tasks and false otherwise
 */
export const taskGroupHasTranslatedTasks = (taskGroup, language) => {
  return getTaskGroupsTranslatedTasks(taskGroup, language).length > 0
}

/**
 * Checks if The given age group has translated task groups
 * @param ageGroup The ageGroup object to check
 * @param itemsByGuid An object containing all items with guid as the key
 * @param language The selected language
 * @returns {boolean} True if age groups has translated task groups and false otherwise
 */
export const ageGroupHasTranslatedTaskGroups = (
  ageGroup,
  itemsByGuid,
  language
) => {
  const taskGroups = getAgeGroupsTranslatedTaskGroups(
    ageGroup,
    itemsByGuid,
    language
  )
  return taskGroups.length > 0
}

export const getAgeGroupStatus = (ageGroup, userTasks) => {
  const ageGroupTasks = getAgeGroupTasks(ageGroup)
  const completedMandatory = ageGroupTasks.mandatory.filter(
    task => userTasks[task] === 'COMPLETED'
  )
  const completedOptional = ageGroupTasks.optional.filter(
    task => userTasks[task] === 'COMPLETED'
  )

  return {
    mandatory: `${completedMandatory.length} / ${ageGroupTasks.mandatory.length}`,
    optional: `${completedOptional.length} / ${ageGroupTasks.optional.length}`,
  }
}

export const getCompletedTaskGroups = (ageGroup, userTasks) => {
  return ageGroup.taskgroups
    .filter(taskGroup => {
      const mandatory = taskGroup.mandatory_tasks.split(',')
      if (mandatory.length === 0) return false
      return mandatory.every(guid => userTasks[guid] === 'COMPLETED')
    })
    .map(taskGroup => taskGroup.guid)
}

export const getAgeGroupCompletion = (ageGroup, userTasks) => {
  const ageGroupTasks = getAgeGroupTasks(ageGroup)
  const completedMandatory = ageGroupTasks.mandatory.filter(
    task => userTasks[task] === 'COMPLETED'
  )

  return (
    completedMandatory.length === ageGroupTasks.mandatory.length &&
    completedMandatory.length > 0
  )
}

//TODO: favourites, activeTasks, completedTasks, isFavourite, isActive and isCompleted helpers
