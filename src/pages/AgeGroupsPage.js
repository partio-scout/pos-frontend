import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled.div`
  position: relative;
  height: 100%;
  pointer-events: all;
  overflow: scroll;
  scroll-snap-type: x mandatory;
  background-color: #dbc65e;
  transition: background-color 400ms;

  ::before {
    content: ' ';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 40%;
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

const AgeGroupSection = styled(Link)`
  width: 50vw;
  padding: 0 5vw;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;

  :first-child {
    padding-left: 25vw;
  }

  :last-child {
    padding-right: 25vw;
  }
`

const AgeGroupIllustration = styled.div`
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  background-color: #f5f5f5;
`

const AgeGroupsPage = () => {
  const contentRef = useRef()
  const containerRef = useRef()

  const backgroundColors = [
    '#dbc65e',
    '#45a4cc',
    '#a079db',
    '#6dc288',
    '#d6b160',
  ]

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
        container.style.backgroundColor = backgroundColors[scrolledToIndex]
      }

      container.addEventListener('scroll', scrollHandler)
      return () => {
        container.removeEventListener('scroll', scrollHandler)
      }
    }
  }, [contentRef, containerRef, backgroundColors])

  const ageGroups = [
    'Sudenpennut',
    'Seikkailijat',
    'Tarpojat',
    'Samoajat',
    'Vaeltajat',
  ]

  return (
    <Container ref={containerRef}>
      <Content ref={contentRef}>
        {ageGroups.map((ageGroup, i) => (
          <AgeGroupSection key={i} to={ageGroup}>
            <AgeGroupIllustration />
            {ageGroup}
          </AgeGroupSection>
        ))}
      </Content>
    </Container>
  )
}

export default AgeGroupsPage
