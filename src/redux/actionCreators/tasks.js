import { SET_TASKS } from 'redux/actionTypes'

export const setTasks = tasks => {
  return {
    type: SET_TASKS,
    payload: tasks,
  }
}
