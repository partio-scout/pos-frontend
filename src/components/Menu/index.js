import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { MoreHorizontal, User, LogIn } from 'react-feather'
import Notifications from '../Notifications'

const StyledMenu = styled.div`
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  padding: 1.5rem 1rem;
  display: flex;
  font-size: 18px;
  z-index: 1;

  > * {
    flex: 1;
  }
`

const Username = styled.span`
  white-space: nowrap;
  text-align: center;
`
const Profile = styled.div`
  text-align: right;
`

const Icons = styled.div`
  display: flex;
  justify-content: flex-end;
`

const Menu = ({ language, user }) => {
  const history = useHistory()
  return (
    <StyledMenu>
      {user.loggedIn && (
        <>
          <div>
            <MoreHorizontal
              onClick={() => history.push(`/manage?lang=${language}`)}
            />
          </div>
          <Username>{user.name}</Username>
        </>
      )}

      <Profile>
        {!user.loggedIn ? (
          <LogIn onClick={() => history.push('login')} />
        ) : (
          <Icons>
            <Notifications />
            <User onClick={() => history.push(`/profile?lang=${language}`)} />
          </Icons>
        )}
      </Profile>
    </StyledMenu>
  )
}

export default Menu
