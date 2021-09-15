import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { getTaskUrl, getTimestamp } from './utils'
import {
  determineLanguageFromUrl,
  getTermInLanguage,
} from 'helpers'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Message = styled.div``

const Timestamp = styled.div`
  font-size: 0.5rem;
`
const StyledLink = styled(Link)`
  color: #c9bf32;
  :visited {
    color: #c86418;
  }
`

// TODO: Refactor when we have translations


const TaskNotification = ({ notification, markRead }) => {
  const language = determineLanguageFromUrl(window.location)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const itemsByGuid = useSelector(state => state.itemsByGuid)
  const task = itemsByGuid[notification.item_guid]
  const timestamp = getTimestamp(notification.created_at)

  const getStateMessage = state => {
    switch (state) {
      case 'ACCEPTED':
        return getTermInLanguage(generalTranslations, 'accepted', language)
      default:
        return getTermInLanguage(generalTranslations, 'accepted', language)
    }
  }

  return (
    <Container>
      <Message>
        <span>
          {getTermInLanguage(generalTranslations, 'group_leader', language)} {notification.group_leader_name} {getTermInLanguage(generalTranslations, 'has', language)} {' '}
          {getStateMessage(notification.notification_type)} {getTermInLanguage(generalTranslations, 'your_task', language)} {' '}
        </span>
        <StyledLink to={getTaskUrl(task)} onClick={markRead}>
          {task.item.title}
        </StyledLink>
      </Message>
      <Timestamp>{timestamp}</Timestamp>
    </Container>
  )
}

export default TaskNotification
