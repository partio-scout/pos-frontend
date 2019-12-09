import { SET_TASK_GROUPS } from 'redux/actionTypes'

export const setTaskGroups = taskGroups => {
  return {
    type: SET_TASK_GROUPS,
    payload: taskGroups,
  }
}
