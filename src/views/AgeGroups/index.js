import React, { useEffect, useRef } from 'react'
import styled, { withTheme } from 'styled-components'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { determineLanguageFromUrl } from 'helpers'
import AgeGroupItem from 'components/AgeGroupItem'

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: all;
  overflow: scroll;
  scroll-snap-type: x mandatory;
  background-color: ${({ theme }) => theme.color.ageGroups[0]};
  transition: background-color 400ms;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60%;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4),
      rgba(0, 0, 0, 0)
    );
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
  bottom: 20px;
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
  const ageGroups = useSelector(state => state.ageGroups)
  const selectedAgeGroup = useSelector(state => state.selectedAgeGroup)
  const language = determineLanguageFromUrl(window.location)
  const languages = ['fi', 'sv', 'en', 'smn']

  const contentRef = useRef()
  const containerRef = useRef()

  const getAgeGroupCenterPositions = () =>
    [...contentRef.current.children].map(
      child => child.clientWidth / 2 + child.offsetLeft
    )

  useEffect(() => {
    if (containerRef.current && contentRef.current && selectedAgeGroup) {
      const ageGroupCenterPositions = getAgeGroupCenterPositions()
      containerRef.current.scrollLeft =
        ageGroupCenterPositions[selectedAgeGroup.order] -
        document.body.clientWidth / 2
    }
  }, [contentRef, containerRef, selectedAgeGroup])

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current

    if (container && content) {
      const scrollHandler = () => {
        const ageGroupCenterPositions = getAgeGroupCenterPositions()
        const xPosition = container.scrollLeft
        const scrolledToIndex = ageGroupCenterPositions.indexOf(
          ageGroupCenterPositions.find(x => x >= xPosition)
        )
        container.style.backgroundColor = theme.color.ageGroups[scrolledToIndex]
      }

      scrollHandler()
      container.addEventListener('scroll', scrollHandler)
      return () => {
        container.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [contentRef, containerRef, theme])

  return (
    <Container ref={containerRef}>
      <Content ref={contentRef}>
        {ageGroups
          .sort((a, b) => a.order - b.order)
          .map((ageGroup, i) => (
            <AgeGroupItem key={i} ageGroup={ageGroup} language={language} />
          ))}
      </Content>
      <Languages>
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
