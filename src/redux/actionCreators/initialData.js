import { setAgeGroups } from './ageGroups'
import { setItemsByGuid } from './itemsByGuid'
import { deepFlatten, getTaskGroupRequirements } from 'helpers'
import { setTaskGroupRequirements } from './taskGroupRequirements'

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

  const taskGroupRequirements = getTaskGroupRequirements(ageGroups)
  dispatch(setTaskGroupRequirements(taskGroupRequirements))
}
