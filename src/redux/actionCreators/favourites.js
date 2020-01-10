import { SET_FAVOURITES } from 'redux/actionTypes'

export const setFavourites = favourites => {
  return {
    type: SET_FAVOURITES,
    payload: favourites,
  }
}
