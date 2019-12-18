import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { getAgeGroupTitleWithoutAges } from 'helpers'

const StyledAgeGroupItem = styled.div`
  width: 50vw;
  padding: 3rem 8vw 0;
  flex: 0 0 auto;
  scroll-snap-align: center;

  > a {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.color.text};
    text-decoration: none;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  }

  :first-child {
    padding-left: 25vw;
  }

  :last-child {
    padding-right: 25vw;
  }
`

const AgeGroupLink = styled(Link)`
  > h3 {
    padding-top: 3rem;
    font-size: 24px;
    font-weight: normal;
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
    <StyledAgeGroupItem>
      <AgeGroupLink to={`/guid/${ageGroup.guid}?lang=${language}`}>
        <AgeGroupIllustration />
        <h3 data-testid="title">
          {getAgeGroupTitleWithoutAges(
            languageInfo ? languageInfo.title : ageGroup.title
          )}
        </h3>
      </AgeGroupLink>
    </StyledAgeGroupItem>
  )
}

export default AgeGroupItem
