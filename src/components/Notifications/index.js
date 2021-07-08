import React, { useState } from 'react'
import styled from 'styled-components'
import { Bell } from 'react-feather'

const NotificationsContainer = styled.div`
  position: relative;
  margin-right: 1.5rem;
`

const BellContainer = styled.div`
  position: relative;
`

const UnreadNotificator = styled.div`
  width: 0.65rem;
  height: 0.65rem;
  position: absolute;
  background: red;
  border-radius: 50%;
  right: 0rem;
  top: 0em;
`

const Dropdown = styled.div`
  top: 4.5rem;
  right: 1rem;
  color: white;
  padding: 1rem;
  position: fixed;
  box-shadow: 0.5rem 0.5rem 0.3rem grey;
  background: black;
`

const Notifications = () => {
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)

  if (!hasUnread) setHasUnread(true)

  return (
    <NotificationsContainer>
      <BellContainer>
        <Bell onClick={() => setShowDropdown(!showDropdown)} />
        {hasUnread && <UnreadNotificator />}
      </BellContainer>
      {showDropdown && <Dropdown>Map notifications here</Dropdown>}
    </NotificationsContainer>
  )
}

export default Notifications
