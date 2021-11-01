import React from 'react'
import ListItem from 'components/ListItem'

const TaskGroupItem = ({
  taskGroup,
  ageGroupGuid,
  language,
  tasksTerm,
  itemType,
  actionsComponent,
  showActions,
  groupGuid,
  icon,
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
      icon={icon}
    />
  )
}

export default TaskGroupItem
