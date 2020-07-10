import { DELETE_ACTIVE, SET_TASKS } from 'redux/actionTypes'

export const setTasks = tasks => {
  return {
    type: SET_TASKS,
    payload: tasks,
  }
}

export const deleteActive = guid => {
  return {
    type: DELETE_ACTIVE,
    payload: guid,
  }
}
