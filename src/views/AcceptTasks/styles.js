import styled, { keyframes } from 'styled-components'
import { X } from 'react-feather'

export const AcceptTasksAction = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 3rem;
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ theme }) => theme.color.background};
  z-index: 1;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `} 200ms linear;
`

export const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 3px 0 3px;
  border: 2px solid #545454;
  border-radius: 3%;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }

  &:active {
    border: 2px solid #fff;
  }
`

export const StyledAcceptTasks = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
  overflow: auto;
`

export const Header = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  padding-top: 1.5rem;
  text-align: center;
  background-color: #1a1a1a;
`

export const Subheading = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: normal;
`

export const CloseIcon = styled(X)`
  position: absolute;
  top: 1.45rem;
  right: 1rem;
`

export const Content = styled.div`
  padding: 1rem;
  > ${Subheading} {
    margin-bottom: 1rem;
  }
`
