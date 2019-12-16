import { SET_TRANSLATIONS } from 'redux/actionTypes'

export const setTranslations = translations => {
  return {
    type: SET_TRANSLATIONS,
    payload: translations,
  }
}
