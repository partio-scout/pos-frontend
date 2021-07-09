import React from 'react'
import styled from 'styled-components'

export const UnreadNotificator = styled.div`
  width: 0.65rem;
  height: 0.65rem;
  position: absolute;
  background: red;
  border-radius: 50%;
  ${({ position }) => position || 'right'}: 0rem;
  top: 0em;
`

const NotificationContainer = styled.span`
  position: relative;
  padding: 0.1rem 0.65rem;

  :first-child {
    padding-top: 0rem;
  }

  :last-child {
    padding-bottom: 1rem;
  }
`

const Notification = ({ notification }) => {
  return (
    <NotificationContainer>
      {notification.id + ' - ' + notification.item_type}
      {!notification.viewed && <UnreadNotificator position="left" />}
    </NotificationContainer>
  )
}

export default Notification
