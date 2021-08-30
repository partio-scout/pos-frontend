import {
  SET_NOTIFICATION,
  SET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
  MARK_ALL_NOTIFICATIONS_READ,
  TOGGLE_SHOW_NOTIFICATIONS,
} from 'redux/actionTypes'

export const toggleShowNotifications = () => {
  return {
    type: TOGGLE_SHOW_NOTIFICATIONS,
    payload: null,
  }
}

export const setNotification = notification => {
  return {
    type: SET_NOTIFICATION,
    payload: notification,
  }
}

export const setNotifications = notifications => {
  return {
    type: SET_NOTIFICATIONS,
    payload: notifications,
  }
}

export const markNotificationRead = notificationId => {
  return {
    type: MARK_NOTIFICATION_READ,
    payload: notificationId,
  }
}

export const markAllNotificationsRead = () => {
  return {
    type: MARK_ALL_NOTIFICATIONS_READ,
    payload: null,
  }
}
