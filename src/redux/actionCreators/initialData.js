import { setAgeGroups } from './ageGroups'
import { setItemsByGuid } from './itemsByGuid'
import { deepFlatten } from 'helpers'

export const setInitialData = (ageGroups) => (dispatch) => {
  ageGroups.sort((a, b) => a.minimum_age - b.minimum_age)
  let [first, ...rest] = ageGroups
  const ageGroupsOrdered = [...rest, first]
  dispatch(
    setAgeGroups(
      ageGroupsOrdered.map((ageGroup) => {
        const { ...rest } = ageGroup // eslint-disable-line
        return rest
      })
    )
  )

  dispatch(setItemsByGuid(deepFlatten(ageGroupsOrdered)))
}
