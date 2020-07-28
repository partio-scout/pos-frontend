import { SET_TASKS, DELETE_ACTIVE } from 'redux/actionTypes'
import { COMPLETION_STATUS } from '../../../consts'

const deleteActive = (tasks, guid) => {
  if (tasks[guid] === COMPLETION_STATUS.ACTIVE) {
    delete tasks[guid]
  }
  return tasks
}

export const tasks = (state = [], action) => {
  switch (action.type) {
    case SET_TASKS:
      return action.payload.reduce((acc, curr) => {
        acc[curr.task_guid] = curr.completion_status
        return acc
      }, {})
    case DELETE_ACTIVE:
      return deleteActive(Object.assign({}, state), action.payload)
    default:
      return state
  }
}
