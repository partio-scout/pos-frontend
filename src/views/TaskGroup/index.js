import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft } from 'react-feather'
import ListItem from 'components/ListItem'
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

  const getTranslation = taskOrTaskGroup => {
    return taskOrTaskGroup.languages.find(x => x.lang === language)
  }

  const { item } = taskGroup
  const taskGroupTranslation = getTranslation(item)

  return (
    <StyledTaskGroup>
      <BackArrow onClick={() => history.push(`/guid/${taskGroup.parentGuid}`)}>
        <ArrowLeft />
      </BackArrow>
      <h4>{taskGroupTranslation ? taskGroupTranslation.title : item.title}</h4>
      <TaskList>
        {item.taskgroups.map(subTaskGroup => {
          return (
            <TaskGroupItem
              key={subTaskGroup.guid}
              taskGroup={subTaskGroup}
              ageGroupIndex={taskGroup.ageGroupIndex}
              language={language}
            />
          )
        })}
        {item.tasks.map(task => {
          const taskTranslation = getTranslation(task)
          return (
            <ListItem
              key={task.guid}
              guid={task.guid}
              ageGroupIndex={taskGroup.ageGroupIndex}
              title={taskTranslation ? taskTranslation.title : task.title}
            />
          )
        })}
      </TaskList>
    </StyledTaskGroup>
  )
}

export default TaskGroup
