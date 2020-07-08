import React, { useState } from 'react'
import TaskActions from 'components/TaskActions'
import { MoreHorizontal } from 'react-feather'
import { postTaskEntry, postTaskFavourite, deleteFavouriteTask } from 'api'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteFavourite,
  addFavourite as addFavouriteTask,
  setTasks,
} from 'redux/actionCreators'

const Actions = ({ guid, itemType, className, isFavourite }) => {
  const [showActions, setShowActions] = useState(false)
  const tasks = useSelector(state => state.tasks)
  const dispatch = useDispatch()

  const markTaskDone = async () => {
    try {
      const newEntry = await postTaskEntry({
        task_guid: guid,
        completion_status: COMPLETION_STATUS.COMPLETED,
      })
      dispatch(
        setTasks(
          Object.entries(tasks)
            .map(([key, value]) => {
              return {
                task_guid: key,
                completion_status: value,
              }
            })
            .concat([newEntry])
        )
      )
    } catch (e) {
      console.log(e)
    }
    setShowActions(false)
  }

  const addFavourite = async () => {
    try {
      await postTaskFavourite({
        user_guid: 1,
        task_guid: guid,
      })
      dispatch(addFavouriteTask(guid))
    } catch (e) {
      //TODO: Do error handling
      console.log(e)
    }
    setShowActions(false)
  }

  const removeFavourite = async () => {
    try {
      await deleteFavouriteTask({
        user_guid: 1,
        task_guid: guid,
      })
    } catch (e) {
      console.log(e)
    }
    dispatch(deleteFavourite(guid))
    setShowActions(false)
  }

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite()
    } else {
      addFavourite()
    }
  }
  const markTaskActive = async () => {
    try {
      const newEntry = await postTaskEntry({
        task_guid: guid,
        completion_status: COMPLETION_STATUS.ACTIVE,
      })
      dispatch(
        setTasks(
          Object.entries(tasks)
            .map(([key, value]) => {
              return {
                task_guid: key,
                completion_status: value,
              }
            })
            .concat([newEntry])
        )
      )
    } catch (e) {
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
          toggleFavourite={() => toggleFavourite()}
          onMarkActive={() => markTaskActive()}
          isFavourite={isFavourite}
        />
      )}
    </>
  )
}

export default Actions
