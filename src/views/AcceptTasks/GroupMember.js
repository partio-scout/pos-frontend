import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'

import { getTermInLanguage } from '../../helpers'
import { getMemberCompletedTasks } from '../../helpers/groupTasks'

const StyledListItem = styled.div`
  padding: 0.25rem;
  text-decoration: none;
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  min-width: 15rem;
  overflow-x: scroll;
`
const StyledSubtitle = styled.span`
  padding: 0.25rem;
  color: ${({ theme }) => theme.color.subText};
`

const GroupMember = ({ member, item, mandatoryTasks, handleChange }) => {
  const translations = useSelector((state) => state.translations)

  const getGroupMemberTaskList = (member, item) => {
    return (
      <>
        <StyledListItem>
          <label style={{ float: 'left', margin: 0 }} htmlFor={member.id}>
            {member.name}
          </label>
          {mandatoryTasks !== undefined &&
          getMemberCompletedTasks(member, mandatoryTasks) ===
            mandatoryTasks.length ? (
            <Check style={{ ...CHECK_STYLE, color: 'green' }} />
          ) : (
            <input
              id={member.id}
              style={CHECK_STYLE}
              type="checkbox"
              value={member.id}
              onChange={handleChange}
              checked={member.selected}
            />
          )}
        </StyledListItem>
        <StyledSubtitle>
          {getTermInLanguage(translations, 'tehdyt')}:{' '}
          {getMemberCompletedTasks(member, item)} / {item.length}
        </StyledSubtitle>
      </>
    )
  }

  const getGroupMemberTaskGroupList = (member) => {
    return (
      <StyledListItem>
        <label style={{ float: 'left', margin: 0 }} htmlFor={member.id}>
          {member.name}
        </label>
        <input
          id={member.id}
          style={CHECK_STYLE}
          type="checkbox"
          value={member.id}
          onChange={handleChange}
          checked={member.selected}
        />
      </StyledListItem>
    )
  }

  const getGroupMemberAgeGroupList = (member) => {
    return (
      <StyledListItem>
        <label style={{ float: 'left', margin: 0 }} htmlFor={member.id}>
          {member.name}
        </label>
        <input
          id={member.id}
          style={CHECK_STYLE}
          type="checkbox"
          value={member.id}
          onChange={handleChange}
          checked={member.selected}
        />
      </StyledListItem>
    )
  }

  const CHECK_STYLE = {
    float: 'right',
    margin: 0,
    width: '1.3rem',
    height: '1.3rem',
  }

  const getMemberItemList = (item) => {
    switch (item.type) {
      case 'TASK_GROUP':
        return getGroupMemberTaskGroupList(member, item)
      case 'AGE_GROUP':
        return getGroupMemberAgeGroupList(member, item)
      default:
        return getGroupMemberTaskList(member, item)
    }
  }

  return <div key={member.id}>{item && getMemberItemList(item)}</div>
}

export default GroupMember
