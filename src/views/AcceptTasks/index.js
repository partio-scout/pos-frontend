import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import { X } from 'react-feather'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import Group from './group'
import { StyledAcceptIcon } from '../../components/TaskActionsIcons'
import {
  updateGroupMemberTask,
  updateGroupMemberTaskGroup,
} from '../../redux/actionCreators'
import { acceptGroupMemberTasks, postTaskGroupEntry } from '../../api'
import { COMPLETION_STATUS, TASK_GROUP_STATUS } from 'consts'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'

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

const StyledAcceptTasks = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
  overflow: auto;
`

const Header = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  padding-top: 1.5rem;
  text-align: center;
  background-color: #1a1a1a;
`

const Subheading = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: normal;
`

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.45rem;
  right: 1rem;
`

const Content = styled.div`
  padding: 1rem;
  > ${Subheading} {
    margin-bottom: 1rem;
  }
`
const AcceptTasks = () => {
  const [memberIdList, setMemberIdList] = useState({})
  const [selectedGroup, setSelectedGroup] = React.useState()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector((state) => state.user.userGroups)
  const translations = useSelector((state) => state.translations)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const dispatch = useDispatch()
  const { taskGuid } = useParams()
  const user = useSelector((state) => state.user)

  const item = itemsByGuid[taskGuid]
  if (!translations || !groupsData) return null

  useEffect(() => {
    if (!Object.keys(memberIdList).length) {
      const groups =
        groupsData &&
        groupsData.length &&
        groupsData.reduce((acc, group) => {
          acc[group.id] = []
          return acc
        }, {})
      setMemberIdList(groups)
    }
  }, [groupsData])

  async function handleSubmit() {
    try {
      const data = memberIdList
      await acceptGroupMemberTasks(data, taskGuid)

      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberTask({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: TASK_GROUP_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function handleTaskGroupSubmit() {
    try {
      const data = {
        groups: memberIdList,
        group_leader_name: user.name,
      }
      await postTaskGroupEntry(data, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberTaskGroup({
              taskgroup_guid: taskGuid,
              user_guid: Number(memberid),
              completed: COMPLETION_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  const updateIdList = (memberIds, groupId) => {
    const updated = Object.assign({}, memberIdList, { [groupId]: memberIds })
    setMemberIdList(updated)
  }

  return (
    <StyledAcceptTasks>
      <Header>
        <Subheading>
          {getTermInLanguage(translations, 'lisaa-ryhmalaisille')}
        </Subheading>
        <CloseIcon onClick={() => history.push(`/?lang=${language}`)} />
      </Header>
      <Content>
        <Subheading>
          {getTermInLanguage(translations, 'omat-ryhmat')}
        </Subheading>
        {groupsData.map((group, i) => {
          return (
            <Group
              key={group.id}
              group={group}
              isLast={i === groupsData.length - 1}
              setMemberIdList={updateIdList}
              setSelectedGroup={setSelectedGroup}
              selectedGroup={selectedGroup}
            />
          )
        })}
        {item.type === 'TASK' ? (
          <AcceptTasksAction onClick={handleSubmit}>
            <ActivityItem>
              <StyledAcceptIcon />
              {getTermInLanguage(translations, 'lisaa-valituille')}
            </ActivityItem>
          </AcceptTasksAction>
        ) : (
          <AcceptTasksAction onClick={handleTaskGroupSubmit}>
            <ActivityItem>
              <StyledAcceptIcon />
              {getTermInLanguage(translations, 'lisaa-valituille')}
            </ActivityItem>
          </AcceptTasksAction>
        )}
      </Content>
    </StyledAcceptTasks>
  )
}

export default AcceptTasks
