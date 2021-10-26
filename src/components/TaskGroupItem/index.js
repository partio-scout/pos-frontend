import React from 'react'
import ListItem from 'components/ListItem'
import taskGroupGraphics from 'graphics/taskGroups'

const TaskGroupItem = ({
  taskGroup,
  ageGroupGuid,
  language,
  tasksTerm,
  itemType,
  actionsComponent,
  showActions,
  groupGuid,
}) => {
  return (
    <ListItem
      guid={taskGroup.wp_guid}
      showActions={showActions}
      itemType={itemType}
      actionsComponent={actionsComponent}
      ageGroupGuid={ageGroupGuid}
      groupGuid={groupGuid}
      title={taskGroup.title}
      subTitle={tasksTerm}
      language={language}
      icon={taskGroupGraphics[`Group${taskGroup.wp_guid}`] || null}
    />
  )
}

export default TaskGroupItem
