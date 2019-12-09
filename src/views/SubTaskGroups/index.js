import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ArrowLeft } from 'react-feather'
import TaskGroup from 'components/TaskGroup'
import { determineLanguageFromUrl } from 'utils'

const StyledSubTaskGroups = styled.div`
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

const SubTaskGroups = () => {
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const taskGroup = useSelector(state =>
    state.taskGroups.find(x => x.guid === guid)
  )
  const subTaskGroups = useSelector(state =>
    state.subTaskGroups.filter(x => x.taskGroupGuid === guid)
  )
  const ageGroups = useSelector(state => state.ageGroups)

  if (!(taskGroup && subTaskGroups)) {
    return null
  }

  const taskGroupLanguages = taskGroup.languages.find(x => x.lang === language)
  const ageGroup = ageGroups.find(x => x.guid === taskGroup.ageGroupGuid)

  return (
    <StyledSubTaskGroups>
      <BackArrow onClick={() => history.push(`/guid/${ageGroup.guid}`)}>
        <ArrowLeft />
      </BackArrow>
      <h4>{taskGroupLanguages ? taskGroupLanguages.title : taskGroup.title}</h4>
      <TaskList>
        {subTaskGroups.map(subTaskGroup => (
          <TaskGroup
            key={subTaskGroup.guid}
            taskGroup={subTaskGroup}
            ageGroupIndex={ageGroup.order}
            language={language}
          />
        ))}
      </TaskList>
    </StyledSubTaskGroups>
  )
}

export default SubTaskGroups
