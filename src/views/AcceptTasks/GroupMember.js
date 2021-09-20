import React from 'react'
import styled from 'styled-components'
import { Check } from 'react-feather'
import { useSelector } from 'react-redux'

import { getTermInLanguage } from '../../helpers'
import { getMemberCompletedTasks } from '../../helpers/groupTasks'
import { COMPLETION_STATUS } from 'consts'

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

const GroupMember = ({
  member,
  taskGroupTasks,
  language,
  taskGuid,
  handleChange,
}) => {
  const generalTranslations = useSelector((state) => state.translations.yleiset)

  function isCompleted(memberTasks) {
    const completedTasks = Object.keys(memberTasks).filter(
      (guid) => memberTasks[guid] === COMPLETION_STATUS.COMPLETED
    )
    const isCompleted = !!completedTasks.find((guid) => guid === taskGuid)
    return isCompleted
  }

  const CHECK_STYLE = {
    float: 'right',
    margin: 0,
    width: '1.3rem',
    height: '1.3rem',
  }

  return (
    <div key={member.id}>
      <StyledListItem>
        <label style={{ float: 'left', margin: 0 }} htmlFor={member.id}>
          {member.name}
        </label>
        {taskGroupTasks &&
        (getMemberCompletedTasks(member, taskGroupTasks) ===
          taskGroupTasks.length ||
          (!taskGroupTasks && isCompleted(member.tasks))) ? (
          <Check style={{ ...CHECK_STYLE, color: 'green' }} />
        ) : isCompleted(member.tasks) ? (
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
      {taskGroupTasks && (
        <StyledSubtitle>
          {getTermInLanguage(generalTranslations, 'done', language)}:{' '}
          {getMemberCompletedTasks(member, taskGroupTasks)} /{' '}
          {taskGroupTasks.length}
        </StyledSubtitle>
      )}
    </div>
  )
}

export default GroupMember
