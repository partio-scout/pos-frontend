import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import FavouriteIcon, {
  StyledCompletedIcon,
  StyleActiveIcon,
  StyledAcceptIcon,
} from '../TaskActionsIcons'
import { useSelector } from 'react-redux'
import { COMPLETION_STATUS } from '../../consts'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'
import { useHistory } from 'react-router-dom'

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
  ${props => (props.disabled ? 'opacity: 0.5;' : '')}

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
  const [disabled, setDisabled] = useState(false)

  const userTasks = useSelector(state => state.tasks)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const userGroups = useSelector(state => state.user.userGroups)

  const history = useHistory()

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

  const getOnClick = onClick =>
    disabled
      ? () => {}
      : () => {
          setDisabled(true)
          onClick()
        }

  return (
    <>
      <Overlay />
      <Content>
        {isCompletionRequested || isCompleted ? null : (
          <ActivityItem onClick={getOnClick(toggleActive)} disabled={disabled}>
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
        <ActivityItem onClick={getOnClick(toggleCompleted)} disabled={disabled}>
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
        <ActivityItem onClick={getOnClick(toggleFavourite)} disabled={disabled}>
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
        {userGroups && userGroups.length > 0 ? (
          <ActivityItem
            onClick={() => history.push(`/accept/${guid}/?lang=${language}`)}
            disabled={disabled}
          >
            <StyledAcceptIcon />
            <span>
              {getTermInLanguage(
                generalTranslations,
                'add_to_group_members',
                language
              )}
            </span>
          </ActivityItem>
        ) : null}
        <ActivityItem onClick={getOnClick(onCancel)} disabled={disabled}>
          <span>
            {getTermInLanguage(generalTranslations, 'cancel', language)}
          </span>
        </ActivityItem>
      </Content>
    </>
  )
}

export default TaskActions
