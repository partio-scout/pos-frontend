import moment from 'moment'
import { getItemId } from 'helpers'

export const getTimestamp = (datetime) => {
  return moment(datetime).format('DD.MM.YYYY, hh:mm')
}

export const getTaskUrl = (task) => {
  return `/guid/${getItemId(task)}`
}
