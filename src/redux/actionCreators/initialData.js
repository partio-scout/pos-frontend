import { setAgeGroups } from './ageGroups'
import { setItemsByGuid } from './itemsByGuid'
import { deepFlatten } from 'helpers'

export const setInitialData = ageGroups => dispatch => {
  dispatch(
    setAgeGroups(
      ageGroups.map(ageGroup => {
        const { taskgroups, ...rest } = ageGroup // eslint-disable-line
        return rest
      })
    )
  )

  dispatch(
    setItemsByGuid(deepFlatten(ageGroups.sort((a, b) => a.order - b.order)))
  )
}
