import { createGlobalStyle, css } from 'styled-components'

export default createGlobalStyle`
${({ theme }) => css`
  html {
    height: 100%;
    body {
      display: flex;
      flex-direction: column;
      height: 100%;
      margin: 0;
      background: ${theme.background};
      color: ${theme.primaryText};
      font-family: Newsreader;
    }
  }
`}
`
