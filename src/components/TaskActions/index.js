import React from 'react'
import styled, { keyframes } from 'styled-components'
import { CheckCircle, Heart } from 'react-feather'

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.color.background};
  opacity: 0.7;
  z-index: 1;

  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 0.7;
    }
  `} 200ms linear;
`

const Content = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 2rem;
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

const ActivityItem = styled.div`
  display: flex;
  align-items: center;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }
`

const TaskActions = ({ onMarkDone, onMarkFavourite, onCancel }) => (
  <>
    <Overlay />
    <Content>
      <ActivityItem onClick={onMarkDone}>
        <CheckCircle />
        <span>Merkitse suoritetuksi</span>
      </ActivityItem>
      <ActivityItem onClick={onMarkFavourite}>
        <Heart />
        <span>Lisää suosikiksi</span>
      </ActivityItem>
      <ActivityItem onClick={onCancel}>
        <span>Peruuta</span>
      </ActivityItem>
    </Content>
  </>
)

export default TaskActions
