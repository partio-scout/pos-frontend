import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { MoreHorizontal } from 'react-feather'

const StyledMenu = styled.div`
  position: fixed;
  box-sizing: border-box;
  width: 100%;
  padding: 1.5rem 1rem;
  display: flex;
  z-index: 1;

  > * {
    flex: 1;
  }
`

const Username = styled.span`
  white-space: nowrap;
`

const Menu = ({ language }) => {
  const history = useHistory()
  return (
    <StyledMenu>
      <div>
        <MoreHorizontal
          onClick={() => history.push(`/manage?lang=${language}`)}
        />
      </div>
      <Username>Teppo Testaaja</Username>
      <div />
    </StyledMenu>
  )
}

export default Menu
