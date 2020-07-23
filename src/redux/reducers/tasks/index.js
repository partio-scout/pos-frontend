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
      action.payload.sort((taskA, taskB) => {
        if (taskA.completion_status === COMPLETION_STATUS.COMPLETED) return 1
        if (taskB.completion_status === COMPLETION_STATUS.COMPLETED) return -1
        if (taskA.completion_status === COMPLETION_STATUS.COMPLETION_REQUESTED)
          return 1
        if (taskB.completion_status === COMPLETION_STATUS.COMPLETION_REQUESTED)
          return -1
        return 0
      })
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
