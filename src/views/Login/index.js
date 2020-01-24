import React from 'react'
import styled from 'styled-components'
import { useHistory, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { X } from 'react-feather'
import { determineLanguageFromUrl, getTermInLanguage } from 'helpers'
import { API_URL } from '../../api'
import loginBg from '../../assets/images/login-bg.jpg'
import logo from '../../assets/images/logo.svg'

const Background = styled.div`
  min-height: 100vh;
  width: 100vw;
  background-color: ${({ theme }) => theme.color.gradientDark};
  pointer-events: all;
  background-image: url(${loginBg});
  background-position: center;
  ::before {
    content: ' ';
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 19rem;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 1),
      80%,
      rgba(0, 0, 0, 0)
    );
  }
`

const CloseIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`

const Content = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  overflow: hidden;
`

const HeadingContent = styled.div`
  padding-top: 7rem;
  margin: 0 auto;
  text-align: center;

  > h3 {
    font-size: 24px;
    font-weight: normal;
  }
`

const BodyContent = styled.div`
  box-sizing: border-box;
  padding: 1rem;
  padding-bottom: 2rem;
  width: 100%;
  text-align: center;
  position: fixed;
  left: 0;
  bottom: 0;

  > h4 {
    font-weight: normal;
    text-transform: capitalize;
    padding-bottom: 1rem;
    text-align: center;
    font-size: 18px;
  }
  a {
    color: white;
  }
`
const Logo = styled.img`
  width: 8rem;
`
const Languages = styled.div`
  padding-top: 2rem;
  pointer-events: all;

  > a {
    padding: 0 5px;
    text-decoration: none;
    color: ${({ theme }) => theme.color.text};
    text-transform: uppercase;
  }
`

const Login = () => {
  const history = useHistory()
  const language = determineLanguageFromUrl(window.location)
  const languages = ['fi', 'sv', 'en', 'smn']
  const generalTranslations = useSelector(state => state.translations.yleiset)

  if (!generalTranslations) return null

  return (
    <Background>
      <Content>
        <CloseIcon>
          <X onClick={() => history.goBack()} />
        </CloseIcon>
        <HeadingContent>
          <Logo alt="kompassi-logo" src={logo} />
        </HeadingContent>
        <BodyContent>
          <p>
            {getTermInLanguage(
              generalTranslations,
              'welcome_message',
              language
            )}
          </p>

          <a href={`${API_URL}/login`}>
            {getTermInLanguage(generalTranslations, 'login', language)}
          </a>

          <Languages>
            {languages.map((language, i) => (
              <Link key={i} to={`?lang=${language}`}>
                {language}
              </Link>
            ))}
          </Languages>
        </BodyContent>
      </Content>
    </Background>
  )
}

export default Login
