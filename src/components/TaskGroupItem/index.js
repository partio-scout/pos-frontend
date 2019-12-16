import React from 'react'
import ListItem from 'components/ListItem'

const TaskGroupItem = ({ taskGroup, ageGroupIndex, language, tasksTerm }) => {
  const renderSubTaskGroupsOrTasks = taskGroup => {
    const term = tasksTerm || 'aktiviteettia'
    const tasksExist = taskGroup.tasks.length > 0
    const tasksGroupsExist = taskGroup.taskgroups.length > 0
    const tasksText = tasksExist ? taskGroup.tasks.length : ''
    const taskGroupsText = tasksGroupsExist ? taskGroup.taskgroups.length : ''
    return (
      <span data-testid="tasks-text">{`${tasksText} ${
        tasksExist && tasksGroupsExist ? '+' : ''
      } ${taskGroupsText} ${term}`}</span>
    )
  }

  const languageInfo = taskGroup.languages.find(x => x.lang === language)

  return (
    <ListItem
      guid={taskGroup.guid}
      ageGroupIndex={ageGroupIndex}
      title={languageInfo ? languageInfo.title : taskGroup.title}
      language={language}
    >
      {renderSubTaskGroupsOrTasks(taskGroup)}
    </ListItem>
  )
}

export default TaskGroupItem
