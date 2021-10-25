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
import ListItem from 'components/ListItem'
import { COMPLETION_STATUS, ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import { StyledAcceptIcon } from '../../components/TaskActionsIcons'
import { useDispatch } from 'react-redux'
import { updateGroupMemberTask } from '../../redux/actionCreators'
import { acceptGroupMemberTasks } from '../../api'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'
import GroupMember from './GroupMember'

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
const initialList = []

const getInitialCheckboxData = (group) =>
  group.members.map((member) => ({
    selected: false,
    name: member.memberName,
    id: member.memberId,
    tasks: member.memberTasks,
  }))

const Group = ({ group, isLast }) => {
  const dispatch = useDispatch()
  const language = determineLanguageFromUrl(window.location)
  const { taskGuid } = useParams()
  const groupsData = useSelector((state) => state.user.userGroups)
  const generalTranslations = useSelector((state) => state.translations.yleiset)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const [memberIdList, setMemberIdList] = React.useState(initialList)
  const [selectedGroup, setSelectedGroup] = React.useState()
  const [checkboxData, setCheckboxData] = React.useState(
    getInitialCheckboxData(group)
  )
  useEffect(
    () => setCheckboxData(getInitialCheckboxData(group)),
    [groupsData, group]
  )

  if (!generalTranslations || !groupsData) return null

  const groupName = group.name
  const ageGroup = group.ageGroup
  const ageGroupId = group.id
  const title = '' + groupName + ' / ' + ageGroup

  const taskGroup = itemsByGuid[taskGuid]
  const taskGroupTasks = taskGroup.item.activities

  function isGroupLeader(member) {
    const groupLeaders = group.members.filter(
      (member) => member.isGroupLeader === true
    )
    const isGroupLeader = groupLeaders.some(
      (groupLeader) => groupLeader['memberId'] === member.id
    )
    return isGroupLeader
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

    setMemberIdList(editableList)
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

  async function handleSubmit() {
    try {
      const data = {
        userIds: memberIdList,
      }
      await acceptGroupMemberTasks(data, taskGuid)
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

  async function handleTaskGroupSubmit() {
    try {
      await taskGroupTasks.map((task) => {
        const data = {
          userIds: memberIdList.filter((memberId) => {
            const cbData = checkboxData.find(
              (cbData) => cbData.id === Number(memberId)
            )
            return cbData.tasks[task.wp_guid] !== 'COMPLETED'
          }),
        }
        acceptGroupMemberTasks(data, task.wp_guid)
        for (let id of memberIdList) {
          dispatch(
            updateGroupMemberTask({
              task_guid: task.wp_guid,
              user_guid: Number(id),
              completion_status: COMPLETION_STATUS.COMPLETED,
              groupGuid: Number(selectedGroup),
            })
          )
        }
      })
    } catch (e) {
      console.log(e)
    }
    setMemberIdList(initialList)
  }

  const renderMember = (member, checkFunction) => {
    return (
      checkFunction(member) && (
        <div key={member.id}>
          <GroupMember
            member={member}
            taskGroupTasks={taskGroupTasks}
            language={language}
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
                showDropDownIcon
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
              <StyledListHeading>
                <span>
                  {getTermInLanguage(
                    generalTranslations,
                    'group_leaders',
                    language
                  )}
                </span>
              </StyledListHeading>
              {checkboxData.map((member) => {
                return renderMember(member, (member) => isGroupLeader(member))
              })}
              <StyledListHeading>
                <span>
                  {getTermInLanguage(
                    generalTranslations,
                    'group_members',
                    language
                  )}
                </span>
              </StyledListHeading>
              {checkboxData.map((member) => {
                return renderMember(member, (member) => !isGroupLeader(member))
              })}
            </Content>
          </AccordionItemPanel>
        </AccordionItem>
      </Accordion>
      {memberIdList.length > 0 && !taskGroupTasks ? (
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
      ) : memberIdList.length > 0 && taskGroupTasks ? (
        <AcceptTasksAction onClick={handleTaskGroupSubmit}>
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
