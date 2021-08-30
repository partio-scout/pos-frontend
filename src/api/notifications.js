import { API_URL } from './variables'

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
    return await res.json()
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
