import React, { useState } from 'react'
import TaskActions from 'components/TaskActions'
import { MoreHorizontal } from 'react-feather'
import { postTaskEntry, postTaskFavourite } from 'api'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'
import { useDispatch, useSelector } from 'react-redux'
import { setFavourites } from 'redux/actionCreators'

const Actions = ({ guid, itemType, className }) => {
  const [showActions, setShowActions] = useState(false)
  const favourites = useSelector(state => state.favourites)
  const dispatch = useDispatch()

  const markTaskDone = async () => {
    await postTaskEntry({
      user_guid: 1,
      created_by: 1,
      task_guid: guid,
      completion_status: COMPLETION_STATUS.COMPLETED,
    })
    setShowActions(false)
  }
  const markTaskFavourite = async () => {
    try {
      await postTaskFavourite({
        user_guid: 1,
        task_guid: guid,
      })
      dispatch(setFavourites([...favourites, guid]))
    } catch (e) {
      //TODO: Do error handling
      console.log(e)
    }
    setShowActions(false)
  }

  return (
    <>
      <MoreHorizontal
        onClick={() => setShowActions(true)}
        className={className}
      />
      {itemType === ITEM_TYPES.TASK && showActions && (
        <TaskActions
          onCancel={() => setShowActions(false)}
          onMarkDone={() => markTaskDone()}
          onMarkFavourite={() => markTaskFavourite()}
        />
      )}
    </>
  )
}

export default Actions
