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
  updateGroupMemberAgeGroup,
} from '../../redux/actionCreators'
import {
  acceptGroupMemberTasks,
  postTaskGroupEntry,
  deleteTaskGroupEntry,
  postAgeGroupEntry,
} from '../../api'
import { COMPLETION_STATUS, TASK_GROUP_STATUS } from 'consts'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import CenteredSpinner from '../../components/LoadingSpinner'
import LoadingSpinner from '../../components/LoadingSpinner'

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
  padding: 3px 0 3px;
  border: 2px solid #545454;
  border-radius: 3%;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }

  &:active {
    border: 2px solid #fff;
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
  const [deleteItemMemberIdList, setDeleteItemMemberIdList] = useState({})
  const [selectedGroup, setSelectedGroup] = React.useState()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector((state) => state.user.userGroups)
  const translations = useSelector((state) => state.translations)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const dispatch = useDispatch()
  const { taskGuid } = useParams()
  const user = useSelector((state) => state.user)
  const [isLoading, setLoading] = useState(false)

  const item = itemsByGuid[taskGuid]

  useEffect(() => {
    const groups =
      groupsData &&
      groupsData.length &&
      groupsData.reduce((acc, group) => {
        const memberIdsWithCompletedItem = group.members
          .filter((member) => {
            return Object.keys(member.memberAgeGroups).includes(taskGuid)
          })
          .map((member) => member.memberId)
        acc[group.id] = memberIdsWithCompletedItem

        return acc
      }, {})
    setMemberIdList(groups)
  }, [groupsData])

  if (!translations || !groupsData) {
    return (
      <StyledAcceptTasks>
        <LoadingSpinner fullHeight />
      </StyledAcceptTasks>
    )
  }

  async function handleSubmit() {
    try {
      await acceptGroupMemberTasks(memberIdList, taskGuid)

      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberTask({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: COMPLETION_STATUS.COMPLETED,
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
      const postdata = {
        groups: memberIdList,
        group_leader_name: user.name,
      }
      await postTaskGroupEntry(postdata, taskGuid)
      const deleteData = {
        itemsToBeDeleted: deleteItemMemberIdList,
        group_leader_name: user.name,
      }
      await deleteTaskGroupEntry(deleteData, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberTaskGroup({
              taskgroup_guid: taskGuid,
              user_guid: Number(memberid),
              completed: TASK_GROUP_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (e) {
      console.log(e)
    }
  }

  async function handleAgeGroupSubmit() {
    try {
      const data = {
        groups: memberIdList,
        group_leader_name: user.name,
      }
      await postAgeGroupEntry(data, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberAgeGroup({
              agegroup_guid: taskGuid,
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

  const onSubmitClick = async (...args) => {
    setLoading(true)
    if (memberIdList && Object.values(memberIdList).length) {
      if (item.type === 'TASK') await handleSubmit(args)
      else if (item.type === 'TASK_GROUP') await handleTaskGroupSubmit(args)
      else await handleAgeGroupSubmit(args)
    }
    setLoading(false)
  }

  const updateIdList = (memberIds, groupId) => {
    const updated = Object.assign({}, memberIdList, { [groupId]: memberIds })
    setMemberIdList(updated)
  }

  const deleteIdList = (memberIds, groupId) => {
    const removed = Object.assign({}, deleteItemMemberIdList, {
      [groupId]: memberIds,
    })
    setDeleteItemMemberIdList(removed)
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
              setPostMemberIdList={updateIdList}
              setDeleteMemberIdList={deleteIdList}
              setSelectedGroup={setSelectedGroup}
              selectedGroup={selectedGroup}
            />
          )
        })}
        {isLoading ? (
          <AcceptTasksAction>
            <CenteredSpinner />
          </AcceptTasksAction>
        ) : (
          <AcceptTasksAction onClick={onSubmitClick}>
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
