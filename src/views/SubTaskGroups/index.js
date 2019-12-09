import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import TaskGroup from 'components/TaskGroup'
import { determineLanguageFromUrl } from 'utils'

const StyledSubTaskGroups = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;

  > h4 {
    margin: 0;
    padding-bottom: 1rem;
    font-size: 18px;
    text-align: center;
  }
`

const SubTaskGroups = () => {
  const { guid } = useParams()
  const language = determineLanguageFromUrl(window.location)
  const taskGroup = useSelector(state =>
    state.taskGroups.find(x => x.guid === guid)
  )
  const subTaskGroups = useSelector(state =>
    state.subTaskGroups.filter(x => x.taskGroupGuid === guid)
  )

  if (!(taskGroup && subTaskGroups)) {
    return null
  }

  const taskGroupLanguages = taskGroup.languages.find(x => x.lang === language)

  return (
    <StyledSubTaskGroups>
      <h4>{taskGroupLanguages ? taskGroupLanguages.title : taskGroup.title}</h4>
      {subTaskGroups.map(subTaskGroup => (
        <TaskGroup
          key={subTaskGroup.guid}
          taskGroup={subTaskGroup}
          ageGroupIndex={0}
          language={language}
        />
      ))}
    </StyledSubTaskGroups>
  )
}

export default SubTaskGroups
