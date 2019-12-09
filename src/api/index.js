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

  const subTaskGroupsToShow = []

  const taskGroups = programData.agegroups.reduce((acc, ageGroup) => {
    const { taskgroups, ...rest } = ageGroup // eslint-disable-line

    taskgroups.forEach(group => {
      const { tasks, taskgroups: subTaskGroups, ...rest } = group
      subTaskGroups.forEach(subTaskGroup => {
        const { tasks: subTasks, ...subTaskGroupRest } = subTaskGroup // eslint-disable-line
        subTaskGroupsToShow.push({
          ...subTaskGroupRest,
          taskGroupGuid: group.guid,
          amountOfTasks: subTasks ? subTasks.length : 0,
        })
      })
      acc.push({
        ...rest,
        amountOfTasks: tasks ? tasks.length : 0,
        amountOfTaskGroups: subTaskGroups ? subTaskGroups.length : 0,
        ageGroupGuid: ageGroup.guid,
      })
    })
    return acc
  }, [])

  return {
    ageGroups: ageGroupsToShow,
    taskGroups,
    subTaskGroups: subTaskGroupsToShow,
  }
}

export const fetchTranslations = async () => {
  const res = await fetch(
    'https://pof-backend-staging.partio.fi/tag-translations-json/'
  )
  const data = await res.json()
  console.log(data)
}
