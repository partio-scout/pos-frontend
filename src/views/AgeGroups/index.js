import React, { useEffect, useRef } from 'react'
import styled, { withTheme } from 'styled-components'
import { useSelector } from 'react-redux'
import { determineLanguageFromUrl } from 'utils'
import AgeGroup from 'components/AgeGroup'

const Container = styled.div`
  position: relative;
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
`

const AgeGroups = ({ theme }) => {
  const ageGroups = useSelector(state => state.ageGroups)
  const language = determineLanguageFromUrl(window.location)

  const contentRef = useRef()
  const containerRef = useRef()

  useEffect(() => {
    const container = containerRef.current
    const content = contentRef.current
    if (container && content) {
      const scrollHandler = () => {
        const ageGroupCenterPositions = [...content.children].map(
          child => child.clientWidth / 2 + child.offsetLeft
        )
        const xPosition = content.getBoundingClientRect().x
        const scrolledToIndex = ageGroupCenterPositions.indexOf(
          ageGroupCenterPositions.find(x => x > -xPosition)
        )
        container.style.backgroundColor = theme.color.ageGroups[scrolledToIndex]
      }
      container.addEventListener('scroll', scrollHandler)
      return () => {
        container.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [contentRef, containerRef, theme])

  return (
    <Container ref={containerRef}>
      <Content ref={contentRef}>
        {ageGroups.map((ageGroup, i) => (
          <AgeGroup key={i} ageGroup={ageGroup} language={language} />
        ))}
      </Content>
    </Container>
  )
}

export default withTheme(AgeGroups)
