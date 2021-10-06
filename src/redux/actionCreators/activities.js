import { SET_ACTIVITIES } from 'redux/actionTypes'

export const setFavourites = (favourites) => {
  return {
    type: SET_FAVOURITES,
    payload: favourites,
  }
}
