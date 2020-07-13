import React from 'react'
import styled, { keyframes } from 'styled-components'
import FavouriteIcon, {
  StyledDoneIcon,
  StyleActiveIcon,
} from '../TaskActionsIcons'
import { useSelector } from 'react-redux'
import { COMPLETION_STATUS } from '../../consts'

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.color.background};
  opacity: 0.7;
  z-index: 1;

  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.7;
    }
  `} 200ms linear;
`

const Content = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 2rem;
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ theme }) => theme.color.background};
  z-index: 1;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `} 200ms linear;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }
`

const TaskActions = ({
  toggleFavourite,
  toggleActive,
  toggleDone,
  onCancel,
  isFavourite,
  guid,
}) => {
  const userTasks = useSelector(state => state.tasks)

  const activeTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.ACTIVE
  )

  const completionRequestedTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const doneTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const isActive = !!activeTasks.find(taskGuid => taskGuid === guid)

  const isCompletionRequested = !!completionRequestedTasks.find(
    taskGuid => taskGuid === guid
  )

  const isDone = !!doneTasks.find(taskGuid => taskGuid === guid)

  return (
    <>
      <Overlay />
      <Content>
        {isCompletionRequested || isDone ? (
          <></>
        ) : (
          <ActivityItem onClick={toggleActive}>
            <StyleActiveIcon />
            <span>
              {isActive ? 'Poista aloitetuista' : 'Merkitse aloitetuksi'}
            </span>
          </ActivityItem>
        )}
        <ActivityItem onClick={toggleDone}>
          <StyledDoneIcon />
          <span>
            {isDone || isCompletionRequested
              ? 'Poista suoritetuista'
              : 'Merkitse suoritetuksi'}
          </span>
        </ActivityItem>
        <ActivityItem onClick={toggleFavourite}>
          <FavouriteIcon filled={!isFavourite} />
          <span>{isFavourite ? 'Poista suosikeista' : 'Lisää suosikiksi'}</span>
        </ActivityItem>
        <ActivityItem onClick={onCancel}>
          <span>Peruuta</span>
        </ActivityItem>
      </Content>
    </>
  )
}

export default TaskActions
