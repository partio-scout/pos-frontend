import moment from 'moment'

export const getTimestamp = datetime => {
  return moment(datetime).format('DD.MM.YYYY, hh:mm')
}

export const getTaskUrl = task => {
  return `/guid/${task.guid}`
}
