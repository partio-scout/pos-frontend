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
const CompletionBadgeNotification = ({ notification, markRead }) => {
  const translations = useSelector((state) => state.translations)
  const itemsByGuid = useSelector((state) => state.itemsByGuid)

  const agegroup = itemsByGuid[notification.item_guid]

  if (agegroup === undefined) {
    return null
  }

  const timestamp = getTimestamp(notification.created_at)

  const getStateMessage = (state) => {
    switch (state) {
      case 'COMPLETED':
        return getTermInLanguage(translations, 'antanut')
      default:
        return getTermInLanguage(translations, 'antanut')
    }
  }
  console.log(notification)

  return (
    <Container>
      <Message>
        <span>
          {getTermInLanguage(translations, 'ryhmanjohtaja')}{' '}
          {notification.group_leader_name}{' '}
          {getTermInLanguage(translations, 'on')}{' '}
          {getStateMessage(notification.notification_type)}{' '}
          {getTermInLanguage(translations, 'paatosmerkin')}{' '}
          {getTermInLanguage(translations, 'ikaryhmalle')}{' '}
        </span>
        <StyledLink to={getTaskUrl(agegroup.item)} onClick={markRead}>
          {agegroup.item.title}
        </StyledLink>
      </Message>
      <Timestamp>{timestamp}</Timestamp>
    </Container>
  )
}

export default CompletionBadgeNotification
