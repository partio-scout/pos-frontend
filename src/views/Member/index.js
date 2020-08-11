import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { X } from 'react-feather'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'
import { useHistory, useParams } from 'react-router-dom'
import ListItem from 'components/ListItem'
import { ITEM_TYPES, COMPLETION_STATUS, AGE_GROUPS } from '../../consts'
import { actionTypes } from 'components/Actions'

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
      ${theme.color.ageGroupGradients[ageGroupGuid] ||
        theme.color.ageGroupGradients.default},
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
  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const itemsByGuid = useSelector(state => state.itemsByGuid)
  const activityTranslations = useSelector(
    state => state.translations.aktiviteetin_ylakasite
  )

  const getTranslation = taskOrTaskGroup => {
    return taskOrTaskGroup.languages.find(x => x.lang === language)
  }
  const { groupId } = useParams()
  const { memberId } = useParams()

  if (!generalTranslations || !groupsData) return null

  if (!itemsByGuid || !activityTranslations) return null

  const group = groupsData.find(
    groups => groups.id.toString() === groupId.toString()
  )
  const members = group.members

  const member = members.find(
    members => members.memberId.toString() === memberId.toString()
  )

  const memberTasks = member.memberTasks

  const completedTasks = Object.keys(memberTasks).filter(
    guid => memberTasks[guid] === COMPLETION_STATUS.COMPLETED
  )

  const completionRequestedTasks = Object.keys(memberTasks).filter(
    guid => memberTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED
  )

  const activeTasks = Object.keys(memberTasks).filter(
    guid => memberTasks[guid] === COMPLETION_STATUS.ACTIVE
  )

  const ageGroupGuid = AGE_GROUPS[group.ageGroupId]

  const groupTitle = '' + group.name + ' / ' + group.ageGroup

  return (
    <Background ageGroupGuid={ageGroupGuid}>
      <Content>
        <CloseIcon onClick={() => history.push(`/group/${groupId}`)} />
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
          <h4>
            {getTermInLanguage(
              activityTranslations,
              'aktiviteetti_plural',
              language
            )}
          </h4>
          <h4>
            {getTermInLanguage(
              generalTranslations,
              'task_completion_requested',
              language
            )}
          </h4>
          <TaskList>
            {completionRequestedTasks.map((taskGuid, index) => {
              const task = itemsByGuid[taskGuid]
              const taskTranslation = getTranslation(task.item)
              const parent = itemsByGuid[task.parentGuid]
              return (
                <ListItem
                  key={task.guid + index}
                  guid={task.guid}
                  groupGuid={Number(groupId)}
                  userGuid={Number(memberId)}
                  title={
                    taskTranslation ? taskTranslation.title : task.item.title
                  }
                  subTitle={parent.item.title}
                  itemType={ITEM_TYPES.TASK}
                  actionsComponent={actionTypes.groupLeaderActions}
                  showActions
                />
              )
            })}
          </TaskList>
          <h4>
            {getTermInLanguage(generalTranslations, 'working_on_it', language)}
          </h4>
          <TaskList>
            {activeTasks.map((taskGuid, index) => {
              const task = itemsByGuid[taskGuid]
              const taskTranslation = getTranslation(task.item)
              const parent = itemsByGuid[task.parentGuid]
              return (
                <ListItem
                  key={task.guid + index}
                  guid={task.guid}
                  title={
                    taskTranslation ? taskTranslation.title : task.item.title
                  }
                  subTitle={parent.item.title}
                  itemType={ITEM_TYPES.TASK}
                  actionsComponent={actionTypes.groupLeaderActions}
                />
              )
            })}
          </TaskList>
          <h4>
            {getTermInLanguage(generalTranslations, 'completed', language)}
          </h4>
          <TaskList>
            {completedTasks.map((taskGuid, index) => {
              const task = itemsByGuid[taskGuid]
              const taskTranslation = getTranslation(task.item)
              const parent = itemsByGuid[task.parentGuid]
              return (
                <ListItem
                  key={task.guid + index}
                  guid={task.guid}
                  userGuid={Number(memberId)}
                  groupGuid={Number(groupId)}
                  title={
                    taskTranslation ? taskTranslation.title : task.item.title
                  }
                  subTitle={parent.item.title}
                  itemType={ITEM_TYPES.TASK}
                  actionsComponent={actionTypes.groupLeaderActions}
                  showActions
                />
              )
            })}
          </TaskList>
        </BodyContent>
      </Content>
    </Background>
  )
}

export default Member
