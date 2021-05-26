import { /*useGetUserQuery*/ useGetUsersQuery } from '../generated/graphql'
import { ThemeToggle } from '../components/elements/index'
import { UserCard } from '../components/modules/index'

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
export default Home
