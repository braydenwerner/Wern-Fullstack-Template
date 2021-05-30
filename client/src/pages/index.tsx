import { withUrqlClient } from 'next-urql'
import styled from 'styled-components'

import { /*useGetUserQuery*/ useGetUsersQuery } from '../generated/graphql'
import { ThemeToggle } from '../components/elements/index'
import { createUrqlClient } from '../util/createURQLClient'
import {
  CenterContainer,
  StyledGridContainer,
  StyledHeaderText,
  StyledSubText,
} from '../styles/constantStyles'
import { useMediaQuery } from '../hooks/useMediaQuery'

const Home: React.FC = () => {
  const [{ data }] = useGetUsersQuery()

  //  example query with id parameter
  // const [user] = useGetUserQuery({ variables: { id: '1' } })

  const largerThan500px = useMediaQuery('(min-width: 775px)')

  return (
    <>
      <ThemeToggle />
      {data &&
        data.users?.map((user, i: number) => {
          return (
            <CenterContainer key={i}>
              <StyledGridContainer>
                <StyledUserContainer largerThan500px={largerThan500px}>
                  <StyledHeaderText>{user.username}</StyledHeaderText>
                  <StyledSubText>Id: {user.id}</StyledSubText>
                  <StyledSubText>{user.email}</StyledSubText>
                </StyledUserContainer>
              </StyledGridContainer>
            </CenterContainer>
          )
        })}
    </>
  )
}

interface StyledUserContainerProps {
  largerThan500px: boolean
}

const StyledUserContainer = styled.div<StyledUserContainerProps>`
  width: ${(props) => (props.largerThan500px ? '700px' : '90%')};
  height: 100%;
  padding: 15px;
  background-color: ${(props) => props.theme.secondary};
`

//  creates client with server side rendering enabled
export default withUrqlClient(createUrqlClient, { ssr: true })(Home)
