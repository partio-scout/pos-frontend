import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { getAgeGroupTitleWithoutAges } from 'helpers'

const Container = styled.div`
  display: flex;
  align-items: center;
`

const AgeGroupLink = styled(Link)`
  width: 50vw;
  margin-top: 3rem;
  padding: 0 8vw;
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  scroll-snap-align: center;
  color: ${({ theme }) => theme.color.text};
  text-decoration: none;

  > h3 {
    padding-top: 3rem;
    font-size: 24px;
    font-weight: normal;
  }

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
  border-radius: 50%;
  background-color: #f5f5f5;
`

const AgeGroupItem = ({ ageGroup, language }) => {
  const languageInfo = ageGroup.languages.find(x => x.lang === language)
  return (
    <Container>
      <AgeGroupLink to={`/guid/${ageGroup.guid}`}>
        <AgeGroupIllustration />
        <h3 data-testid="title">
          {getAgeGroupTitleWithoutAges(
            languageInfo ? languageInfo.title : ageGroup.title
          )}
        </h3>
      </AgeGroupLink>
    </Container>
  )
}

export default AgeGroupItem
