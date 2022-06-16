import React from 'react'
import styled, { keyframes } from 'styled-components'

const Loader = styled.div`
  border: 5px solid #f3f3f3;
  border-top: 5px solid #545454;
  border-radius: 50%;
  width: 40px;
  height: 40px;

  animation: ${keyframes`
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  `} 1s linear infinite;
`

const Spinner = () => <Loader />

export default Spinner
