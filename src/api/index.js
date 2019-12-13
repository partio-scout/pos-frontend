export const fetchAllContent = async () => {
  const res = await fetch(
    'https://pof-backend.partio.fi/spn-ohjelma-json-taysi/?postGUID=86b5b30817ce3649e590c5059ec88921'
  )
  const data = await res.json()
  const programData = data.program[0]
  console.log(programData)

  const { agegroups: ageGroups } = programData

  const guidsToExclude = [
    '0cdad01fccaf149bfdb5ae3a2cdd6d56',
    'e13d38602cec28781ed110c008385552',
  ]
  const ageGroupsToShow = ageGroups.filter(
    ageGroup => !guidsToExclude.includes(ageGroup.guid)
  )

  return ageGroupsToShow
}

export const fetchTaskDetails = async (guid, lang) => {
  const res = await fetch(
    `https://pof-backend.partio.fi/item-json/?postGUID=${guid}&lang=${lang}`
  )
  return await res.json()
}

export const fetchTranslations = async () => {
  const res = await fetch(
    'https://pof-backend.partio.fi/tag-translations-json/'
  )
  const data = await res.json()
  console.log(data)
}
