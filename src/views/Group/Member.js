import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import ListItem from '../../components/ListItem'
import { COMPLETION_STATUS } from '../../consts'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'

const GetMember = ({ member }) => {
    const history = useHistory()
    const language = determineLanguageFromUrl(window.location)
    const generalTranslations = useSelector(state => state.translations.yleiset)
    const { groupId } = useParams()
    const tasks = Object.keys(member.memberTasks).filter(
      guid =>
        member.memberTasks[guid] ===
          COMPLETION_STATUS.COMPLETION_REQUESTED ||
        member.memberTasks[guid] === COMPLETION_STATUS.ACTIVE
    )
    const subTitle =
      tasks.length +
      ' ' +
      getTermInLanguage(generalTranslations, 'activity', language) +
      ' ' +
      getTermInLanguage(generalTranslations, 'working_on_it', language)
    const memberId = member.memberId
    return (
      <ListItem
        onClick={() =>
          history.push(
            `/group/${groupId}/member/${memberId}/?lang=${language}`
          )
        }
        key={member.memberId}
        title={member.memberName}
        subTitle={subTitle}
      />
    )
  }

export default GetMember