import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { ITEM_TYPES } from 'consts'
import ListItem from 'components/ListItem'
import { getTermInLanguage, getTaskGroupStatus } from 'helpers'
import { getMemberTasks } from '../../helpers/groupTasks'

const StyledAccordionItem = styled(AccordionItemPanel)`
  padding-left: 2.5rem;
`

const CompletedTasks = ({
  itemsByGuid,
  taskGroupsWithChildTaskGroups,
  language,
  groupMember,
  actionsComponent,
  userGuid,
  groupGuid,
}) => {
  const parentTaskGroupGuids = Object.keys(taskGroupsWithChildTaskGroups)
  return parentTaskGroupGuids.map((taskGroupGuid) => {
    return (
      <AccordionList
        key={taskGroupGuid}
        taskGroupGuid={taskGroupGuid}
        completedTasks={taskGroupsWithChildTaskGroups}
        itemsByGuid={itemsByGuid}
        language={language}
        groupMember={groupMember}
        actionsComponent={actionsComponent}
        userGuid={userGuid}
        groupGuid={groupGuid}
      />
    )
  })
}

const AccordionList = ({
  taskGroupGuid,
  itemsByGuid,
  completedTasks,
  language,
  groupMember,
  actionsComponent,
  userGuid,
  groupGuid,
}) => {
  const userTasks = groupMember
    ? getMemberTasks(
        groupMember.groupId,
        groupMember.memberId,
        useSelector((state) => state.user.userGroups)
      )
    : useSelector((state) => state.tasks)

  const generalTranslations = useSelector((state) => state.translations.yleiset)
  const taskGroup = itemsByGuid[taskGroupGuid]
  // const getTranslation = taskOrTaskGroup => {
  //   return taskOrTaskGroup.languages.find(x => x.lang === language)
  // }

  const status = getTaskGroupStatus(
    taskGroup.item,
    userTasks,
    getTermInLanguage(generalTranslations, 'done', language)
  )
  // const taskTranslation = getTranslation(taskGroup.item)
  const ageGroupGuid = taskGroup.item.age_group
    ? taskGroup.item.age_group.wp_guid
    : null
  return (
    <Accordion key={taskGroupGuid} allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <ListItem
              title={
                // taskTranslation ? taskTranslation.title :
                taskGroup.item.title
              }
              itemType={ITEM_TYPES.TASK_GROUP}
              ageGroupGuid={ageGroupGuid}
              language={language}
              subTitle={status}
              showActions
              showDropDownIcon
            />
          </AccordionItemButton>
        </AccordionItemHeading>
        <StyledAccordionItem>
          {Array.isArray(completedTasks[taskGroupGuid]) ? (
            <TaskList
              tasks={completedTasks[taskGroupGuid]}
              taskGroup={taskGroup}
              language={language}
              actionsComponent={actionsComponent}
              userGuid={userGuid}
              groupGuid={groupGuid}
            />
          ) : (
            Object.keys(completedTasks[taskGroupGuid]).map(
              (childTaskGroupGuid) => {
                return (
                  <AccordionList
                    key={childTaskGroupGuid}
                    itemsByGuid={itemsByGuid}
                    taskGroupGuid={childTaskGroupGuid}
                    completedTasks={completedTasks[taskGroupGuid]}
                    language={language}
                    groupMember={groupMember}
                    subTitle={status}
                    actionsComponent={actionsComponent}
                    userGuid={userGuid}
                    groupGuid={groupGuid}
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

const TaskList = ({
  tasks,
  taskGroup,
  language,
  actionsComponent,
  userGuid,
  groupGuid,
}) => {
  return tasks.map((task) => {
    // const getTranslation = taskOrTaskGroup => {
    //   return taskOrTaskGroup.languages.find(x => x.lang === language)
    // }
    // const taskTranslation = getTranslation(task.item)

    return (
      <ListItem
        key={task.id}
        guid={task.id}
        title={
          // taskTranslation ? taskTranslation.title :
          task.item.title
        }
        itemType={ITEM_TYPES.TASK}
        ageGroupGuid={taskGroup.ageGroupGuid}
        language={language}
        actionsComponent={actionsComponent}
        userGuid={userGuid}
        groupGuid={groupGuid}
        showActions
      />
    )
  })
}

export default CompletedTasks
