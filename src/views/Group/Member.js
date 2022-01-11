import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import ListItem from '../../components/ListItem'
import { COMPLETION_STATUS } from '../../consts'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'

const Member = ({ member }) => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const translations = useSelector((state) => state.translations)
  const { groupId } = useParams()
  const tasks = Object.keys(member.memberTasks).filter(
    (guid) =>
      member.memberTasks[guid] === COMPLETION_STATUS.COMPLETION_REQUESTED ||
      member.memberTasks[guid] === COMPLETION_STATUS.ACTIVE
  )
  const subTitle =
    tasks.length +
    ' ' +
    getTermInLanguage(translations, 'aktiviteetti') +
    ' ' +
    getTermInLanguage(translations, 'tyon-alla')
  const memberId = member.memberId
  return (
    <ListItem
      onClick={() =>
        history.push(`/group/${groupId}/member/${memberId}/?lang=${language}`)
      }
      circleIcon={true}
      key={member.memberId}
      title={member.memberName}
      subTitle={subTitle}
    />
  )
}

export default Member
