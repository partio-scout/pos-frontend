import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router-dom'
import TaskIcon from 'assets/tasks/task.svg'
import Actions from 'components/Actions'
import { Heart } from 'react-feather'

const StyledListItem = styled.div`
  position: relative;
  min-height: 2rem;
  padding-left: 3.5rem;
  padding-bottom: 1rem;
  cursor: pointer;
  user-select: none;
  text-decoration: none;

  > * {
    line-height: 1.3;
    color: ${({ theme }) => theme.color.text};
  }

  ::before {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: ${({ theme, agegroupindex }) =>
      theme.color.ageGroups[agegroupindex]};
    background-size: contain;

    ${({ icon }) =>
      icon &&
      css`
        background-image: url(${icon});
      `};
  }
`
const StyledListItemContent = styled.div`
  display: flex;
  flex-direction: column;
  > :first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-right: 4rem;
  }

  > span:nth-child(2) {
    color: ${({ theme }) => theme.color.subText};
  }
`
const StyledActions = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0;
  color: ${({ theme }) => theme.color.subText};
`

const StyledFavouriteIcon = styled(Heart)`
  margin-right: 0.5em;
`

const ListItem = ({
  guid,
  ageGroupIndex,
  title,
  subTitle,
  language,
  showActions,
  itemType,
  icon = TaskIcon,
  showFavourite,
}) => {
  const history = useHistory()
  return (
    <StyledListItem agegroupindex={ageGroupIndex} icon={icon}>
      <StyledListItemContent
        data-testid="link"
        onClick={() =>
          guid && language && history.push(`/guid/${guid}?lang=${language}`)
        }
      >
        <span data-testid="title">{title}</span>
        {subTitle && <span>{subTitle}</span>}
      </StyledListItemContent>

      <StyledActions guid="test">
        {showFavourite && <StyledFavouriteIcon color="red" fill="red" />}
        {showActions && itemType && <Actions guid={guid} itemType={itemType} />}
      </StyledActions>
    </StyledListItem>
  )
}

export default ListItem
