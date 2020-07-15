import {
  SET_FAVOURITES,
  DELETE_FAVOURITE,
  ADD_FAVOURITE,
} from 'redux/actionTypes'

const fn = (favourites, guid) => {
  const deleteIndex = favourites.findIndex(favourite => favourite === guid)
  favourites.splice(deleteIndex, 1)
  return favourites
}
export const favourites = (state = [], action) => {
  switch (action.type) {
    case SET_FAVOURITES:
      return action.payload
    case ADD_FAVOURITE:
      return [...state, action.payload]
    case DELETE_FAVOURITE:
      return fn(state.slice(0), action.payload)
    default:
      return state
  }
}
