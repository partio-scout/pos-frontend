import { setAgeGroups } from './ageGroups'
import { setItemsByGuid } from './itemsByGuid'
import { deepFlatten } from 'helpers'
// import { setTaskGroupRequirements } from './taskGroupRequirements'

export const setInitialData = (ageGroups) => (dispatch) => {
  dispatch(
    setAgeGroups(
      ageGroups.map((ageGroup) => {
        const { ...rest } = ageGroup // eslint-disable-line
        return rest
      })
    )
  )

  dispatch(
    setItemsByGuid(
      deepFlatten(ageGroups.sort((a, b) => a.minimum_age - b.minimum_age))
    )
  )

  // const taskGroupRequirements = getTaskGroupRequirements(ageGroups)
  // dispatch(setTaskGroupRequirements(taskGroupRequirements))
}
