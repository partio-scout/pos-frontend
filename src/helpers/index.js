export const determineLanguageFromUrl = url => {
  const urlObj = new URL(url)
  return urlObj.searchParams.get('lang') || 'fi'
}

export const getAgeGroupTitleWithoutAges = title =>
  title.split('(')[0].split(':')[0]

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
  if ((taskgroups, tasks)) return 'TASK_GROUP'
  if (taskgroups) return 'AGE_GROUP'
  return 'TASK'
}

export const deepFlatten = items => {
  const flattener = (items, depth = 0, parentGuid, ageGroupIndex) => {
    const CHILD_GROUPS = ['taskgroups', 'tasks']

    if (!items) {
      return
    }

    const parsedItems = items.map((x, i) => ({
      depth,
      parentGuid,
      item: x,
      guid: x.guid,
      type: getItemType(x),
      ageGroupIndex: depth === 0 ? i : ageGroupIndex,
    }))

    return [
      ...parsedItems,
      ...items
        .map((x, i) =>
          CHILD_GROUPS.map(childrenKey =>
            flattener(
              x[childrenKey],
              depth + 1,
              x.guid,
              depth === 0 ? i : ageGroupIndex
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
