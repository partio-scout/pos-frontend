import {
  SET_NOTIFICATION,
  SET_NOTIFICATIONS,
  MARK_NOTIFICATION_READ,
} from 'redux/actionTypes'

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
