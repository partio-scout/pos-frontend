import React, { useEffect } from 'react'
import styled from 'styled-components'
import striptags from 'striptags'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import DetailPage from 'components/DetailPage'
import ListItem from 'components/ListItem'

import {
  deepFlatten,
  determineLanguageFromUrl,
  getActivityGroupIcon,
  getTermInLanguage,
  getItemId,
} from 'helpers'
import { ITEM_TYPES } from 'consts'
import { setItemsByGuid } from 'redux/actionCreators'

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const TaskList = styled.div`
  padding-bottom: 2rem;
  overflow: scroll;
`

const TaskGroup = () => {
  const { id } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const userTasks = useSelector((state) => state.tasks)
  const taskGroup = useSelector((state) => state.itemsByGuid[id])
  const translations = useSelector((state) => state.translations)
  const favourites = useSelector((state) => state.favourites)
  const activityGroup = useSelector(
    (state) => state.activityGroups[taskGroup.item.id]
  )
  const dispatch = useDispatch()
  const mandatoryTasks = []
  const optionalTasks = []

  useEffect(() => {
    dispatch(setItemsByGuid(deepFlatten(taskGroup.item.activities)))
  }, [id])

  if (activityGroup === undefined) {
    return null
  } else {
    activityGroup.activities.forEach((activity) => {
      if (activity.mandatory === true) {
        mandatoryTasks.push(activity)
      } else {
        optionalTasks.push(activity)
      }
    })
  }

  const getTask = (task) => {
    const taskId = getItemId(task)
    const status = userTasks[taskId] ? userTasks[taskId].toLowerCase() : ''
    const task_status = status === 'active' ? 'aloitettu' : status
    const icon = getActivityGroupIcon(activityGroup)
    return (
      <ListItem
        key={task.id}
        guid={taskId}
        ageGroupGuid={getItemId(taskGroup.item.age_group)}
        title={task.title}
        subTitle={getTermInLanguage(translations, `${task_status}`)}
        language={language}
        icon={icon}
        itemType={ITEM_TYPES.TASK}
        showActions
        showFavourite
        isFavourite={favourites.includes(taskId)}
        isLoggedIn={status}
      />
    )
  }

  return (
    <StyledDetailPage
      onBackClick={() =>
        history.push(
          `/guid/${getItemId(taskGroup.item.age_group)}?lang=${language}`
        )
      }
      title={activityGroup.title}
    >
      <TaskList>
        {activityGroup.ingress && <p>{striptags(activityGroup.ingress)}</p>}
        {activityGroup.content && activityGroup.content.length < 700 && (
          <p>{striptags(activityGroup.content)}</p>
        )}
        {activityGroup.activities.length > 0 ? (
          <>
            <h4>
              <span>{getTermInLanguage(translations, 'pakolliset')}</span>
            </h4>
            {mandatoryTasks.length > 0 ? (
              mandatoryTasks.map((task) => {
                return getTask(task)
              })
            ) : (
              <p>
                <span>
                  {getTermInLanguage(
                    translations,
                    'ei-pakollisia-aktiviteetteja',
                    language
                  )}
                </span>
              </p>
            )}
            <h4>
              <span>{getTermInLanguage(translations, 'valinnaiset')}</span>
            </h4>
            {optionalTasks.length > 0 ? (
              optionalTasks.map((task) => {
                return getTask(task)
              })
            ) : (
              <p>
                <span>
                  {getTermInLanguage(
                    translations,
                    'ei-valinnaisia-aktiviteetteja'
                  )}
                </span>
              </p>
            )}
          </>
        ) : (
          <></>
        )}
      </TaskList>
    </StyledDetailPage>
  )
}

export default TaskGroup
