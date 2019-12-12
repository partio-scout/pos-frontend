import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { X } from 'react-feather'
import TaskGroupItem from 'components/TaskGroupItem'
import { setSelectedAgeGroup } from 'redux/actionCreators'
import { getAgeGroupTitleWithoutAges, determineLanguageFromUrl } from 'helpers'

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.color.gradientDark};
  pointer-events: all;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 19rem;
    background: ${({ theme, ageGroupIndex }) => `
    linear-gradient(
      to bottom,
      ${theme.color.ageGroups[ageGroupIndex]},
      ${theme.color.gradientDark}
    );
    `};
  }
`

// TODO take icon from feather icons and remove px width & height
const CloseIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  display: grid;
  grid-template-rows: 19rem minmax(0, 1fr);
  overflow: hidden;
`

const HeadingContent = styled.div`
  padding-top: 7rem;
  margin: 0 auto;
  text-align: center;

  > h3 {
    font-size: 24px;
  }
`

const BodyContent = styled.div`
  box-sizing: border-box;
  height: 100%;
  padding: 1rem;
  padding-bottom: 2rem;
  overflow: scroll;

  > :first-child {
    padding-bottom: 1rem;
    text-align: center;
    font-size: 18px;
  }
`

const MainSymbol = styled.div`
  width: 8rem;
  height: 8rem;
  margin: 0 auto;
  border-radius: 50%;
  background-color: #f5f5f5;
`

const AgeGroup = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const itemsByGuid = useSelector(state => state.itemsByGuid)

  const { guid } = useParams()
  const language = determineLanguageFromUrl(window.location)

  const ageGroup = itemsByGuid.hasOwnProperty(guid)
    ? itemsByGuid[guid].item
    : undefined

  useEffect(() => {
    if (ageGroup) {
      dispatch(setSelectedAgeGroup(ageGroup))
    }
  }, [ageGroup, dispatch])

  if (!ageGroup) {
    return null
  }

  const ageGroupIndex = ageGroup ? ageGroup.order : 0

  return (
    <Background ageGroupIndex={ageGroupIndex}>
      <Content>
        <CloseIcon>
          <X onClick={() => history.push('/')} />
        </CloseIcon>
        <HeadingContent>
          <MainSymbol />
          <h3>{getAgeGroupTitleWithoutAges(ageGroup.title)}</h3>
        </HeadingContent>
        <BodyContent>
          <p>Ilmansuunnat</p>
          {ageGroup.taskgroups.length > 0 &&
            ageGroup.taskgroups
              .sort((a, b) => a.order - b.order)
              .map(taskGroup => (
                <TaskGroupItem
                  key={taskGroup.guid}
                  taskGroup={taskGroup}
                  ageGroupIndex={ageGroupIndex}
                  language={language}
                />
              ))}
        </BodyContent>
      </Content>
    </Background>
  )
}

export default AgeGroup
