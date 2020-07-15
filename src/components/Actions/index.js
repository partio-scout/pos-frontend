import React, { useState } from 'react'
import TaskActions from 'components/TaskActions'
import { MoreHorizontal } from 'react-feather'
import {
  postTaskEntry,
  postTaskFavourite,
  deleteFavouriteTask,
  deleteActiveTask,
} from 'api'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'
import { useDispatch, useSelector } from 'react-redux'
import {
  deleteFavourite,
  addFavourite as addFavouriteTask,
  setTasks,
  deleteActive,
} from 'redux/actionCreators'

const Actions = ({ guid, itemType, className, isFavourite }) => {
  const [showActions, setShowActions] = useState(false)
  const tasks = useSelector(state => state.tasks)
  const dispatch = useDispatch()

  const activeTasks = Object.keys(tasks).filter(
    guid => tasks[guid] === COMPLETION_STATUS.ACTIVE
  )

  const completionRequestedTasks = Object.keys(tasks).filter(
    guid => tasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const completedTasks = Object.keys(tasks).filter(
    guid => tasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const isActive = !!activeTasks.find(taskGuid => taskGuid === guid)

  const isCompletionRequested = !!completionRequestedTasks.find(
    taskGuid => taskGuid === guid
  )

  const isCompleted = !!completedTasks.find(taskGuid => taskGuid === guid)

  const markTaskCompleted = async () => {
    try {
      const newEntry = await postTaskEntry({
        task_guid: guid,
        completion_status: COMPLETION_STATUS.COMPLETED,
      })
      setShowActions(false)
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
  }

  const toggleCompleted = () => {
    if (isCompleted || isCompletionRequested) {
      addActive()
    } else {
      markTaskCompleted()
    }
  }

  const addFavourite = async () => {
    try {
      await postTaskFavourite({
        user_guid: 1,
        task_guid: guid,
      })
      setShowActions(false)
      dispatch(addFavouriteTask(guid))
    } catch (e) {
      //TODO: Do error handling
      console.log(e)
    }
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
    setShowActions(false)
    dispatch(deleteFavourite(guid))
  }

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite()
    } else {
      addFavourite()
    }
  }

  const addActive = async () => {
    try {
      const newEntry = await postTaskEntry({
        task_guid: guid,
        completion_status: COMPLETION_STATUS.ACTIVE,
      })
      setShowActions(false)
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
  }

  const removeActive = async () => {
    try {
      await deleteActiveTask({
        user_guid: 1,
        task_guid: guid,
      })
    } catch (e) {
      console.log(e)
    }
    setShowActions(false)
    dispatch(deleteActive(guid))
  }

  const toggleActive = () => {
    if (isActive) {
      removeActive()
    } else {
      addActive()
    }
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
          onMarkCompleted={() => markTaskCompleted()}
          toggleFavourite={() => toggleFavourite()}
          toggleActive={() => toggleActive()}
          toggleCompleted={() => toggleCompleted()}
          isFavourite={isFavourite}
          guid={guid}
        />
      )}
    </>
  )
}

export default Actions
