import { withUrqlClient } from 'next-urql'

import { /*useGetUserQuery*/ useGetUsersQuery } from '../generated/graphql'
import { ThemeToggle } from '../components/elements/index'
import { UserCard } from '../components/modules/index'
import { createUrqlClient } from '../util/createURQLClient'

const Home: React.FC = () => {
  const [users] = useGetUsersQuery()
  // const [user] = useGetUserQuery({ variables: { id: '1' } })

  return (
    <>
      <ThemeToggle />
      {users.data?.users?.map((user, i) => {
        return <UserCard key={i} user={user} />
      })}
    </>
  )
}
//  creates client with server side rendering enabled
export default withUrqlClient(createUrqlClient, { ssr: true })(Home)
