import {
  SET_NOTIFICATIONS,
  SET_NOTIFICATION,
  MARK_NOTIFICATION_READ,
  TOGGLE_SHOW_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_READ,
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

const markAllNotificationRead = notifications => {
  const newState = notifications.reduce((newArray, notification) => {
    notification.viewed = true
    newArray.push(notification)
    return newArray
  }, [])
  return newState
}

export const notifications = (state = { list: [], show: false }, action) => {
  switch (action.type) {
    case TOGGLE_SHOW_NOTIFICATIONS:
      return {
        ...state,
        show: !state.show,
      }
    case SET_NOTIFICATIONS:
      return {
        ...state,
        ...action.payload,
      }
    case SET_NOTIFICATION:
      return {
        ...state,
        list: updateNotification(action.payload, state.list),
      }
    case MARK_NOTIFICATION_READ:
      return {
        ...state,
        list: markNotificationRead(action.payload, state.list),
      }
    case MARK_ALL_NOTIFICATIONS_READ:
      return {
        ...state,
        list: markAllNotificationRead(state.list),
      }
    default:
      return state
  }
}
