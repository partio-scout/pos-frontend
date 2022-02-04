import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  getAgeGroupTitleWithoutAges,
  getTermInLanguage,
  getAgeGroupStatus,
} from 'helpers'

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

const AgeGroupItem = ({
  ageGroup,
  language,
  user,
  translations,
  activityGroups,
  userTasks,
}) => {
  const status =
    user.loggedIn && activityGroups
      ? getAgeGroupStatus(ageGroup, userTasks, activityGroups)
      : null
  const icon = ageGroup.logo.url
  return (
    <StyledAgeGroupItem>
      <AgeGroupLink to={`/guid/${ageGroup.wp_guid}?lang=${language}`}>
        <AgeGroupIllustration alt={ageGroup.title} src={icon} />
        <h3 data-testid="title">
          {getAgeGroupTitleWithoutAges(ageGroup.title)}
        </h3>
        {status && (
          <>
            <Status>
              {`${getTermInLanguage(translations, 'pakolliset')} ${
                status.mandatory
              }`}
            </Status>
            <Status>
              {`${getTermInLanguage(translations, 'valinnaiset')} ${
                status.optional
              }`}
            </Status>
          </>
        )}
      </AgeGroupLink>
    </StyledAgeGroupItem>
  )
}

export default AgeGroupItem
