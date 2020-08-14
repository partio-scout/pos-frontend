import React from 'react'
import styled, { keyframes } from 'styled-components'
import FavouriteIcon, {
  StyledCompletedIcon,
  StyleActiveIcon,
} from '../TaskActionsIcons'
import { useSelector } from 'react-redux'
import { COMPLETION_STATUS } from '../../consts'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'

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
  toggleCompleted,
  onCancel,
  isFavourite,
  guid,
}) => {
  const userTasks = useSelector(state => state.tasks)
  const generalTranslations = useSelector(state => state.translations.yleiset)

  const language = determineLanguageFromUrl(window.location)

  const activeTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.ACTIVE
  )

  const completionRequestedTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const completedTasks = Object.keys(userTasks).filter(
    guid => userTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const isActive = !!activeTasks.find(taskGuid => taskGuid === guid)

  const isCompletionRequested = !!completionRequestedTasks.find(
    taskGuid => taskGuid === guid
  )

  const isCompleted = !!completedTasks.find(taskGuid => taskGuid === guid)

  return (
    <>
      <Overlay />
      <Content>
        {isCompletionRequested || isCompleted ? null : (
          <ActivityItem onClick={toggleActive}>
            <StyleActiveIcon />
            <span>
              {isActive
                ? getTermInLanguage(
                    generalTranslations,
                    'delete_from_started',
                    language
                  )
                : getTermInLanguage(
                    generalTranslations,
                    'add_as_started',
                    language
                  )}
            </span>
          </ActivityItem>
        )}
        <ActivityItem onClick={toggleCompleted}>
          <StyledCompletedIcon />
          <span>
            {isCompleted || isCompletionRequested
              ? getTermInLanguage(
                  generalTranslations,
                  'delete_from_done',
                  language
                )
              : getTermInLanguage(generalTranslations, 'add_as_done', language)}
          </span>
        </ActivityItem>
        <ActivityItem onClick={toggleFavourite}>
          <FavouriteIcon filled={!isFavourite} />
          <span>
            {isFavourite
              ? getTermInLanguage(
                  generalTranslations,
                  'delete_from_favourites',
                  language
                )
              : getTermInLanguage(
                  generalTranslations,
                  'add_as_favourite',
                  language
                )}
          </span>
        </ActivityItem>
        <ActivityItem onClick={onCancel}>
          <span>
            {getTermInLanguage(generalTranslations, 'cancel', language)}
          </span>
        </ActivityItem>
      </Content>
    </>
  )
}

export default TaskActions
