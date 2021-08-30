import { SET_TASKGROUP_REQUIREMENTS } from '../../actionTypes'

export const taskGroupRequirements = (state = {}, action) => {
  switch (action.type) {
    case SET_TASKGROUP_REQUIREMENTS:
      return action.payload
    default:
      return state
  }
}
