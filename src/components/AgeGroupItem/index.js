import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { getAgeGroupTitleWithoutAges } from 'helpers'
import SudenpennutOn from 'assets/sudenpennut/sudenpennut_on.svg'
import SeikkailijatOn from 'assets/seikkailijat/seikkailijat_on.svg'
import TarpojatOn from 'assets/tarpojat/tarpojat_on.svg'
import SamoajatOn from 'assets/samoajat/samoajat_on.svg'
import VaeltajatOn from 'assets/vaeltajat/vaeltajat_on.svg'

const images = {
  SudenpennutOn,
  SeikkailijatOn,
  TarpojatOn,
  SamoajatOn,
  VaeltajatOn,
}

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

const AgeGroupIllustration = styled.img`
  width: 100%;
`

const AgeGroupItem = ({ ageGroup, language }) => {
  const title = getAgeGroupTitleWithoutAges(ageGroup.title)
  const languageInfo = ageGroup.languages.find(x => x.lang === language)
  return (
    <StyledAgeGroupItem>
      <AgeGroupLink to={`/guid/${ageGroup.guid}?lang=${language}`}>
        <AgeGroupIllustration src={images[`${title}On`]} />
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
