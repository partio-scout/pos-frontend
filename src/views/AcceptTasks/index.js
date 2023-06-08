import React, { useEffect, useState } from 'react'
import {
  AcceptTasksAction,
  ActivityItem,
  CloseIcon,
  Content,
  Header,
  Subheading,
  StyledAcceptTasks,
} from './styles'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import Group from './group'
import { StyledAcceptIcon } from '../../components/TaskActionsIcons'
import {
  updateGroupMemberTask,
  updateGroupMemberTaskGroup,
  updateGroupMemberAgeGroup,
  deleteGroupMemberTask,
  deleteGroupMemberTaskGroup,
  deleteGroupMemberAgeGroup,
} from '../../redux/actionCreators'
import {
  acceptGroupMemberTasks,
  deleteGroupMemberTasks,
  postTaskGroupEntry,
  deleteTaskGroupEntry,
  postAgeGroupEntry,
  deleteAgegroupEntry,
} from '../../api'
import { TASK_GROUP_STATUS, COMPLETION_STATUS } from 'consts'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import CenteredSpinner from '../../components/LoadingSpinner'
import LoadingSpinner from '../../components/LoadingSpinner'

const AcceptTasks = () => {
  const [memberIdList, setMemberIdList] = useState({})
  const [deleteItemMemberIdList, setDeleteItemMemberIdList] = useState({})
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

  const handleAcceptGroupMemberTasks = async (memberIdList, taskGuid) => {
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
    } catch (error) {
      console.log('handleAcceptGroupMemberTasks error ', error)
    }
  }

  async function handleDeleteGroupMemberTasks(memberIdList, taskGuid) {
    try {
      await deleteGroupMemberTasks(memberIdList, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            deleteGroupMemberTask({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: COMPLETION_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (error) {
      console.log('handleDeleteGroupMemberTasks error ', error)
    }
  }

  async function handleSubmit() {
    try {
      await handleAcceptGroupMemberTasks(memberIdList, taskGuid)
      await handleDeleteGroupMemberTasks(deleteItemMemberIdList, taskGuid)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAcceptGroupMemberTaskGroups = async (
    postdata,
    taskGuid,
    memberIdList
  ) => {
    try {
      await postTaskGroupEntry(postdata, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberTaskGroup({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: COMPLETION_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (error) {
      console.log('handleAcceptGroupMemberTaskGroups error ', error)
    }
  }

  const handleDeleteGroupMemberTaskGroups = async (
    deleteData,
    taskGuid,
    memberIdList
  ) => {
    try {
      deleteTaskGroupEntry(deleteData, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            deleteGroupMemberTaskGroup({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: TASK_GROUP_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (error) {
      console.log('handleDeleteGroupMemberTaskGroups error ', error)
    }
  }

  async function handleTaskGroupSubmit() {
    try {
      const postdata = {
        groups: memberIdList,
        group_leader_name: user.name,
      }
      await handleAcceptGroupMemberTaskGroups(postdata, taskGuid, memberIdList)
      const deleteData = {
        itemsToBeDeleted: deleteItemMemberIdList,
        group_leader_name: user.name,
      }
      await handleDeleteGroupMemberTaskGroups(
        deleteData,
        taskGuid,
        deleteItemMemberIdList
      )
    } catch (e) {
      console.log('handleTaskGroupSubmit error: ', e)
    }
  }

  const handleAcceptGroupMemberAgeGroups = async (
    postdata,
    taskGuid,
    memberIdList
  ) => {
    try {
      await postAgeGroupEntry(postdata, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            updateGroupMemberAgeGroup({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: COMPLETION_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (error) {
      console.log('handleAcceptGroupMemberAgeGroups error ', error)
    }
  }

  const handleDeleteGroupMemberAgeGroups = async (
    deleteData,
    taskGuid,
    memberIdList
  ) => {
    try {
      deleteAgegroupEntry(deleteData, taskGuid)
      for (let [membergroup, memberIds] of Object.entries(memberIdList)) {
        for (let memberid of memberIds) {
          dispatch(
            deleteGroupMemberAgeGroup({
              task_guid: taskGuid,
              user_guid: Number(memberid),
              completion_status: TASK_GROUP_STATUS.COMPLETED,
              groupGuid: Number(membergroup),
            })
          )
        }
      }
    } catch (error) {
      console.log('handleDeleteGroupMemberAgeGroups error ', error)
    }
  }

  async function handleAgeGroupSubmit() {
    try {
      const postdata = {
        groups: memberIdList,
        group_leader_name: user.name,
      }
      await handleAcceptGroupMemberAgeGroups(postdata, taskGuid, memberIdList)
      const deleteData = {
        itemsToBeDeleted: deleteItemMemberIdList,
        group_leader_name: user.name,
      }
      await handleDeleteGroupMemberAgeGroups(
        deleteData,
        taskGuid,
        deleteItemMemberIdList
      )
    } catch (e) {
      console.log('handleAgeGroupSubmit error: ', e)
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
          {getTermInLanguage(translations, 'hallitse-merkintoja')}
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
              {getTermInLanguage(translations, 'tallenna-muutokset')}
            </ActivityItem>
          </AcceptTasksAction>
        )}
      </Content>
    </StyledAcceptTasks>
  )
}

export default AcceptTasks
