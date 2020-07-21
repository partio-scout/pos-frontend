import styled from 'styled-components'
import { Heart, Activity, CheckCircle, Edit3, Trash } from 'react-feather'
import React from 'react'

const StyledFavouriteIcon = styled(Heart)`
  margin-right: 0.5em;
`
const StyleActiveIcon = styled(Activity)`
  margin-right: 0.5em;
`
const StyledCompletedIcon = styled(CheckCircle)`
  margin-right: 0.5em;
`
const StyledAcceptIcon = styled(Edit3)`
  margin-right: 0.5em;
`
const StyledDeleteIcon = styled(Trash)`
  margin-right: 0.5em;
`
export default function FavouriteIcon({ filled }) {
  return filled ? (
    <StyledFavouriteIcon color="#DB1930" fill="#DB1930" />
  ) : (
    <StyledFavouriteIcon />
  )
}

export {
  StyleActiveIcon,
  StyledCompletedIcon,
  StyledAcceptIcon,
  StyledDeleteIcon,
}
