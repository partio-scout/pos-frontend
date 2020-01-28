import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { getAgeGroupTitleWithoutAges, getTermInLanguage } from 'helpers'
import ageGroupGraphics from 'graphics/ageGroups'

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
    margin-bottom: 1rem;
  }
`

const AgeGroupIllustration = styled.img`
  width: 100%;
`
const Status = styled.div`
  font-size: 0.875rem;
`

const AgeGroupItem = ({ ageGroup, language, status, translations }) => {
  const languageInfo = ageGroup.languages.find(x => x.lang === language)
  return (
    <StyledAgeGroupItem>
      <AgeGroupLink to={`/guid/${ageGroup.guid}?lang=${language}`}>
        <AgeGroupIllustration
          alt={ageGroup.title}
          src={
            ageGroupGraphics[`AgeGroup${ageGroup.guid}`] ||
            ageGroupGraphics.AgeGroupDefault
          }
        />
        <h3 data-testid="title">
          {getAgeGroupTitleWithoutAges(
            languageInfo ? languageInfo.title : ageGroup.title
          )}
        </h3>
        {status && (
          <>
            <Status>
              {`${getTermInLanguage(
                translations,
                'mandatory_plural',
                language
              )} ${status.mandatory}`}
            </Status>
            <Status>{`${getTermInLanguage(
              translations,
              'optional_plural',
              language
            )} ${status.optional}`}</Status>
          </>
        )}
      </AgeGroupLink>
    </StyledAgeGroupItem>
  )
}

export default AgeGroupItem
