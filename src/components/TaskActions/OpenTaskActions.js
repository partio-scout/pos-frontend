import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { StyledCompletedIcon } from '../TaskActionsIcons'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'
import { Link } from 'react-router-dom'

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
const StyledLink = styled(Link)`
  color: white;
  text-decoration: none;
  :visited {
    color: white;
  }
`

const OpenTaskActions = ({ guid, onCancel }) => {
  const [disabled, setDisabled] = useState(false)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const language = determineLanguageFromUrl(window.location)

  const getOnClick = onClick =>
    disabled
      ? () => {}
      : () => {
          setDisabled(true)
          onClick()
        }

  const getTaskUrl = guid => {
    return `/guid/${guid}`
  }

  return (
    <>
      <Overlay />
      <Content>
        <ActivityItem disabled={disabled}>
          <StyledCompletedIcon />
          <span>
            <StyledLink to={getTaskUrl(guid)}>Aukaise tehtävä</StyledLink>
          </span>
        </ActivityItem>
        <ActivityItem onClick={getOnClick(onCancel)} disabled={disabled}>
          <span>
            {getTermInLanguage(generalTranslations, 'cancel', language)}
          </span>
        </ActivityItem>
      </Content>
    </>
  )
}

export default OpenTaskActions
