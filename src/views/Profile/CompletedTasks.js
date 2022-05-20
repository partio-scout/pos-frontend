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
import {
  getTermInLanguage,
  getTaskGroupStatus,
  getActivityGroupIcon,
  getItemId,
} from 'helpers'
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
  completedTaskGroupsGuids,
  parentTaskGroupGuids,
}) => {
  const taskGroupsnotMarkedCompleted = parentTaskGroupGuids.filter(
    (parentGuid) => !completedTaskGroupsGuids.includes(parentGuid)
  )

  const taskGroupsMarkedCompleted = completedTaskGroupsGuids.filter((guid) =>
    parentTaskGroupGuids.includes(guid)
  )

  const taskGroupGuidsInOrder = taskGroupsnotMarkedCompleted.concat(
    taskGroupsMarkedCompleted
  )

  return taskGroupGuidsInOrder.map((taskGroupGuid) => {
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
        completedTaskGroupsGuids={completedTaskGroupsGuids}
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
  completedTaskGroupsGuids,
}) => {
  const userTasks = groupMember
    ? getMemberTasks(
        groupMember.groupId,
        groupMember.memberId,
        useSelector((state) => state.user.userGroups)
      )
    : useSelector((state) => state.tasks)

  const translations = useSelector((state) => state.translations)
  const taskGroup = itemsByGuid[taskGroupGuid]
  if (taskGroup.item.locale !== language) return null
  const taskGroupsMarkedCompleted = completedTaskGroupsGuids.find(
    (guid) => guid === taskGroupGuid
  )

  const status = taskGroupsMarkedCompleted
    ? getTermInLanguage(translations, 'kokonaisuus-valmis')
    : getTaskGroupStatus(
        taskGroup.item,
        userTasks,
        getTermInLanguage(translations, 'tehdyt')
      )

  const icon = getActivityGroupIcon(taskGroup.item)
  const ageGroupGuid = taskGroup.item.age_group
    ? getItemId(taskGroup.item.age_group)
    : null
  return (
    <Accordion key={taskGroupGuid} allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <ListItem
              title={taskGroup.item.title}
              itemType={ITEM_TYPES.TASK_GROUP}
              ageGroupGuid={ageGroupGuid}
              language={language}
              subTitle={status}
              icon={icon}
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
              icon={icon}
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
  icon,
}) => {
  if (!taskGroup.item.age_group) return null

  return tasks.map((task) => {
    return (
      <ListItem
        key={task.id}
        guid={task.id}
        title={task.item.title}
        itemType={ITEM_TYPES.TASK}
        ageGroupGuid={getItemId(taskGroup.item.age_group)}
        icon={icon}
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
