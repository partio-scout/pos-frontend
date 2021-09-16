import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailPage from 'components/DetailPage'
import ListItem from 'components/ListItem'
import TaskGroupItem from 'components/TaskGroupItem'
import { fetchTaskDetails } from 'api'
import { actionTypes } from 'components/Actions'

import {
  determineLanguageFromUrl,
  getTermInLanguage,
  getTaskGroupStatus,
} from 'helpers'
import {ITEM_TYPES} from 'consts'

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
  overflow: scroll;
`

const TaskGroup = () => {
  const [details, setDetails] = useState()
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const userTasks = useSelector(state => state.tasks)
  const user = useSelector(state => state.user)
  const taskGroup = useSelector(state => state.itemsByGuid[guid])
  const activityTranslations = useSelector(
    state => state.translations.aktiviteetin_ylakasite
  )
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const favourites = useSelector(state => state.favourites)

  const mandatoryTasksGuids = taskGroup.item.tasks.length > 0 ? useSelector(state => state.taskGroupRequirements.taskGroupRequirements[guid].mandatoryTasks) : []
  if (!taskGroup || !activityTranslations) {
    return null
  }

  const getTranslation = taskOrTaskGroup => {
    return taskOrTaskGroup.languages.find(x => x.lang === language)
  }

  const getTaskDetails = useCallback(async () => {
    const res = await fetchTaskDetails(taskGroup.item.guid, language)
    setDetails(res)
  }, [taskGroup, language])

  useEffect(() => {
    getTaskDetails()
  }, [getTaskDetails])

  const { item } = taskGroup
  const taskGroupTranslation = getTranslation(item)

  const mandatoryTasks = []
  const optionalTasks = []

  item.tasks.forEach(task => {
    if (mandatoryTasksGuids.includes(task.guid)) {
      mandatoryTasks.push(task)
    } else {
      optionalTasks.push(task)
    }
  })

  const getTask = task => {
    const taskTranslation = getTranslation(task)
    const status = userTasks[task.guid]
      ? userTasks[task.guid].toLowerCase()
      : ''
    const task_status = status === 'active' ? 'started' : `task_${status}`

    return taskTranslation && taskTranslation.title ? (
      <ListItem
        key={task.guid}
        guid={task.guid}
        ageGroupGuid={taskGroup.ageGroupGuid}
        title={taskTranslation.title}
        subTitle={getTermInLanguage(
          generalTranslations,
          `${task_status}`,
          language
        )}
        language={language}
        itemType={ITEM_TYPES.TASK}
        showActions
        showFavourite
        isFavourite={favourites.includes(task.guid)}
        isLoggedIn={status}
      />
    ) : null
  }
 
  return (
    <StyledDetailPage
      onBackClick={() =>
        history.push(`/guid/${taskGroup.parentGuid}?lang=${language}`)
      }
      title={taskGroupTranslation ? taskGroupTranslation.title : item.title}
    >
      <TaskList>
        {item.taskgroups.map(subTaskGroup => {
          const tasksTerm =
            item.subtask_term && item.subtask_term.name
              ? getTermInLanguage(
                  activityTranslations,
                  `${item.subtask_term.name}_plural`,
                  language
                )
              : getTermInLanguage(
                  activityTranslations,
                  'aktiviteetti_plural',
                  language
                )
          const status = user.loggedIn
            ? getTaskGroupStatus(
                subTaskGroup,
                userTasks,
                getTermInLanguage(generalTranslations, 'done', language)
              )
            : null
          return (
            <TaskGroupItem
              key={subTaskGroup.guid}
              taskGroup={subTaskGroup}
              ageGroupGuid={taskGroup.ageGroupGuid}
              subTitle={status}
              language={language}
              tasksTerm={tasksTerm}
              itemType={ITEM_TYPES.TASK_GROUP}
              actionsComponent={actionTypes.taskGroupActions}
              groupGuid={subTaskGroup.guid}
              showActions
            />
          )
        })}
        {item.tasks.length > 0 && details ?
          <>
            <p>{details.ingress}</p>
            <p>{details.content}</p>
            <h4><span>{getTermInLanguage(generalTranslations, 'mandatory_plural', language)}</span></h4>
            {mandatoryTasks.length > 0
              ? mandatoryTasks.map(task => {
                return getTask(task)
              })
              : <p><span>{getTermInLanguage(generalTranslations, 'no_mandatory_tasks', language)}</span></p>}
            <h4><span>{getTermInLanguage(generalTranslations, 'optional_plural', language)}</span></h4>
            {optionalTasks.length > 0
              ? optionalTasks.map(task => {
                return getTask(task)
              })
              : <p>Ei valinnaisia tehtäviä</p>}
          </>
          :
          <></>
        }
      </TaskList>
    </StyledDetailPage>
  )
}

export default TaskGroup
