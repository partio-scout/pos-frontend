import React from 'react'
import ListItem from 'components/ListItem'
import taskGroupGraphics from 'graphics/taskGroups'

const getTranslatedTaskCount = (tasks, lang) => {
  return tasks.reduce((acc, task) => {
    if (task.languages.find(language => language.lang === lang)) {
      acc++
    }
    return acc
  }, 0)
}

export const getSubTaskGroupsOrTasksText = (tasksTerm, taskGroup, language) => {
  const term = tasksTerm || 'aktiviteettia'
  const tasksExist = taskGroup.tasks.length > 0
  const tasksGroupsExist = taskGroup.taskgroups.length > 0
  const tasksText = tasksExist
    ? getTranslatedTaskCount(taskGroup.tasks, language)
    : ''
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

  return languageInfo ? (
    <ListItem
      guid={taskGroup.guid}
      ageGroupGuid={ageGroupGuid}
      title={languageInfo.title}
      subTitle={
        subTitle || getSubTaskGroupsOrTasksText(tasksTerm, taskGroup, language)
      }
      language={language}
      icon={taskGroupGraphics[`Group${taskGroup.guid}`] || null}
    />
  ) : null
}

export default TaskGroupItem
