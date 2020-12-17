import React from 'react'
import styled, { keyframes } from 'styled-components'
import { useHistory } from 'react-router-dom'
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion'
import { X } from 'react-feather'
import ListItem from 'components/ListItem'
import { ITEM_TYPES } from 'consts'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import { StyledAcceptIcon } from '../../components/TaskActionsIcons'

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

const AcceptTasksAction = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4rem;
  z-index: 1;
  animation: ${keyframes`
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  `} 200ms linear;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: center;

  > span {
    padding: 1rem;
  }

  :last-child {
    justify-content: center;

    > span {
      padding-top: 2rem;
    }
  }
`

const StyledListItem = styled.div`
  min-height: 2rem;
  padding-left: 3.5rem;
  padding-right: 3.5rem;
  padding-bottom: 1rem;
  text-decoration: none;
  }
`
const initialList = []

const AcceptTasks = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const groupsData = useSelector(state => state.user.userGroups)
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const [list, setList] = React.useState(initialList)
  if (!generalTranslations || !groupsData) return null

  function handleChange(event) {
    const editableList = list.slice(0)
    if (list.includes(event.target.value)) {
      const index = list.findIndex(id => id === event.target.value)
      editableList.splice(index, 1)
    } else {
      editableList.push(event.target.value)
    }
    setList(editableList)
  }

  function handleAdd() {}

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
              <Accordion allowZeroExpanded>
                <AccordionItem key={ageGroupId}>
                  <AccordionItemHeading>
                    <AccordionItemButton>
                      <ListItem
                        key={ageGroupId}
                        ageGroupGuid={ageGroupId}
                        title={title}
                        language="fi"
                        icon={null}
                        itemType={ITEM_TYPES.TASK}
                      />
                    </AccordionItemButton>
                  </AccordionItemHeading>
                  <AccordionItemPanel>
                    <Content>
                      {group.members.map(member => {
                        return (
                          <StyledListItem key={member.memberId}>
                            <label
                              style={{ float: 'left', margin: 0 }}
                              htmlFor={member.memberId}
                            >
                              {member.memberName}
                            </label>
                            <input
                              style={{
                                float: 'right',
                                margin: 0,
                                width: '1.3rem',
                                height: '1.3rem',
                              }}
                              type="checkbox"
                              value={member.memberId}
                              onChange={handleChange}
                            />
                          </StyledListItem>
                        )
                      })}
                    </Content>
                  </AccordionItemPanel>
                </AccordionItem>
              </Accordion>
            </>
          )
        })}
      </Content>
      <AcceptTasksAction>
        <ActivityItem>
          <StyledAcceptIcon onClick={handleAdd} />
          Lisää valituille
        </ActivityItem>
      </AcceptTasksAction>
    </StyledAcceptTasks>
  )
}

export default AcceptTasks
