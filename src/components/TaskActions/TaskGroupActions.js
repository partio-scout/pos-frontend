import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { StyledAcceptIcon } from '../TaskActionsIcons'
import { useSelector } from 'react-redux'
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
  ${(props) => (props.disabled ? 'opacity: 0.5;' : '')}
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

const TaskGroupActions = ({ onCancel, guid }) => {
  const [disabled, setDisabled] = useState(false)
  const translations = useSelector((state) => state.translations)
  const userGroups = useSelector((state) => state.user.userGroups)

  const history = useHistory()

  const language = determineLanguageFromUrl(window.location)

  const getOnClick = (onClick) =>
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
        {userGroups && userGroups.length > 0 ? (
          <ActivityItem
            onClick={() => history.push(`/accept/${guid}/?lang=${language}`)}
            disabled={disabled}
          >
            <StyledAcceptIcon />
            <span>
              {getTermInLanguage(translations, 'lisaa-ryhmalaisille')}{' '}
            </span>
          </ActivityItem>
        ) : null}
        <ActivityItem onClick={getOnClick(onCancel)} disabled={disabled}>
          <span>{getTermInLanguage(translations, 'peruuta')}</span>
        </ActivityItem>
      </Content>
    </>
  )
}

export default TaskGroupActions
