import React from 'react'
import ListItem from 'components/ListItem'
import { getItemId } from 'helpers'

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
      guid={getItemId(taskGroup)}
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
