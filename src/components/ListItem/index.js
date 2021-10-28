import React from 'react'
import styled, { css } from 'styled-components'
import { useHistory } from 'react-router-dom'
import Actions from 'components/Actions'
import FavouriteIcon from 'components/TaskActionsIcons'
import { MoreHorizontal, ChevronDown } from 'react-feather'
import { deleteFavouriteTask, postTaskFavourite } from '../../api'
import {
  addFavourite as addFavouriteTask,
  deleteFavourite,
} from '../../redux/actionCreators'
import { useDispatch, useSelector } from 'react-redux'

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
    background-size: contain;
    background-repeat: no-repeat;

    ${({ icon }) =>
      icon &&
      css`
        background-image: url(${icon});
      `};
    ${({ circleIcon }) =>
      circleIcon &&
      css`
        background-color: ${({ theme, ageGroupGuid }) =>
          theme.color.ageGroups[ageGroupGuid] || theme.color.ageGroups.default};
        border-radius: 50%;
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
  icon,
  circleIcon,
  showFavourite,
  isFavourite,
  onClick,
  userGuid,
  groupGuid,
  showActionsIcon,
  showDropDownIcon,
}) => {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  const isLoggedIn = user.loggedIn

  const toggleFavourite = () => {
    if (isFavourite) {
      removeFavourite()
    } else {
      addFavourite()
    }
  }

  const addFavourite = async () => {
    try {
      await postTaskFavourite({
        user_guid: 1,
        task_guid: guid,
      })
      dispatch(addFavouriteTask(guid))
    } catch (e) {
      //TODO: Do error handling
      console.log(e)
    }
  }

  const removeFavourite = async () => {
    try {
      await deleteFavouriteTask({
        user_guid: 1,
        task_guid: guid,
      })
    } catch (e) {
      console.log(e)
    }
    dispatch(deleteFavourite(guid))
  }

  return (
    <StyledListItem
      ageGroupGuid={ageGroupGuid}
      icon={icon}
      circleIcon={circleIcon}
      onClick={onClick}
    >
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
        {showFavourite && isLoggedIn && (
          <span onClick={() => toggleFavourite()}>
            <FavouriteIcon filled={isFavourite} />
          </span>
        )}
        {showActions &&
          isLoggedIn &&
          itemType &&
          (showDropDownIcon ? (
            <ChevronDown />
          ) : showActionsIcon ? (
            <MoreHorizontal />
          ) : (
            <Actions
              guid={guid}
              itemType={itemType}
              isFavourite={isFavourite}
              actionsComponent={actionsComponent}
              userGuid={userGuid}
              groupGuid={groupGuid}
              name={user.name}
            />
          ))}
      </StyledActions>
    </StyledListItem>
  )
}

export default ListItem
