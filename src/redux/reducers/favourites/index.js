import { SET_FAVOURITES } from 'redux/actionTypes'

export const favourites = (state = [], action) => {
  switch (action.type) {
    case SET_FAVOURITES:
      return action.payload
    default:
      return state
  }
}
