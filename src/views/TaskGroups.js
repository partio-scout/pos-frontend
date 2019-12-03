import React from 'react'
import styled from 'styled-components'
import { withRouter } from 'react-router-dom'

const Background = styled.div`
  position: relative;
  min-height: 100vh;
  width: 100vw;
  background-color: #000;
  pointer-events: all;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: ${({ theme, ageGroupIndex }) => `
    linear-gradient(
      to bottom,
      ${theme.color.ageGroups[ageGroupIndex]},
      rgba(160, 121, 219, 0)
    );
    `};
  }
`

// TODO take icon from feather icons and remove px width & height
const CloseIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 11px;
  height: 15px;
  color: #fff;
  cursor: pointer;
`

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`

const HeadingContent = styled.div`
  padding-top: 7rem;
  margin: 0 auto;
  text-align: center;
`

const BodyContent = styled.div`
  padding: 1rem;

  > :first-child {
    text-align: center;
  }
`

const MainSymbol = styled.div`
  width: 100px;
  height: 100px;
  margin: 0 auto;
  border-radius: 50%;
  background-color: #f5f5f5;
`

const TaskGroup = styled.div`
  position: relative;
  padding-left: 3.5rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;

  > * {
    line-height: 1.3;
  }

  ::before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #f5f5f5;
  }
`

const TaskGroups = ({ history, location }) => {
  const pathSplit = location.pathname.split('/')
  const ageGroupIndex = pathSplit[pathSplit.length - 1]
  return (
    <Background ageGroupIndex={ageGroupIndex}>
      <Content>
        <CloseIcon onClick={() => history.push('/')}>X</CloseIcon>
        <HeadingContent>
          <MainSymbol />
          <h3>Seikkailijat</h3>
        </HeadingContent>
        <BodyContent>
          <p>Ilmansuunnat</p>
          <TaskGroup>
            <span>Tervetuloa</span>
            <span>7 aktiviteettia</span>
          </TaskGroup>
          <TaskGroup>
            <span>Pohjoinen</span>
            <span>21 aktiviteettia</span>
          </TaskGroup>
          <TaskGroup>
            <span>Etelä</span>
            <span>24+5 aktiviteettia</span>
          </TaskGroup>
        </BodyContent>
      </Content>
    </Background>
  )
}

export default withRouter(TaskGroups)
