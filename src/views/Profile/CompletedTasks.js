import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import styled from 'styled-components'

import { ITEM_TYPES } from 'consts'
import ListItem from 'components/ListItem'

const StyledAccordionItem = styled(AccordionItemPanel)`
  padding-left: 2.5rem;
`

const CompletedTasks = ({
  itemsByGuid,
  taskGroupsWithChildTaskGroups,
  language,
}) => {
  const parentTaskGroupGuids = Object.keys(taskGroupsWithChildTaskGroups)

  return parentTaskGroupGuids.map(taskGroupGuid => {
    return (
      <AccordionList
        key={taskGroupGuid}
        taskGroupGuid={taskGroupGuid}
        completedTasks={taskGroupsWithChildTaskGroups}
        itemsByGuid={itemsByGuid}
        language={language}
      />
    )
  })
}

const AccordionList = ({
  taskGroupGuid,
  itemsByGuid,
  completedTasks,
  language,
}) => {
  const taskGroup = itemsByGuid[taskGroupGuid]

  return (
    <Accordion key={taskGroupGuid} allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <ListItem
              title={taskGroup.item.title}
              itemType={ITEM_TYPES.TASK_GROUP}
              ageGroupGuid={taskGroup.ageGroupGuid}
              language={language}
            />
          </AccordionItemButton>
        </AccordionItemHeading>
        <StyledAccordionItem>
          {Array.isArray(completedTasks[taskGroupGuid]) ? (
            <TaskList
              tasks={completedTasks[taskGroupGuid]}
              taskGroup={taskGroup}
              language={language}
            />
          ) : (
            Object.keys(completedTasks[taskGroupGuid]).map(
              childTaskGroupGuid => {
                return (
                  <AccordionList
                    key={childTaskGroupGuid}
                    itemsByGuid={itemsByGuid}
                    taskGroupGuid={childTaskGroupGuid}
                    completedTasks={completedTasks[taskGroupGuid]}
                    language={language}
                  />
                )
              }
            )
          )}
        </StyledAccordionItem>
      </AccordionItem>
    </Accordion>
  )
}

const TaskList = ({ tasks, taskGroup, language }) => {
  return tasks.map(task => {
    return (
      <ListItem
        key={task.guid}
        title={task.title}
        itemType={ITEM_TYPES.TASK_GROUP}
        ageGroupGuid={taskGroup.ageGroupGuid}
        language={language}
      />
    )
  })
}

export default CompletedTasks