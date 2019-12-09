import { SET_SUB_TASK_GROUPS } from 'redux/actionTypes'

export const setSubTaskGroups = taskGroups => {
  return {
    type: SET_SUB_TASK_GROUPS,
    payload: taskGroups,
  }
}
