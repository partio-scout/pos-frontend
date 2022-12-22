/* The completion badge is given to scout when they change the agegroup to next one */
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
import { actionTypes } from 'components/Actions'

const StyledAccordionItem = styled(AccordionItemPanel)`
  padding-left: 2.5rem;
`

const CompletionBadges = ({
  itemsByGuid,
  completedItems,
  language,
  taskgroupsMarkedCompleted,
  actionsComponent,
}) => {
  return Object.entries(completedItems).map((completionBadgeItem) => {
    const agegroupId = completionBadgeItem[0]
    const values = completionBadgeItem[1]
    return (
      <AccordionList
        key={agegroupId}
        groupId={agegroupId}
        items={values}
        itemsByGuid={itemsByGuid}
        language={language}
        taskgroupsMarkedCompleted={taskgroupsMarkedCompleted}
        actionsComponent={actionsComponent}
      />
    )
  })
}

const AccordionList = ({
  groupId,
  items,
  itemsByGuid,
  language,
  taskgroupsMarkedCompleted,
  actionsComponent,
}) => {
  const groupItem = itemsByGuid[groupId]
  const translations = useSelector((state) => state.translations)
  const icon = getActivityGroupIcon(groupItem.item)
  const status =
    groupItem.type === 'AGE_GROUP'
      ? 'Päätösmerkki annettu'
      : getTaskGroupStatus(
          groupItem.item,
          useSelector((state) => state.tasks),
          getTermInLanguage(translations, 'tehdyt')
        )

  const agegroupTaskgroupsMarkedCompleted =
    taskgroupsMarkedCompleted &&
    taskgroupsMarkedCompleted.filter((taskGroup) => {
      return taskGroup.item.age_group.wp_guid === groupId
    })
  return (
    <Accordion key={groupId} allowZeroExpanded>
      <AccordionItem>
        <AccordionItemHeading>
          <AccordionItemButton>
            <ListItem
              title={groupItem.item.title}
              itemType={ITEM_TYPES.AGE_GROUP}
              ageGroupGuid={groupId}
              language={language}
              subTitle={status}
              icon={icon}
              showActions
              showDropDownIcon
            />
          </AccordionItemButton>
        </AccordionItemHeading>
        <StyledAccordionItem>
          {Array.isArray(items) ? (
            <TaskList
              tasks={items}
              taskGroup={groupItem.id}
              language={language}
              actionsComponent={actionsComponent}
              icon={icon}
              translations={translations}
            />
          ) : (
            Object.entries(items).map((activitygroup) => {
              const activitygroupId = activitygroup[0]
              const activities = activitygroup[1]
              return (
                <AccordionList
                  key={activitygroupId}
                  groupId={activitygroupId}
                  items={activities}
                  itemsByGuid={itemsByGuid}
                  language={language}
                />
              )
            })
          )}
          {agegroupTaskgroupsMarkedCompleted &&
            agegroupTaskgroupsMarkedCompleted.map((taskGroup) => {
              if (!taskGroup) return null
              return (
                <ListItem
                  key={taskGroup.id}
                  guid={getItemId(taskGroup)}
                  ageGroupGuid={taskGroup.ageGroupGuid}
                  title={taskGroup.title || taskGroup.item.title}
                  subTitle={getTermInLanguage(
                    translations,
                    'kokonaisuus-valmis'
                  )}
                  icon={getActivityGroupIcon(taskGroup.item || taskGroup)}
                  language={language}
                  itemType={ITEM_TYPES.TASK_GROUP}
                  actionsComponent={actionTypes.openTaskActions}
                  showActions
                />
              )
            })}
        </StyledAccordionItem>
      </AccordionItem>
    </Accordion>
  )
}

const TaskList = ({ tasks, language, actionsComponent, icon }) => {
  return tasks.map((task) => {
    return (
      <ListItem
        key={task.id}
        guid={task.id}
        title={task.item.title}
        itemType={ITEM_TYPES.TASK}
        ageGroupGuid={task.item.age_group}
        icon={icon}
        language={language}
        actionsComponent={actionsComponent}
        showActions
      />
    )
  })
}

export default CompletionBadges
