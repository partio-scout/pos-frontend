import React from 'react'
import styled, { keyframes } from 'styled-components'
import { StyledAcceptIcon, StyledDeleteIcon } from '../TaskActionsIcons'
import { COMPLETION_STATUS } from '../../consts'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
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

const GroupLeaderActions = ({
  acceptCompletionRequest,
  rejectMemberTask,
  onCancel,
  guid,
}) => {
  const { groupId } = useParams()
  const { memberId } = useParams()

  const language = determineLanguageFromUrl(window.location)

  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const apiTypeTranslations = useSelector(state => state.translations.api_type)

  const group = groupsData.find(
    groups => groups.id.toString() === groupId.toString()
  )
  const members = group.members

  const member = members.find(
    members => members.memberId.toString() === memberId.toString()
  )

  const memberTasks = member.memberTasks

  const completedTasks = Object.keys(memberTasks).filter(
    guid => memberTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const isCompleted = !!completedTasks.find(taskGuid => taskGuid === guid)

  return (
    <>
      <Overlay />
      <Content>
        {isCompleted ? null : (
          <ActivityItem onClick={acceptCompletionRequest}>
            <StyledAcceptIcon />
            <span>
              {getTermInLanguage(generalTranslations, 'accept', language)}{' '}
              {getTermInLanguage(apiTypeTranslations, 'task', language)}
            </span>
          </ActivityItem>
        )}
        <ActivityItem onClick={rejectMemberTask}>
          <StyledDeleteIcon />
          <span>
            {getTermInLanguage(generalTranslations, 'delete', language)}{' '}
            {getTermInLanguage(apiTypeTranslations, 'task', language)}
          </span>
        </ActivityItem>
        <ActivityItem onClick={onCancel}>
          <span>Peruuta</span>
        </ActivityItem>
      </Content>
    </>
  )
}

export default GroupLeaderActions
