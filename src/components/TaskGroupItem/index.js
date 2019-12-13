import React from 'react'
import ListItem from 'components/ListItem'

const TaskGroupItem = ({ taskGroup, ageGroupIndex, language }) => {
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
    return (
      <span data-testid="tasks-text">{`${tasksText} ${taskGroupsText}`}</span>
    )
  }

  const languageInfo = taskGroup.languages.find(x => x.lang === language)

  return (
    <ListItem
      guid={taskGroup.guid}
      ageGroupIndex={ageGroupIndex}
      title={languageInfo ? languageInfo.title : taskGroup.title}
    >
      {renderSubTaskGroupsOrTasks(taskGroup)}
    </ListItem>
  )
}

export default TaskGroupItem
