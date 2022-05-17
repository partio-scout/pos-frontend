import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { ArrowLeft, Frown } from 'react-feather'
import { getTermInLanguage } from 'helpers'

const ErrorBoundaryContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  background-color: #f0f2f5;
`
const Container = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

const BackArrow = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  cursor: pointer;
`
const FallbackComponent = () => {
  const translations = useSelector((state) => state.translations)

  return (
    <ErrorBoundaryContainer>
      <Container>
        <Frown />
        <h4 data-testid="title">
          {getTermInLanguage(translations, 'virheviesti-otsikko')}
        </h4>
        <p>{getTermInLanguage(translations, 'virheviesti-teksti')}</p>
        <BackArrow
          onClick={() => (window.location = '/')}
          data-testid="back-arrow"
        >
          <ArrowLeft />
        </BackArrow>
      </Container>
    </ErrorBoundaryContainer>
  )
}

export default FallbackComponent
