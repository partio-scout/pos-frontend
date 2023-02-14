/* eslint-disable */
import React, { useEffect, useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import ListItem from 'components/ListItem'
import { ITEM_TYPES, COMPLETION_STATUS, TASK_GROUP_STATUS } from 'consts'
import { useSelector } from 'react-redux'
import { getTermInLanguage } from '../../helpers'
import GroupMember from './GroupMember'
import LoadingSpinner from '../../components/LoadingSpinner'

const StyledAcceptTasks = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
  overflow: auto;
  ${({ isLast }) =>
    isLast &&
    css`
      margin-bottom: 5rem;
    `};
`

const Content = styled.div`
  margin-bottom: 2rem;
`

const StyledListItem = styled.div`
  padding: 0.25rem;
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  min-width: 15rem;
  overflow-x: scroll;
`

const HorizontalLine = styled.hr`
  margin: 0 3 0.5rem;
`

const StyledListHeading = styled.h4`
  padding: 0 0 0 0.25rem;
  text-decoration: underline;
`

const isCompleted = (memberTasks, taskGuid) => {
  const completedTasks = Object.keys(memberTasks).filter(
    (guid) =>
      memberTasks[guid] === COMPLETION_STATUS.COMPLETED ||
      TASK_GROUP_STATUS.COMPLETED
  )
  const isCompleted = !!completedTasks.find((guid) => guid === taskGuid)
  return isCompleted
}

const getInitialCheckboxData = (group, taskGuid, itemsByGuid) => {
  const item = itemsByGuid[taskGuid]
  return group.members.map((member) => {
    const selected = (item) => {
      switch (item.type) {
        case 'TASK_GROUP':
          return isCompleted(member.memberTaskGroups, taskGuid)
        case 'AGE_GROUP':
          return isCompleted(member.memberAgeGroups, taskGuid)
        default:
          return isCompleted(member.memberTasks, taskGuid)
      }
    }

    return {
      selected: selected(item) || false,
      name: member.memberName,
      id: member.memberId,
      tasks: member.memberTasks,
      taskGroups: member.memberTaskGroups,
      ageGroups: member.memberAgeGroups,
    }
  })
}

const Group = ({
  group,
  isLast,
  setPostMemberIdList,
  setDeleteMemberIdList,
}) => {
  const { taskGuid } = useParams()
  const groupsData = useSelector((state) => state.user.userGroups)
  const translations = useSelector((state) => state.translations)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const activityGroupById = useSelector((state) => state.activityGroups)
  const [checkboxData, setCheckboxData] = React.useState(
    getInitialCheckboxData(group, taskGuid, itemsByGuid)
  )
  useEffect(
    () => setCheckboxData(getInitialCheckboxData(group, taskGuid, itemsByGuid)),
    [groupsData, group]
  )

  const groupName = group.name
  const ageGroup = group.ageGroup
  const ageGroupId = group.id
  const title = '' + groupName + ' / ' + ageGroup
  const item = itemsByGuid[taskGuid]

  if (!translations || !groupsData || !item) {
    return <LoadingSpinner />
  }

  const getItem = (item) => {
    switch (item.type) {
      case 'TASK_GROUP':
        return item
      case 'AGE_GROUP':
        return item
      default:
        return activityGroupById[item.item.activity_group].activities
    }
  }

  function isGroupLeader(member) {
    const groupLeaders = group.members.filter(
      (member) => member.isGroupLeader === true
    )
    const isGroupLeader = groupLeaders.some(
      (groupLeader) => groupLeader['memberId'] === member.id
    )
    return isGroupLeader
  }

  function handleChange(event) {
    if (event.target.checked === false) {
      console.log('tuleeks tähän')
    }
    if (event.target.name === 'checkAll') {
      checkboxData.map((member) => {
        return handleCheckboxSelection(Number(member.id), event.target.checked)
      })
    } else {
      handleCheckboxSelection(Number(event.target.value), event.target.checked)
    }

    const editableList = checkboxData.reduce((idList, data) => {
      if (data.selected) {
        idList.push(data.id.toString())
      }
      return idList
    }, [])

    setDeleteMemberIdList()
    setPostMemberIdList(editableList, group.id)
  }

  function handleCheckboxSelection(memberId, isChecked) {
    const editableCheckboxData = checkboxData
    editableCheckboxData.map((member) => {
      if (member.id === memberId && isChecked) {
        member.selected = true
      }
      if (member.id === memberId && !isChecked) {
        member.selected = false
      }
      return setCheckboxData(editableCheckboxData)
    })
  }

  const renderMember = (member, checkFunction) => {
    return (
      checkFunction(member) && (
        <div key={member.id}>
          <GroupMember
            member={member}
            item={getItem(item)}
            taskGuid={taskGuid}
            handleChange={handleChange}
          />
        </div>
      )
    )
  }

  const CHECK_STYLE = {
    float: 'right',
    margin: 0,
    width: '1.3rem',
    height: '1.3rem',
  }

  return (
    <StyledAcceptTasks isLast={isLast}>
      <Accordion allowZeroExpanded key={ageGroupId}>
        <AccordionItem key={ageGroupId}>
          <AccordionItemHeading>
            <AccordionItemButton>
              <ListItem
                key={ageGroupId}
                ageGroupGuid={ageGroupId}
                title={title}
                language="fi"
                icon={null}
                circleIcon={true}
                itemType={ITEM_TYPES.TASK}
                showActions
                showDropDownIcon
              />
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Content>
              <StyledListItem>
                <label style={{ float: 'left', margin: 0 }} htmlFor={group.id}>
                  {getTermInLanguage(translations, 'valitse-kaikki')}
                </label>
                <input
                  id={group.id}
                  value="checkAll"
                  name="checkAll"
                  style={CHECK_STYLE}
                  type="checkbox"
                  onChange={handleChange}
                />
              </StyledListItem>
              <HorizontalLine />
              <StyledListHeading>
                <span>{getTermInLanguage(translations, 'ryhmanjohtajat')}</span>
              </StyledListHeading>
              {checkboxData.map((member) => {
                return renderMember(member, (member) => isGroupLeader(member))
              })}
              <StyledListHeading>
                <span>{getTermInLanguage(translations, 'ryhmalaiset')}</span>
              </StyledListHeading>
              {checkboxData.map((member) => {
                return renderMember(member, (member) => !isGroupLeader(member))
              })}
            </Content>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
    </StyledAcceptTasks>
  )
}

export default Group
