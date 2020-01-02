import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailPage from 'components/DetailPage'
import ListItem from 'components/ListItem'
import TaskGroupItem from 'components/TaskGroupItem'
import Actions from 'components/Actions'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import { ITEM_TYPES } from 'consts'

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
  overflow: scroll;
`

const Task = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  > :first-child {
    flex: 1;
    overflow: hidden;
  }
`

const StyledActions = styled(Actions)`
  padding-left: 5px;
`

const TaskGroup = () => {
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)

  const taskGroup = useSelector(state => state.itemsByGuid[guid])
  const activityTranslations = useSelector(
    state => state.translations.aktiviteetin_ylakasite
  )

  if (!taskGroup || !activityTranslations) {
    return null
  }

  const getTranslation = taskOrTaskGroup => {
    return taskOrTaskGroup.languages.find(x => x.lang === language)
  }

  const { item } = taskGroup
  const taskGroupTranslation = getTranslation(item)

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
          return (
            <TaskGroupItem
              key={subTaskGroup.guid}
              taskGroup={subTaskGroup}
              ageGroupIndex={taskGroup.ageGroupIndex}
              language={language}
              tasksTerm={tasksTerm}
            />
          )
        })}
        {item.tasks.map(task => {
          const taskTranslation = getTranslation(task)
          return (
            <Task key={task.guid}>
              <ListItem
                guid={task.guid}
                ageGroupIndex={taskGroup.ageGroupIndex}
                title={taskTranslation ? taskTranslation.title : task.title}
                language={language}
              />
              <StyledActions guid={task.guid} itemType={ITEM_TYPES.TASK} />
            </Task>
          )
        })}
      </TaskList>
    </StyledDetailPage>
  )
}

export default TaskGroup
