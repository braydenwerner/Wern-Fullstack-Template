import { /*useGetUserQuery*/ useGetUsersQuery } from '../generated/graphql'
import { UserCard } from '../components/modules/index'

const Home: React.FC = () => {
  const [users] = useGetUsersQuery()
  // const [user] = useGetUserQuery({ variables: { id: '1' } })

  return (
    <>
      {users.data?.users?.map((user, i) => {
        return <UserCard key={i} user={user} />
      })}
    </>
  )
}
export default Home
