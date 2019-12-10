export const fetchAllContent = async () => {
  const res = await fetch(
    'https://pof-backend-staging.partio.fi/spn-ohjelma-json-taysi/?postGUID=86b5b30817ce3649e590c5059ec88921'
  )
  const data = await res.json()
  const programData = data.program[0]
  console.log(programData)

  const ageGroups = programData.agegroups.map(ageGroup => {
    const { taskgroups, ...rest } = ageGroup // eslint-disable-line
    return rest
  })
  const guidsToExclude = [
    '0cdad01fccaf149bfdb5ae3a2cdd6d56',
    'e13d38602cec28781ed110c008385552',
  ]
  const ageGroupsToShow = ageGroups.filter(
    ageGroup => !guidsToExclude.includes(ageGroup.guid)
  )

  const taskGroups = programData.agegroups.reduce((acc, ageGroup) => {
    const { taskgroups, ...rest } = ageGroup // eslint-disable-line

    // this function adds the guid of the agegroup to all nested taskgroups
    // this way we can easily deduce which agegroup the (sub)taskgroup is related to
    const addAgeGroupGuids = items =>
      items.map(item => {
        if (item.taskgroups) {
          return {
            ...item,
            ageGroupGuid: ageGroup.guid,
            taskgroups: addAgeGroupGuids(item.taskgroups),
          }
        }
        return { ...item, ageGroupGuid: ageGroup.guid }
      })

    taskgroups.forEach(group => {
      const { taskgroups: subTaskGroups } = group
      const subTaskGroupsWithAgeGroupGuids = addAgeGroupGuids(subTaskGroups)
      acc.push({
        ...group,
        taskgroups: subTaskGroupsWithAgeGroupGuids,
        ageGroupGuid: ageGroup.guid,
      })
    })
    return acc
  }, [])

  return {
    ageGroups: ageGroupsToShow,
    taskGroups,
  }
}

export const fetchTranslations = async () => {
  const res = await fetch(
    'https://pof-backend-staging.partio.fi/tag-translations-json/'
  )
  const data = await res.json()
  console.log(data)
}
