import styled from 'styled-components'
import { Grid } from '@material-ui/core'

export const CenterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

export const StyledGridContainer = styled(Grid)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`

export const StyledHeaderText = styled.div`
  font-size: 20px;
`

export const StyledSubText = styled.div`
  font-size: 15px;
  color: ${(props) => props.theme.subText};
`
