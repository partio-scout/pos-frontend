import { SET_SUB_TASK_GROUPS } from 'redux/actionTypes'

export const subTaskGroups = (state = [], action) => {
  switch (action.type) {
    case SET_SUB_TASK_GROUPS:
      return action.payload
    default:
      return state
  }
}
