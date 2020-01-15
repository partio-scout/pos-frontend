// CONTENT (Partio API)
export const fetchAllContent = async () => {
  const res = await fetch(
    'https://pof-backend.partio.fi/spn-ohjelma-json-taysi/?postGUID=86b5b30817ce3649e590c5059ec88921'
  )
  const data = await res.json()
  const programData = data.program[0]
  console.log(programData)

  const { agegroups: ageGroups } = programData

  return ageGroups
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
  return data
}

// POS BACKEND

export const API_URL = 'http://localhost:3001'

export const postTaskEntry = async entry => {
  const res = await fetch(`${API_URL}/task-entry`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}

export const postTaskFavourite = async entry => {
  const res = await fetch(`${API_URL}/favourite`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return data
}

export const fetchFavourites = async () => {
  const res = await fetch(`${API_URL}/favourites/1`)
  if (!res.ok) {
    return []
  }
  const data = await res.json()
  const favourites = data.map(favourite => favourite.task_guid)
  return favourites
}
