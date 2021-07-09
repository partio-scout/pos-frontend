import {
  SET_NOTIFICATIONS,
  SET_NOTIFICATION,
  MARK_NOTIFICATION_READ,
} from 'redux/actionTypes'

const findIndex = (array, id) =>
  array.findIndex(notification => notification.id === id)

const updateNotification = (notification, notifications) => {
  const index = findIndex(notifications, notification.id)
  const newState = notifications.slice()
  newState.splice(index, 1, notification)
  return newState
}

const markNotificationRead = (notificationId, notifications) => {
  const index = findIndex(notifications, notificationId)
  const newState = notifications.slice()
  newState[index].viewed = true
  return newState
}

export const notifications = (state = [], action) => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      return action.payload
    case SET_NOTIFICATION:
      return updateNotification(action.payload, state)
    case MARK_NOTIFICATION_READ:
      return markNotificationRead(action.payload, state)
    default:
      return state
  }
}
