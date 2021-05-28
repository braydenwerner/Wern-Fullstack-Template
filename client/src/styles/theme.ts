export type ThemeType = typeof theme['light']

const theme = {
  light: {
    background: '#ACDDDE',
    secondary: '#CAF1DE',
    secondaryDark: '#E1F8DC',
    primaryText: 'black',
    subText: 'gray',
  },
  dark: {
    background: '#444444',
    secondary: '#1E2328',
    secondaryDark: '#878683',
    primaryText: 'white',
    subText: 'gray',
  },
}

export const commonColors = {
  red: '#C6493A',
}
export default theme
