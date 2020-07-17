import React from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { X } from 'react-feather'
import { determineLanguageFromUrl, getTermInLanguage } from '../../helpers'
import { useHistory, useParams } from 'react-router-dom'
import ListItem from '../../components/ListItem'

const StyledGroup = styled.div`
  height: 100%;
  background-color: ${({ theme }) => theme.color.background};
  pointer-events: all;
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

const Group = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const { groupId } = useParams()

  if (!generalTranslations || !groupsData) return null

  console.log('Group date', groupsData)
  console.log('Group id', groupId)
  const group = groupsData.find(
    groups => groups.id.toString() === groupId.toString()
  )
  const members = group.members

  return (
    <StyledGroup>
      <Header>
        <Subheading>{group.name}</Subheading>
        <CloseIcon onClick={() => history.push('/manage')} />
      </Header>
      <Content>
        {members.map(member => (
          <ListItem
            key={member.memberId}
            title={member.memberName}
            subTitle="something"
          />
        ))}
      </Content>
    </StyledGroup>
  )
}

export default Group
