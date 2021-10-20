import { setActivityGroups } from './activityGroups'
import { setItemsByGuid } from './itemsByGuid'
import { deepFlatten } from 'helpers'

export const setActivityGroupsData = (activityGroups) => (dispatch) => {
  dispatch(
    setActivityGroups(
      activityGroups.map((activityGroup) => {
        const { ...rest } = activityGroup // eslint-disable-line
        return rest
      })
    )
  )

  dispatch(setItemsByGuid(deepFlatten(activityGroups)))
}
