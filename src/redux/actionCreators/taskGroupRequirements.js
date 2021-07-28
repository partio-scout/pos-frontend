import { SET_TASKGROUP_REQUIREMENTS } from 'redux/actionTypes'

export const setTaskGroupRequirements = taskGroupRequirements => {
  return {
    type: SET_TASKGROUP_REQUIREMENTS,
    payload: taskGroupRequirements,
  }
}
