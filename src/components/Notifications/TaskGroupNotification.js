import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux'
import { getTimestamp, getTaskUrl } from './utils'
import { getTermInLanguage } from 'helpers'

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const Message = styled.div``

const Timestamp = styled.div`
  font-size: 0.5rem;
`
const StyledLink = styled(Link)`
  color: #c9bf32;
  :visited {
    color: #c86418;
  }
`
const TaskGroupNotification = ({ notification, markRead }) => {
  const translations = useSelector((state) => state.translations)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)
  const activityGroups = useSelector((state) => state.activityGroups)

  /* Below: Migrated activitygroup accomplishments comes with item id instead of wp_guid.
   * ItemsByGuid keys are wp_guids, so if activitygroup won't be found from
   * itemsByGuid -list, they need to be found from activitygroups-list (which contains slightly differend data)
   */

  const taskGroup =
    itemsByGuid[notification.item_guid] ||
    activityGroups[notification.item_guid]

  if (taskGroup === undefined) {
    return null
  }

  const taskGroupItem = taskGroup.item ? taskGroup.item : taskGroup
  const timestamp = getTimestamp(notification.created_at)

  const getStateMessage = (state) => {
    switch (state) {
      case 'ACCEPTED':
        return getTermInLanguage(translations, 'hyvaksynyt')
      case 'DELETED':
        return 'poistanut'
      default:
        return getTermInLanguage(translations, 'hyvaksynyt')
    }
  }

  return (
    <Container>
      <Message>
        <span>
          {getTermInLanguage(translations, 'ryhmanjohtaja')}{' '}
          {notification.group_leader_name}{' '}
          {getTermInLanguage(translations, 'on')}{' '}
          {getStateMessage(notification.notification_type)}{' '}
          {getTermInLanguage(translations, 'tehtavakokonaisuuden-suoritetuksi')}{' '}
        </span>
        <StyledLink to={getTaskUrl(taskGroupItem)} onClick={markRead}>
          {taskGroupItem.title}
        </StyledLink>
      </Message>
      <Timestamp>{timestamp}</Timestamp>
    </Container>
  )
}

export default TaskGroupNotification
