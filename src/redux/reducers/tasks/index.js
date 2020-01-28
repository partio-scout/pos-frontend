import { SET_TASKS } from 'redux/actionTypes'

export const tasks = (state = [], action) => {
  switch (action.type) {
    case SET_TASKS:
      return action.payload.reduce((acc, curr) => {
        acc[curr.task_guid] = curr.completion_status
        return acc
      }, {})
    default:
      return state
  }
}
