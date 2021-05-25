export type ThemeType = typeof theme['light']

const theme = {
  light: {
    background: '#0A162B',
    secondary: '#1E2328',
    secondaryDark: '#0d0d0d',
    primaryText: 'black',
    contrastBackground: '#cc3399',
    contrastText: '#EAEAEA',
    inputBackground: '#010A13',
    inputBorder: '#3E3501',
  },
  dark: {
    background: '#0A162B',
    secondary: '#1E2328',
    secondaryDark: '#0d0d0d',
    primaryText: 'white',
    contrastBackground: '#EAEAEA',
    contrastText: '#181A1B',
    inputBackground: '#010A13',
    inputBorder: '#3E3501',
  },
}

export const commonColors = {
  red: '#C6493A',
}
export default theme
