import React from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailPage from 'components/DetailPage'
import { determineLanguageFromUrl } from 'helpers'

const Task = () => {
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)

  const task = useSelector(state => state.itemsByGuid[guid])
  console.log(task)

  if (!task) return null
  return (
    <DetailPage
      onBackClick={() => history.push(`/guid/${task.parentGuid}`)}
      title={task.item.title}
    ></DetailPage>
  )
}

export default Task
