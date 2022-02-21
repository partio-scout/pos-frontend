import React from 'react'
import styled from 'styled-components'
import ListItem from 'components/ListItem'
import { ITEM_TYPES } from 'consts'
import { getActivityGroupIcon, getItemId } from 'helpers'

const TaskList = styled.div`
  padding-bottom: 2rem;
`

const OngoingTaskList = ({
  list,
  itemsByGuid,
  activityGroups,
  language,
  favourites,
}) => {
  return (
    <TaskList>
      {list.map((taskGuid) => {
        const task = itemsByGuid[taskGuid]

        if (!task) return null

        if (task.item.locale !== language) return null
        const parent = activityGroups[task.item.activity_group.toString()]
        const finder = (favourite) => taskGuid === favourite.guid
        const isFavourite = !!favourites.find(finder)
        return (
          <ListItem
            key={task.id}
            guid={getItemId(task.item)}
            ageGroupGuid={
              task.ageGroupGuid
                ? task.ageGroupGuid
                : task.item.age_group.toString()
            }
            title={task.item.title}
            subTitle={parent ? parent.title : ''}
            language={language}
            icon={getActivityGroupIcon(parent)}
            itemType={ITEM_TYPES.TASK}
            showActions
            showFavourite
            isFavourite={isFavourite}
          />
        )
      })}
    </TaskList>
  )
}

export default OngoingTaskList
