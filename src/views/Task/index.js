import React, { useEffect, useState, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DetailPage from 'components/DetailPage'
import Actions from 'components/Actions'
import { fetchTaskDetails } from 'api'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;

  a {
    color: ${({ theme }) => theme.color.text};
  }

  > div,
  h5 {
    margin: 0.6rem 0;
    white-space: pre-line;
  }

  > div {
    animation: ${keyframes`
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    `} 200ms linear;
  }
`

const StyledDetailPage = styled(DetailPage)`
  display: grid;
  grid-template-rows: auto auto 1fr;
`

const SubHeading = styled.h5`
  margin: 0;
  opacity: 0.5;
  animation: ${keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 0.5;
    }
  `} 200ms linear;
`

const StyledActions = styled(Actions)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`

const Task = () => {
  const { guid } = useParams()
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const task = useSelector(state => state.itemsByGuid[guid])
  const generalTranslations = useSelector(state => state.translations.yleiset)
  const [details, setDetails] = useState()
  const [suggestions, setSuggestions] = useState()

  const getSuggestionDetails = useCallback(
    async d => {
      const suggestionsInLanguage = d.suggestions_details.find(
        s => s.lang === language
      )
      if (suggestionsInLanguage) {
        const res = await fetch(suggestionsInLanguage.details)
        const data = await res.json()
        setSuggestions(data.items)
      }
    },
    [language]
  )

  const getTaskDetails = useCallback(async () => {
    const res = await fetchTaskDetails(task.item.guid, language)
    setDetails(res)
    getSuggestionDetails(res)
  }, [task, language, getSuggestionDetails])

  useEffect(() => {
    getTaskDetails()
  }, [getTaskDetails])

  const translations = task.item.languages.find(x => x.lang === language)

  const renderDetails = () => {
    if (!details || !generalTranslations) return null
    const { ingress, content } = details
    return (
      <DetailsContainer>
        {content && (
          <div dangerouslySetInnerHTML={{ __html: details.content }} />
        )}
        {ingress && (
          <>
            <SubHeading>
              {getTermInLanguage(generalTranslations, 'task_target', language)}
            </SubHeading>
            <div dangerouslySetInnerHTML={{ __html: details.ingress }} />
          </>
        )}
        {suggestions && (
          <>
            <SubHeading>
              {getTermInLanguage(generalTranslations, 'tips', language)}
            </SubHeading>
            {suggestions.map(suggestion => (
              <div
                key={suggestion.guid}
                dangerouslySetInnerHTML={{ __html: suggestion.content }}
              />
            ))}
          </>
        )}
      </DetailsContainer>
    )
  }

  if (!task) return null
  return (
    <StyledDetailPage
      onBackClick={() =>
        history.push(`/guid/${task.parentGuid}?lang=${language}`)
      }
      title={translations ? translations.title : task.item.title}
    >
      <StyledActions
        guid={task.guid}
        itemType={task.type}
        isFavourite={task.isFavourite}
      />
      {renderDetails()}
    </StyledDetailPage>
  )
}

export default Task
