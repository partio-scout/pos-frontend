import React from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { X } from 'react-feather'
import ListItem from 'components/ListItem'
import { ITEM_TYPES } from 'consts'

const StyledManage = styled.div`
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

const Manage = () => {
  const history = useHistory()
  return (
    <StyledManage>
      <Header>
        <Subheading>Hallinta</Subheading>
        <CloseIcon onClick={() => history.push('/')} />
      </Header>
      <Content>
        <Subheading>Ilmoitukset</Subheading>
        <ListItem
          ageGroupIndex={0}
          title="Viittaveljet / Sudenpennut 2"
          subTitle="Jäsen 1 liittyi"
          language="fi"
          icon={null}
          itemType={ITEM_TYPES.TASK}
          showActions
        />
      </Content>
    </StyledManage>
  )
}

export default Manage
