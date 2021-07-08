import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { Bell } from 'react-feather'
import useOnClickOutside from '../../hooks/onClickOutSide'
//import {useSelector} from "react-redux";

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
  box-shadow: ${({ theme }) => {
    console.log('THEME:', theme)
    return `0.3rem 0.3rem 0.2rem rgba(0,0,0,0.2)`
  }};
  background: ${({ theme }) => theme.color.gradientDark};
`

const Notifications = () => {
  const containerRef = useRef()
  const [showDropdown, setShowDropdown] = useState(false)
  const [hasUnread, setHasUnread] = useState(false)
  useOnClickOutside(containerRef, () => showDropdown && setShowDropdown(false))

  if (!hasUnread) setHasUnread(true)

  return (
    <NotificationsContainer ref={containerRef}>
      <BellContainer>
        <Bell onClick={() => setShowDropdown(!showDropdown)} />
        {hasUnread && <UnreadNotificator />}
      </BellContainer>
      {showDropdown && <Dropdown>Map notifications here</Dropdown>}
    </NotificationsContainer>
  )
}

export default Notifications
