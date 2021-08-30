import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { getTaskUrl, getTimestamp } from './utils'

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
const getStateMessage = state => {
  switch (state) {
    case 'ACCEPTED':
      return 'hyväksynyt'
    default:
      return 'hyväksynyt'
  }
}

const TaskNotification = ({ notification, markRead }) => {
  const itemsByGuid = useSelector(state => state.itemsByGuid)
  const task = itemsByGuid[notification.item_guid]
  const timestamp = getTimestamp(notification.created_at)

  return (
    <Container>
      <Message>
        <span>
          Ryhmänjohtaja {notification.group_leader_name} on{' '}
          {getStateMessage(notification.notification_type)} tehtäväsi{' '}
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
