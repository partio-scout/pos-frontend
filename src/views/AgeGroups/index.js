import React, { useLayoutEffect, useRef, useState, useCallback } from 'react'
import styled, { withTheme } from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedLanguage } from 'redux/actionCreators'
import { Link } from 'react-router-dom'
import { determineLanguageFromUrl } from 'helpers'
import AgeGroupItem from 'components/AgeGroupItem'
import Menu from 'components/Menu'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: all;
  overflow: scroll;
  scroll-snap-type: x mandatory;
  background-color: ${({ activeIndex = 0, theme }) =>
    theme.color.ageGroupGradients[activeIndex] ||
    theme.color.ageGroupGradients.default};
  transition: background-color 400ms;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${({ activeIndex = 0, theme }) =>
      `linear-gradient(
      to bottom,
      ${
        theme.color.ageGroupGradientsDark[activeIndex] ||
        theme.color.ageGroupGradientsDark.default
      },
      rgba(0, 0, 0, 0)
    );`};
  }
`

const Content = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  position: absolute;
  top: 0;
  left: 0;
`

const Languages = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: all;

  > a {
    padding: 0 5px;
    text-decoration: none;
    color: ${({ theme }) => theme.color.text};
    text-transform: uppercase;
  }
`

const AgeGroups = ({ theme }) => {
  window.addEventListener('scroll', () =>
    console.log('WINDOW SCROLL --- WHOOP WHOOP')
  )
  const ageGroups = useSelector((state) => state.ageGroups)
  const selectedAgeGroup = useSelector((state) => state.selectedAgeGroup)
  const user = useSelector((state) => state.user)
  const userTasks = useSelector((state) => state.tasks)
  const [activeIndex, setActiveIndex] = useState(0)
  const language = determineLanguageFromUrl(window.location)
  const generalTranslations = useSelector((state) => state.translations.yleiset)
  const languages = ['fi', 'sv', 'en', 'smn']
  const dispatch = useDispatch()

  const itemsByGuid = useSelector((state) => state.itemsByGuid)

  const contentRef = useRef()
  const containerRef = useRef()

  const getAgeGroupCenterPositions = useCallback(
    (content) =>
      [...content.children].map(
        (child) => child.clientWidth / 2 + child.offsetLeft
      ),
    []
  )

  const setSelectedLanguagetoState = (language) => {
    dispatch(setSelectedLanguage(language))
  }

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current

    if (!container || !content || !selectedAgeGroup) {
      return
    }

    const ageGroupCenterPositions = getAgeGroupCenterPositions(content)
    container.scrollLeft =
      ageGroupCenterPositions[
        ageGroupCenterPositions.indexOf(selectedAgeGroup)
      ] -
      document.body.clientWidth / 2
  }, [contentRef, containerRef, selectedAgeGroup, getAgeGroupCenterPositions])

  useLayoutEffect(() => {
    const container = containerRef.current
    const content = contentRef.current

    if (!container || !content) {
      return
    }

    const scrollHandler = () => {
      const ageGroupCenterPositions = getAgeGroupCenterPositions(content)
      const xPosition = container.scrollLeft
      const nextActiveIndex = ageGroupCenterPositions.indexOf(
        ageGroupCenterPositions.find((x) => x >= xPosition)
      )
      setActiveIndex(nextActiveIndex < 0 ? 0 : nextActiveIndex)
    }

    scrollHandler()
    container.addEventListener('scroll', scrollHandler)
    return () => {
      container.removeEventListener('scroll', scrollHandler)
    }
  }, [
    contentRef,
    containerRef,
    theme,
    setActiveIndex,
    getAgeGroupCenterPositions,
  ])

  //TODO: get agegroup from user if set
  const activeAgeGroup = ageGroups
    .sort((a, b) => a.minimum_age - b.minimum_age)
    .find((ageGroup) => ageGroups.indexOf(ageGroup) === activeIndex)

  const activeAgeGroupGuid = activeAgeGroup ? activeAgeGroup.wp_guid : ''

  if (itemsByGuid.length === 0 || !generalTranslations) return null

  return (
    <Container ref={containerRef} activeIndex={activeAgeGroupGuid}>
      <Menu language={language} user={user} />
      <Content ref={contentRef}>
        {ageGroups
          .filter((ageGroup) => ageGroup.activity_groups.length)
          .sort((a, b) => a.minimum_age - b.minimum_age)
          .map((ageGroup, i) => {
            return (
              <AgeGroupItem
                key={i}
                ageGroup={ageGroup}
                itemsByGuid={itemsByGuid}
                language={language}
                user={user}
                userTasks={userTasks}
                translations={generalTranslations}
                localizedAgeGroups={ageGroups}
              />
            )
          })}
      </Content>
      <Languages onClick={setSelectedLanguagetoState(language)}>
        {languages.map((language, i) => (
          <Link key={i} to={`/?lang=${language}`}>
            {language}
          </Link>
        ))}
      </Languages>
    </Container>
  )
}

export default withTheme(AgeGroups)
