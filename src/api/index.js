// CONTENT (Partio API)
export const fetchAllContent = async () => {
  const res = await fetch(process.env.REACT_APP_PARTIO_API_URL)
  const data = await res.json()
  const programData = data.program[0]

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
  return data
}

// POS BACKEND

export const API_URL = process.env.REACT_APP_API_URL

export const postTaskEntry = async entry => {
  const res = await fetch(`${API_URL}/task-entry`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const data = await res.json()
  return data
}

export const postMemberTaskEntry = async entry => {
  const res = await fetch(`${API_URL}/member-entry`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return res.json()
}

export const fetchUserTasks = async () => {
  try {
    const res = await fetch(`${API_URL}/task-entries`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!res.ok) {
      console.log(`FetchUserTasks: ${res.status} ${res.statusText}`)
      return []
    }
    const data = await res.json()
    return data
  } catch (error) {
    console.log('Error fetching users tasks')
    return []
  }
}

export const postTaskFavourite = async entry => {
  const res = await fetch(`${API_URL}/favourite`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const data = await res.json()
  return data
}

export const deleteFavouriteTask = async entry => {
  const res = await fetch(`${API_URL}/favourite/${entry.task_guid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const data = await res.json()
  return data
}

export const deleteActiveTask = async entry => {
  const res = await fetch(`${API_URL}/active/${entry.task_guid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  const data = await res.json()
  return data
}

export const fetchFavourites = async () => {
  try {
    const res = await fetch(`${API_URL}/favourites`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!res.ok) {
      return []
    }
    const data = await res.json()
    const favourites = data.map(favourite => favourite.task_guid)
    return favourites
  } catch (error) {
    console.log('error fetching favourites', error)
    return []
  }
}

export const fetchUser = async () => {
  try {
    const res = await fetch(`${API_URL}/user`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!res.ok) {
      if (res.status !== 401) {
        console.log('error fetching user', res.status, res.statusText)
      }

      return {}
    }
    const data = await res.json()
    return data
  } catch (err) {
    console.log('User network error: ', err)
    return {}
  }
}

export const fetchProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data
  } catch (err) {
    console.log('Error fetching profile: ', err)
    return {}
  }
}

export const fetchUserGroups = async () => {
  try {
    const res = await fetch(`${API_URL}/groups`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!res.ok) {
      return []
    }
    const data = await res.json()
    return data
  } catch (err) {
    console.log('Error fetching groups: ', err)
    return {}
  }
}
