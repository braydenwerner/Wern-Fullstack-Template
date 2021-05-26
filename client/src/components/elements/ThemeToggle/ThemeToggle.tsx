import { useContext } from 'react'
import { FaMoon, FaSun } from 'react-icons/fa'
import Switch from 'react-switch'

import { ThemeContext } from '../../../providers/AppProvider'
import { SwitchContainer } from './ThemeToggle.styled'

export const ThemeToggle: React.FC = () => {
  const { toggleTheme, themeMode } = useContext(ThemeContext)

  const handleThemeChange = () => {
    toggleTheme()
  }

  return (
    <SwitchContainer>
      <Switch
        checked={themeMode === 'light' ? true : false}
        height={25}
        width={60}
        handleDiameter={10}
        onColor={'#FF5733'}
        offColor={'#124EAA'}
        checkedIcon={
          <FaSun
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 18,
              paddingLeft: 5,
            }}
            color={themeMode === 'light' ? 'white' : 'grey'}
          />
        }
        uncheckedIcon={
          <FaMoon
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontSize: 18,
              paddingLeft: 14,
            }}
            color={themeMode === 'dark' ? 'blue' : 'blue'}
          />
        }
        onChange={handleThemeChange}
      />
    </SwitchContainer>
  )
}
