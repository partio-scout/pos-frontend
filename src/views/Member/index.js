import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { X } from 'react-feather'
import { useHistory, useParams } from 'react-router-dom'

import {
  determineLanguageFromUrl,
  getActivityGroupIcon,
  getTermInLanguage,
  getItemId,
} from '../../helpers'
import ListItem from 'components/ListItem'
import {
  ITEM_TYPES,
  COMPLETION_STATUS,
  AGE_GROUPS,
  TASK_GROUP_STATUS,
} from '../../consts'
import { actionTypes } from 'components/Actions'
import CompletedTasks from '../Profile/CompletedTasks'
import { getTaskGroupsWithChildTaskGroups } from '../../helpers/groupTasks'
import MemberTaskListItem, { LIST_ITEM_TYPES } from './taskListItems'
import CenteredSpinner from '../../components/LoadingSpinner'

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.color.gradientDark};
  pointer-events: all;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 19rem;
    background: ${({ theme, ageGroupGuid }) => `
    linear-gradient(
      to bottom,
      ${
        theme.color.ageGroupGradients[ageGroupGuid] ||
        theme.color.ageGroupGradients.default
      },
      ${theme.color.gradientDark}
    );
    `};
  }
`

const BodyContent = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding: 1rem;
  padding-bottom: 2rem;
  overflow: scroll;

  > h4 {
    font-weight: normal;
    text-transform: capitalize;
    padding-bottom: 1rem;
    text-align: center;
    font-size: 18px;
  }
`

const HeadingContent = styled.div`
  padding-top: 7rem;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 24px;

  > h3 {
    font-size: 24px;
    font-weight: normal;
    margin-bottom: 5px;
  }
  > span {
    color: ${({ theme }) => theme.color.subText};
  }
`

const Picture = styled.div`
  background: white;
  width: 30vw;
  height: 30vw;
  border-radius: 50%;
  margin: 0 auto;
`

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.45rem;
  right: 1rem;
`

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  display: grid;
  grid-template-rows: 19rem minmax(0, 1fr);
  overflow: hidden;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
`

const Member = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector((state) => state.user.userGroups)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const activityGroups = useSelector((state) => state.activityGroups)
  const translations = useSelector((state) => state.translations)

  const { groupId } = useParams()
  const { memberId } = useParams()

  if (
    !groupsData ||
    !itemsByGuid ||
    !translations ||
    Object.keys(itemsByGuid).length < 25
  ) {
    return (
      <Background>
        <Content>
          <CenteredSpinner fullHeight />
        </Content>
      </Background>
    )
  }

  const group = groupsData.find(
    (groups) => groups.id.toString() === groupId.toString()
  )

  const members = group.members

  const member = members.find(
    (members) => members.memberId.toString() === memberId.toString()
  )

  const memberTasks = member.memberTasks
  const memberTaskGroups = member.memberTaskGroups

  const completedTasks = Object.keys(memberTasks)
    .filter((guid) => memberTasks[guid] === COMPLETION_STATUS.COMPLETED)
    .filter((task) => task !== 'undefined')

  const taskGroupsWithChildTaskGroups = getTaskGroupsWithChildTaskGroups(
    itemsByGuid,
    completedTasks
  )

  const completionRequestedTasks = Object.keys(memberTasks).filter(
    (guid) => memberTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const activeTasks = Object.keys(memberTasks).filter(
    (guid) => memberTasks[guid] === COMPLETION_STATUS.ACTIVE
  )

  const ageGroupGuid = AGE_GROUPS[group.ageGroupId]

  const groupTitle = '' + group.name + ' / ' + group.ageGroup

  const parentTaskGroupGuids = Object.keys(taskGroupsWithChildTaskGroups)

  const completedTaskGroups = Object.keys(memberTaskGroups)
    .filter((guid) => memberTaskGroups[guid] === TASK_GROUP_STATUS.COMPLETED)
    .map((id) => itemsByGuid[id])

  const completedTaskGroupsGuids = completedTaskGroups.map(
    (group) => group && group.id
  )

  const taskGroupsMarkedCompleted = completedTaskGroupsGuids
    .filter((guid) => !parentTaskGroupGuids.includes(guid))
    .map((id) => itemsByGuid[id])

  const Lists = () => {
    /* If the user navigates to this page too fast or reloads the page all the data is not available.
     * The initial download only fetches age groups which means the tasks and task groups are not available
     * so we should show a spinner while we wait for them to load.
     */
    return Object.keys(itemsByGuid).length < 25 ? (
      <CenteredSpinner />
    ) : (
      <>
        <h4>{getTermInLanguage(translations, 'odottaa-hyvaksyntaa')}</h4>
        <TaskList>
          {completionRequestedTasks.map((taskGuid, index) => (
            <MemberTaskListItem
              key={index}
              itemsByGuid={itemsByGuid}
              taskGuid={taskGuid}
              activityGroups={activityGroups}
              language={language}
              type={LIST_ITEM_TYPES.COMPLETION_REQUEST_LIST_ITEM}
              groupId={groupId}
              memberId={memberId}
            />
          ))}
        </TaskList>
        <h4>{getTermInLanguage(translations, 'tyon-alla')}</h4>
        <TaskList>
          {activeTasks.map((taskGuid, index) => (
            <MemberTaskListItem
              key={index}
              itemsByGuid={itemsByGuid}
              taskGuid={taskGuid}
              activityGroups={activityGroups}
              language={language}
              type={LIST_ITEM_TYPES.ACTIVE_LIST_ITEM}
            />
          ))}
        </TaskList>
        <h4>{getTermInLanguage(translations, 'suoritetut')}</h4>
        <TaskList>
          {taskGroupsWithChildTaskGroups && (
            <CompletedTasks
              language={language}
              itemsByGuid={itemsByGuid}
              taskGroupsWithChildTaskGroups={taskGroupsWithChildTaskGroups}
              groupMember={{ groupId, memberId }}
              actionsComponent={actionTypes.groupLeaderActions}
              userGuid={Number(memberId)}
              groupGuid={group.id}
              parentTaskGroupGuids={parentTaskGroupGuids}
              completedTaskGroupsGuids={completedTaskGroupsGuids}
            />
          )}
          {taskGroupsMarkedCompleted &&
            taskGroupsMarkedCompleted.map((taskGroup) => {
              if (!taskGroup) return null
              return (
                <ListItem
                  key={taskGroup.id}
                  guid={getItemId(taskGroup.item)}
                  ageGroupGuid={taskGroup.ageGroupGuid}
                  title={taskGroup.item.title}
                  subTitle={getTermInLanguage(
                    translations,
                    'kokonaisuus-valmis'
                  )}
                  icon={getActivityGroupIcon(taskGroup.item)}
                  language={language}
                  itemType={ITEM_TYPES.TASK_GROUP}
                  showActions
                />
              )
            })}
        </TaskList>
      </>
    )
  }

  return (
    <Background ageGroupGuid={ageGroupGuid}>
      <Content>
        <CloseIcon
          onClick={() => history.push(`/group/${groupId}/?lang=${language}`)}
        />
        <HeadingContent>
          <Picture />
          {member.memberName && group && (
            <>
              <h3>{member.memberName}</h3>
              <span>{groupTitle}</span>
            </>
          )}
        </HeadingContent>
        <BodyContent>
          <h4>{getTermInLanguage(translations, 'aktiviteetit')}</h4>
          <Lists />
        </BodyContent>
      </Content>
    </Background>
  )
}

export default Member
