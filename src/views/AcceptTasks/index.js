import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { X } from 'react-feather'
import ListItem from 'components/ListItem'
import { ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'

const StyledAcceptTasks = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
  overflow: auto;
`

const Header = styled.div`
  box-sizing: border-box;
  width: 100%;
  padding: 1rem;
  padding-top: 1.5rem;
  text-align: center;
  background-color: #1a1a1a;
`

const Subheading = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: normal;
`

const CloseIcon = styled(X)`
  position: absolute;
  top: 1.45rem;
  right: 1rem;
`

const Content = styled.div`
  padding: 1rem;

  > ${Subheading} {
    margin-bottom: 1rem;
  }
`

const AcceptTasks = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  if (!generalTranslations || !groupsData) return null

  return (
    <StyledAcceptTasks>
      <Header>
        <Subheading>Lisää ryhmäläisille</Subheading>
        <CloseIcon onClick={() => history.push('/')} />
      </Header>
      <Content>
        <Subheading>
          {getTermInLanguage(generalTranslations, 'own_groups', language)}
        </Subheading>
        {groupsData.map(group => {
          const groupName = group.name
          const ageGroup = group.ageGroup
          const ageGroupId = group.id
          const title = '' + groupName + ' / ' + ageGroup
          return (
            <>
              <ListItem
                key={ageGroupId}
                ageGroupGuid={ageGroupId}
                title={title}
                language="fi"
                icon={null}
                itemType={ITEM_TYPES.TASK}
              />
              <Content>
                {group.members.map(member => {
                  return (
                    <ListItem key={member.memberId} title={member.memberName} />
                  )
                })}
              </Content>
            </>
          )
        })}
      </Content>
    </StyledAcceptTasks>
  )
}

export default AcceptTasks
