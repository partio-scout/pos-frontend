import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-wrap: nowrap;
  overflow: scroll;
  scroll-snap-type: x mandatory;
  pointer-events: all;
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
  const ageGroups = [
    'Sudenpennut',
    'Seikkailijat',
    'Tarpojat',
    'Samoajat',
    'Vaeltajat',
  ]
  return (
    <Container>
      {ageGroups.map((ageGroup, i) => (
        <AgeGroupSection key={i} to={ageGroup}>
          <AgeGroupIllustration />
          {ageGroup}
        </AgeGroupSection>
      ))}
    </Container>
  )
}

export default AgeGroupsPage
