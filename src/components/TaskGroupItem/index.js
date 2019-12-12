import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const StyledTaskGroup = styled(Link)`
  position: relative;
  padding-left: 3.5rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  text-decoration: none;

  > * {
    line-height: 1.3;
    color: ${({ theme }) => theme.color.text};
  }

  > :nth-child(2) {
    opacity: 0.65;
  }

  ::before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: ${({ theme, agegroupindex }) =>
      theme.color.ageGroups[agegroupindex]};
  }
`

const TaskGroup = ({ taskGroup, ageGroupIndex, language }) => {
  const renderSubTaskGroupsOrTasks = taskGroup => {
    const tasksTerm =
      taskGroup.subtask_term && taskGroup.subtask_term.plural
        ? taskGroup.subtask_term.plural
        : 'aktiviteettia'
    const tasksText =
      taskGroup.tasks.length > 0 ? `${taskGroup.tasks.length} ${tasksTerm}` : ''
    const taskGroupsText =
      taskGroup.taskgroups.length > 0
        ? `${taskGroup.taskgroups.length} aktiviteettiryhmää`
        : ''
    // add extra space char in the end to ensure that empty rows take the height of this line
    return <span>{`${tasksText} ${taskGroupsText} \u00A0`}</span>
  }

  const languageInfo = taskGroup.languages.find(x => x.lang === language)

  return (
    <StyledTaskGroup
      key={taskGroup.guid}
      agegroupindex={ageGroupIndex}
      to={`/guid/${taskGroup.guid}`}
    >
      <span>{languageInfo ? languageInfo.title : taskGroup.title}</span>
      {renderSubTaskGroupsOrTasks(taskGroup)}
    </StyledTaskGroup>
  )
}

export default TaskGroup
