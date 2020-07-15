import {
  SET_FAVOURITES,
  DELETE_FAVOURITE,
  ADD_FAVOURITE,
} from 'redux/actionTypes'

export const setFavourites = favourites => {
  return {
    type: SET_FAVOURITES,
    payload: favourites,
  }
}

export const deleteFavourite = guid => {
  return {
    type: DELETE_FAVOURITE,
    payload: guid,
  }
}

export const addFavourite = guid => {
  return {
    type: ADD_FAVOURITE,
    payload: guid,
  }
}
