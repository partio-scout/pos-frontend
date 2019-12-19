import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import TaskIcon from 'assets/tasks/task.svg'

const StyledListItem = styled(Link)`
  position: relative;
  min-height: 2rem;
  padding-left: 3.5rem;
  padding-bottom: 1rem;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  user-select: none;
  text-decoration: none;

  > * {
    line-height: 1.3;
    color: ${({ theme }) => theme.color.text};
  }

  > :first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  > :nth-child(2) {
    opacity: 0.65;
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

const ListItem = ({
  guid,
  ageGroupIndex,
  title,
  language,
  children,
  icon = TaskIcon,
}) => {
  return (
    <StyledListItem
      data-testid="link"
      agegroupindex={ageGroupIndex}
      to={`/guid/${guid}?lang=${language}`}
      icon={icon}
    >
      <span data-testid="title">{title}</span>
      {children}
    </StyledListItem>
  )
}

export default ListItem
