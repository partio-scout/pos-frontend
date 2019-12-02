import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

const StyledAgeGroupActivitiesPage = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  background-color: #000;
  pointer-events: all;
`

const CloseIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 11px;
  height: 15px;
  color: #fff;
  cursor: pointer;
`

const AgeGroupActivitiesPage = ({ history }) => {
  return (
    <StyledAgeGroupActivitiesPage>
      <CloseIcon onClick={() => history.push('/')}>X</CloseIcon>
    </StyledAgeGroupActivitiesPage>
  )
}

export default withRouter(AgeGroupActivitiesPage)
