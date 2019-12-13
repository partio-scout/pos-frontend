import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailPage from 'components/DetailPage'
import ListItem from 'components/ListItem'
import TaskGroupItem from 'components/TaskGroupItem'
import { determineLanguageFromUrl } from 'helpers'

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
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
    <StyledDetailPage
      onBackClick={() => history.push(`/guid/${taskGroup.parentGuid}`)}
      title={taskGroupTranslation ? taskGroupTranslation.title : item.title}
    >
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
    </StyledDetailPage>
  )
}

export default TaskGroup
