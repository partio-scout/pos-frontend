import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Bell } from 'react-feather'
import { useSelector } from 'react-redux'

import useOnClickOutside from '../../hooks/onClickOutSide'
import Notification, { UnreadNotificator } from './Notification'

const BUTTON_HEIGHT = '0.7rem'

const Container = styled.div`
  position: relative;
  margin-right: 1.5rem;
`

const BellContainer = styled.div`
  position: relative;
`

const Dropdown = styled.div`
  top: 4.5rem;
  right: 1rem;
  color: white;
  width: 10rem;
  height: 20rem;
  padding: 1rem;
  position: fixed;
  box-shadow: 0.3rem 0.3rem 0.2rem rgba(0, 0, 0, 0.2);
  background: ${({ theme }) => theme.color.gradientDark};
  padding-bottom: ${BUTTON_HEIGHT};
  display: flex;
  flex-direction: column;
  border-radius: 5px;
`

const NotificationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-item; start;
  overflow-y: scroll;
  text-align: left;
`

const MarkAllRead = styled.div`
  width: 100%;
  height: ${BUTTON_HEIGHT};
  background: ${({ theme }) => theme.color.gradientDark};
  text-align: center;
  bottom: 0;
  cursor: pointer;
  color: white;
  margin-top: auto;
  border-top: 1px solid ${({ theme }) => theme.color.default};
  padding: 0.5rem 0rem;
`

const Notifications = () => {
  const containerRef = useRef()
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  const notifications = useSelector(state => state.notifications)

  useOnClickOutside(containerRef, () => showDropdown && setShowDropdown(false))

  if (!hasUnread) setHasUnread(true)

  return (
    <Container ref={containerRef}>
      <BellContainer>
        <Bell onClick={() => setShowDropdown(!showDropdown)} />
        {hasUnread && <UnreadNotificator />}
      </BellContainer>
      {showDropdown && (
        <Dropdown>
          <NotificationsContainer>
            {notifications &&
              notifications.map(notification => (
                <Notification
                  key={notification.id}
                  notification={notification}
                />
              ))}
          </NotificationsContainer>
          <MarkAllRead>Mark all as read</MarkAllRead>
        </Dropdown>
      )}
    </Container>
  )
}

export default Notifications
