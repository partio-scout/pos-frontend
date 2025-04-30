// CONTENT (POF API)
import { PARTIO_API_URL } from './variables'

export const fetchAgeGroups = async (language) => {
  const res = await fetch(
    `${PARTIO_API_URL}/api/age-groups?locale=${language}&populate[activity_groups]=*&populate[logo]=*`
  )
  const result = await res.json()

  const ageGroups = result.data

  return ageGroups
}

export const fetchSingleAgeGroup = async (id) => {
  const res = await fetch(
    `${PARTIO_API_URL}/api/age-groups/${id}?populate[activity_groups]=*&populate[logo]=*`
  )
  const result = await res.json()

  const ageGroup = result.data

  return ageGroup
}

export const fetchActivityGroups = async (language) => {
  const locale = language === undefined ? 'fi' : language

  let activityGroups = []
  let currentPage = 1
  let pageCount = 1

  while (currentPage <= pageCount) {
    const res = await fetch(
      `${PARTIO_API_URL}/api/activity-groups?locale=${locale}&pagination[page]=${currentPage}&populate[activities]=*&populate[age_group]=*&populate[activity_group_category]=*&populate[logo]=*`
    )
    const data = await res.json()
    activityGroups = activityGroups.concat(data.data)
    pageCount = data.meta.pagination.pageCount
    currentPage++
  }

  return activityGroups
}

export const fetchSingleActivityGroup = async (id) => {
  const res = await fetch(
    `${PARTIO_API_URL}/api/activity-groups/${id}?populate[activities][populate][suggestions][populate]=*&populate[age_group]&populate[activity_group_category]=*&populate[logo]=*`
  )
  const activityGroup = await res.json()
  return activityGroup
}

export const fetchActivities = async () => {
  const res = await fetch(
    `${PARTIO_API_URL}/api/activities?populate[suggestions]=%2&populate[logo]=*`
  )
  const activities = await res.json()
  return activities
}

export const fetchActivity = async (wp_guid, language) => {
  const res = await fetch(
    `${PARTIO_API_URL}/api/activities?wp_guid=${wp_guid}&locale=${language}&populate[suggestions]=*&populate[logo]=*`
  )
  const activity = await res.json()
  return activity
}

export const fetchTaskDetails = async (guid, lang) => {
  const res = await fetch(
    `https://pof-backend.partio.fi/item-json/?postGUID=${guid}&lang=${lang}`
  )
  return await res.json()
}

export const fetchTranslations = async (lang) => {
  const res = await fetch(`${PARTIO_API_URL}/api/setting?locale=${lang}`)

  const data = await res.json()
  const translations = data?.data?.translations || {}

  return translations
}

// POS BACKEND
import { API_URL } from './variables'
import {
  fetchNotifications,
  markNotificationViewed,
  markNotificationsViewed,
} from './notifications'

export const postTaskEntry = async (entry) => {
  const res = await fetch(`${API_URL}/task-entry`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return await res.json()
}

export const postTaskGroupEntry = async (data, taskgroup_guid) => {
  const res = await fetch(
    `${API_URL}/groups/mark-taskgroup-done/${taskgroup_guid}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )
  return res.json()
}

export const deleteTaskGroupEntry = async (data, taskgroup_guid) => {
  const res = await fetch(
    `${API_URL}/groups/delete-taskgroup-entry/${taskgroup_guid}`,
    {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )
  return res.json()
}

export const postMemberTaskEntry = async (entry) => {
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

export const removeMemberTaskEntry = async (entry) => {
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

export const acceptGroupMemberTasks = async (memberGroups, taskId) => {
  const res = await fetch(`${API_URL}/groups/mark-task-done/${taskId}`, {
    method: 'POST',
    body: JSON.stringify(memberGroups),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return res.json()
}

export const deleteGroupMemberTasks = async (memberGroups, taskId) => {
  const res = await fetch(`${API_URL}/groups/archive-task-entry/${taskId}`, {
    method: 'DELETE',
    body: JSON.stringify(memberGroups),
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
    return await res.json()
  } catch (error) {
    console.log('Error fetching users tasks')
    return []
  }
}

export const fetchUserTaskGroups = async () => {
  try {
    const res = await fetch(`${API_URL}/task-group-entries`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!res.ok) {
      console.log(`FetchUserTaskGroups: ${res.status} ${res.statusText}`)
      return []
    }
    return await res.json()
  } catch (error) {
    console.log('Error fetching users taskgroups')
    return []
  }
}

export const postTaskFavourite = async (entry) => {
  const res = await fetch(`${API_URL}/favourite`, {
    method: 'POST',
    body: JSON.stringify(entry),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return await res.json()
}

export const deleteFavouriteTask = async (entry) => {
  const res = await fetch(`${API_URL}/favourite/${entry.task_guid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return await res.json()
}

export const deleteActiveTask = async (entry) => {
  const res = await fetch(`${API_URL}/active/${entry.task_guid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })
  return await res.json()
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
    const favourites = data.map((favourite) => favourite.task_guid)
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
    return await res.json()
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
    return await res.json()
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
    return await res.json()
  } catch (err) {
    console.log('Error fetching groups: ', err)
    return {}
  }
}

export const postAgeGroupEntry = async (data, agegroup_guid) => {
  const res = await fetch(
    `${API_URL}/groups/mark-agegroup-done/${agegroup_guid}`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )
  return res.json()
}

export const fetchUserCompletedAgeGroups = async () => {
  try {
    const res = await fetch(`${API_URL}/agegroup-entries`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!res.ok) {
      console.log(
        `FetchUserCompletedAgeGroups: ${res.status} ${res.statusText}`
      )
      return []
    }
    return await res.json()
  } catch (error) {
    console.log('Error fetching users agegroups')
    return []
  }
}

export const deleteAgegroupEntry = async (data, agegroup_guid) => {
  const res = await fetch(
    `${API_URL}/groups/delete-agegroup-entry/${agegroup_guid}`,
    {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  )
  return await res.json()
}

export {
  API_URL,
  fetchNotifications,
  markNotificationViewed,
  markNotificationsViewed,
}
