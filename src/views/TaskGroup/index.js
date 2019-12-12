import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft } from 'react-feather'
import TaskGroupItem from 'components/TaskGroupItem'
import { determineLanguageFromUrl } from 'helpers'

const StyledTaskGroup = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  box-sizing: border-box;
  height: 100vh;
  width: 100vw;
  padding: 1rem;
  display: grid;
  grid-template-rows: auto auto 1fr;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;

  > h4 {
    margin: 0;
    padding-bottom: 1rem;
    font-size: 18px;
    text-align: center;
  }
`

const BackArrow = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
  overflow: scroll;
`

const TaskGroup = () => {
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)

  const taskGroup = useSelector(state => state.itemsByGuid[guid])

  if (!taskGroup) {
    return null
  }

  const { item } = taskGroup

  const subTaskGroups = item.taskgroups
  const taskGroupLanguages = item.languages.find(x => x.lang === language)

  return (
    <StyledTaskGroup>
      <BackArrow onClick={() => history.goBack()}>
        <ArrowLeft />
      </BackArrow>
      <h4>{taskGroupLanguages ? taskGroupLanguages.title : item.title}</h4>
      <TaskList>
        {subTaskGroups.map(subTaskGroup => {
          return (
            <TaskGroupItem
              key={subTaskGroup.guid}
              taskGroup={subTaskGroup}
              ageGroupIndex={taskGroup.ageGroupIndex}
              language={language}
            />
          )
        })}
      </TaskList>
    </StyledTaskGroup>
  )
}

export default TaskGroup
