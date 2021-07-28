import React from 'react'
import styled from 'styled-components'

import TaskNotification from './TaskNotification'

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
}

const getNotificationsComponent = (notification, markRead) => {
  const itemType = notification.item_type
  const componentPrefix = itemType.charAt(0) + itemType.slice(1).toLowerCase()
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
