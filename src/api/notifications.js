import { API_URL } from './variables'
import { fetchMember } from './index'

const BASE_URL = '/user/notifications'

export const fetchNotifications = async () => {
  try {
    const res = await fetch(`${API_URL}${BASE_URL}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    if (!res.ok) {
      return []
    }
    const notifications = await res.json()

    const leaders = notifications.reduce(async (acc, notification) => {
      if (!acc[notification.user_guid]) {
        const member = await fetchMember(notification.user_guid)
        acc[notification.user_guid] = member.name
      }
      return acc
    }, {})

    return {
      list: notifications,
      leaders: leaders,
    }
  } catch (err) {
    console.log('Error fetching notifications:', err)
    return []
  }
}

export const markNotificationsViewed = async () => {
  try {
    const res = await fetch(`${API_URL}${BASE_URL}/mark_viewed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
    return await res.json()
  } catch (err) {
    console.log('Error marking notifications viewed:', err)
    return false
  }
}

export const markNotificationViewed = async notificationId => {
  try {
    const res = await fetch(
      `${API_URL}${BASE_URL}/${notificationId}/mark_viewed`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }
    )
    return await res.json()
  } catch (err) {
    console.log('Error marking notifications viewed:', err)
    return false
  }
}
