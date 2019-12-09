import { SET_TASK_GROUPS } from 'redux/actionTypes'

export const taskGroups = (state = [], action) => {
  switch (action.type) {
    case SET_TASK_GROUPS:
      return action.payload
    default:
      return state
  }
}
