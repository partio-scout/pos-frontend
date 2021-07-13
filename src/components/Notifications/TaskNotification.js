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
  const groups = useSelector(state => state.user.userGroups)
  const task = itemsByGuid[notification.item_guid]
  const timestamp = getTimestamp(notification.created_at)
  const user = groups.reduce((cur, group) => {
    if (cur) {
      return cur
    }
    const found = group.members.find(member => {
      return member.memberId.toString() === notification.created_by
    })
    return found
  }, null)

  return (
    <Container>
      <Message>
        <span>
          Ryhmänjohtaja {user.memberName} on{' '}
          {getStateMessage(notification.notification_type)} tehtäväsi{' '}
        </span>
        <Link to={getTaskUrl(task)} onClick={markRead}>
          {task.item.title}
        </Link>
      </Message>
      <Timestamp>{timestamp}</Timestamp>
    </Container>
  )
}

export default TaskNotification
