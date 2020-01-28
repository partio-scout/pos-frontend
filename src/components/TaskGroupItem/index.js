import React from 'react'
import ListItem from 'components/ListItem'
import taskGroupGraphics from 'graphics/taskGroups'

export const getSubTaskGroupsOrTasksText = (tasksTerm, taskGroup) => {
  const term = tasksTerm || 'aktiviteettia'
  const tasksExist = taskGroup.tasks.length > 0
  const tasksGroupsExist = taskGroup.taskgroups.length > 0
  const tasksText = tasksExist ? taskGroup.tasks.length : ''
  const taskGroupsText = tasksGroupsExist ? taskGroup.taskgroups.length : ''
  return `${tasksText} ${
    tasksExist && tasksGroupsExist ? '+' : ''
  } ${taskGroupsText} ${term}`
}

const TaskGroupItem = ({
  taskGroup,
  ageGroupGuid,
  language,
  tasksTerm,
  subTitle,
}) => {
  const languageInfo = taskGroup.languages.find(x => x.lang === language)

  return (
    <ListItem
      guid={taskGroup.guid}
      ageGroupGuid={ageGroupGuid}
      title={languageInfo ? languageInfo.title : taskGroup.title}
      subTitle={subTitle || getSubTaskGroupsOrTasksText(tasksTerm, taskGroup)}
      language={language}
      icon={taskGroupGraphics[`Group${taskGroup.guid}`] || null}
    />
  )
}

export default TaskGroupItem
