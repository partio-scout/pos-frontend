import React, { useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { useParams } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import { Check } from 'react-feather'
import ListItem from 'components/ListItem'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import { StyledAcceptIcon } from '../../components/TaskActionsIcons'
import { useDispatch } from 'react-redux'
import { updateGroupMemberTask } from '../../redux/actionCreators'
import { acceptGroupMemeberTasks } from '../../api'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'

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

const AcceptTasksAction = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 3rem;
  color: ${({ theme }) => theme.color.text};
  background-color: ${({ theme }) => theme.color.background};
  z-index: 1;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `} 200ms linear;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }
`

const StyledListItem = styled.div`
  padding: 0 3.5rem 2rem 3.5rem;
  text-decoration: none;
`

const HorizontalLine = styled.hr`
  margin: 0 3.5rem 2.5rem 3.5rem;
`

const initialList = []

const getInitialCheckboxData = group =>
  group.members.map(member => ({
    selected: false,
    name: member.memberName,
    id: member.memberId,
    tasks: member.memberTasks,
  }))

const Group = ({ group, isLast }) => {
  const dispatch = useDispatch()
  const language = determineLanguageFromUrl(window.location)
  const { taskGuid } = useParams()
  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const [memberIdList, setMemberIdList] = React.useState(initialList)
  const [selectedGroup, setSelectedGroup] = React.useState()
  const [checkboxData, setCheckboxData] = React.useState(
    getInitialCheckboxData(group)
  )
  useEffect(() => setCheckboxData(getInitialCheckboxData(group)), [
    groupsData,
    group,
  ])

  if (!generalTranslations || !groupsData) return null

  const groupName = group.name
  const ageGroup = group.ageGroup
  const ageGroupId = group.id
  const title = '' + groupName + ' / ' + ageGroup

  function isCompleted(memberTasks) {
    const completedTasks = Object.keys(memberTasks).filter(
      guid => memberTasks[guid] === COMPLETION_STATUS.COMPLETED
    )
    const isCompleted = !!completedTasks.find(guid => guid === taskGuid)

    return isCompleted
  }
  function updateGroup(group) {
    if (selectedGroup) {
      setSelectedGroup(null)
    } else {
      setSelectedGroup(group)
    }
  }

  function handleChange(event) {
    if (event.target.name === 'checkAll') {
      checkboxData.map(member => {
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

    setMemberIdList(editableList)
  }

  async function handleSubmit() {
    try {
      const data = {
        userIds: memberIdList,
      }
      await acceptGroupMemeberTasks(data, taskGuid)
      for (let id of memberIdList) {
        dispatch(
          updateGroupMemberTask({
            task_guid: taskGuid,
            user_guid: Number(id),
            completion_status: COMPLETION_STATUS.COMPLETED,
            groupGuid: Number(selectedGroup),
          })
        )
      }
    } catch (e) {
      console.log(e)
    }
    setMemberIdList(initialList)
  }

  function handleCheckboxSelection(memberId, isChecked) {
    const editableCheckboxData = checkboxData
    editableCheckboxData.map(member => {
      if (member.id === memberId && isChecked) {
        member.selected = true
      }
      if (member.id === memberId && !isChecked) {
        member.selected = false
      }
      return setCheckboxData(editableCheckboxData)
    })
  }

  const CHECK_STYLE = {
    float: 'right',
    margin: 0,
    width: '1.3rem',
    height: '1.3rem',
  }

  return (
    <StyledAcceptTasks isLast={isLast}>
      <Accordion
        allowZeroExpanded
        onChange={() => updateGroup(ageGroupId)}
        key={ageGroupId}
      >
        <AccordionItem key={ageGroupId}>
          <AccordionItemHeading>
            <AccordionItemButton>
              <ListItem
                key={ageGroupId}
                ageGroupGuid={ageGroupId}
                title={title}
                language="fi"
                icon={null}
                itemType={ITEM_TYPES.TASK}
                showActions
                showActionsIcon
              />
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            <Content>
              <StyledListItem>
                <label style={{ float: 'left', margin: 0 }} htmlFor={group.id}>
                  {getTermInLanguage(
                    generalTranslations,
                    'select_all',
                    language
                  )}
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
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
              {checkboxData.map(member => {
                return (
                  <StyledListItem key={member.id}>
                    <label
                      style={{ float: 'left', margin: 0 }}
                      htmlFor={member.id}
                    >
                      {member.name}
                    </label>
                    {isCompleted(member.tasks) ? (
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
                )
              })}
            </Content>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
      {memberIdList.length > 0 ? (
        <AcceptTasksAction onClick={handleSubmit}>
          <ActivityItem>
            <StyledAcceptIcon />
            {getTermInLanguage(
              generalTranslations,
              'add_to_selected',
              language
            )}
          </ActivityItem>
        </AcceptTasksAction>
      ) : null}
    </StyledAcceptTasks>
  )
}

export default Group
