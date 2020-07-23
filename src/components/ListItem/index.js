import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router-dom'
import TaskIcon from 'assets/tasks/task.svg'
import Actions from 'components/Actions'
import FavouriteIcon from 'components/TaskActionsIcons'

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
    background-color: ${({ theme, ageGroupGuid }) =>
      theme.color.ageGroups[ageGroupGuid] || theme.color.ageGroups.default};
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

const ListItem = ({
  guid,
  ageGroupGuid,
  title,
  subTitle,
  language,
  showActions,
  actionsComponent,
  itemType,
  icon = TaskIcon,
  showFavourite,
  isFavourite,
  onClick,
  userGuid,
  groupGuid,
}) => {
  const history = useHistory()

  return (
    <StyledListItem ageGroupGuid={ageGroupGuid} icon={icon} onClick={onClick}>
      <StyledListItemContent
        data-testid="link"
        onClick={() =>
          guid && language && history.push(`/guid/${guid}?lang=${language}`)
        }
      >
        <span data-testid="title">{title}</span>
        {subTitle && <span>{subTitle}</span>}
      </StyledListItemContent>

      <StyledActions>
        {showFavourite && <FavouriteIcon filled={isFavourite} />}
        {showActions && itemType && (
          <Actions
            guid={guid}
            itemType={itemType}
            isFavourite={isFavourite}
            actionsComponent={actionsComponent}
            userGuid={userGuid}
            groupGuid={groupGuid}
          />
        )}
      </StyledActions>
    </StyledListItem>
  )
}

export default ListItem
