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

import { ITEM_TYPES } from 'consts'
import ListItem from 'components/ListItem'
import {
  // getTermInLanguage,
  // getTaskGroupStatus,
  getActivityGroupIcon,
  // getItemId,
} from 'helpers'

const StyledAccordionItem = styled(AccordionItemPanel)`
  padding-left: 2.5rem;
`

const CompletionBadges = ({ itemsByGuid, completedItems, language }) => {
  return Object.entries(completedItems).map((completionBadgeItem) => {
    const agegroupId = completionBadgeItem[0]
    const values = completionBadgeItem[1]
    console.log('KEY', agegroupId)
    console.log('VALUESs', values)
    return (
      <AccordionList
        key={agegroupId}
        groupId={agegroupId}
        items={values}
        itemsByGuid={itemsByGuid}
        language={language}
      />
    )
  })
}

const AccordionList = ({ groupId, items, itemsByGuid, language }) => {
  const groupItem = itemsByGuid[groupId]
  console.log('😶 ageGroupItem ', groupItem)
  console.log('🤡 items ', items)
  console.log('💩 itemsByGuid ', itemsByGuid)
  const icon = getActivityGroupIcon(groupItem.item)
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
              subTitle={'Suoritettu'}
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
              // actionsComponent={actionsComponent}
              // userGuid={userGuid}
              // groupGuid={groupGuid}
              icon={icon}
            />
          ) : (
            Object.entries(items).map((activitygroup) => {
              const activitygroupId = activitygroup[0]
              const activities = activitygroup[1]
              console.log('😺 activitygorupId', activitygroup)
              // console.log('😵‍💫 activities', activities)
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
        </StyledAccordionItem>
      </AccordionItem>
    </Accordion>
  )
}

const TaskList = ({
  tasks,
  // taskGroup,
  language,
  // actionsComponent,
  // userGuid,
  // groupGuid,
  icon,
}) => {
  return tasks.map((task) => {
    console.log('💀', task)
    return (
      <ListItem
        key={task.id}
        guid={task.id}
        title={task.item.title}
        itemType={ITEM_TYPES.TASK}
        ageGroupGuid={task.item.age_group}
        icon={icon}
        language={language}
        // actionsComponent={actionsComponent}
        // userGuid={userGuid}
        // groupGuid={groupGuid}
        showActions
      />
    )
  })
}

export default CompletionBadges
