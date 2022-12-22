import React from 'react'
import styled from 'styled-components'

import TaskNotification from './TaskNotification'
import Task_groupNotification from './TaskGroupNotification'
import Age_groupNotification from './CompletionBadgeNotification'

export const UnreadNotificator = styled.div`
  width: 0.65rem;
  height: 0.65rem;
  position: absolute;
  background: red;
  border-radius: 50%;
  ${({ position }) => position || 'right'}: 0rem;
  top: ${({ center }) => (!center ? '0' : '0.4rem')};
`

const NotificationContainer = styled.div`
  font-size: 0.875rem;
  position: relative;
  padding: 0.1rem 1rem;

  :first-child {
    padding-top: 0rem;
  }

  :last-child {
    padding-bottom: 1rem;
  }

  :not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.color.subText};
  }
`

const components = {
  TaskNotification,
  Task_groupNotification,
  Age_groupNotification,
}

const getNotificationsComponent = (notification, markRead) => {
  console.log('🖕', notification)
  const itemType = notification.item_type
  const componentPrefix = itemType.charAt(0) + itemType.slice(1).toLowerCase()
  console.log('componentPrefix', componentPrefix)
  const Component = components[componentPrefix + 'Notification']
  return <Component notification={notification} markRead={markRead} />
}

const Notification = ({ notification, markRead }) => {
  return (
    <NotificationContainer>
      {getNotificationsComponent(notification, markRead)}
      {!notification.viewed && <UnreadNotificator position="left" center />}
    </NotificationContainer>
  )
}

export default Notification
