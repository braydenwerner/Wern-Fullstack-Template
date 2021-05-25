import styled from 'styled-components'

export const Wrapper: React.FC = (props) => {
  return <StyledDiv>{props}</StyledDiv>
}

const StyledDiv = styled.div`
    display: flex;
    justify-content-center;
    width: 80%;
`
