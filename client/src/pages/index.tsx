import { useGetUserQuery } from '../generated/graphql'

const Home: React.FC = () => {
  const [, getUser] = useGetUserQuery({ variables: { id: '1' } })

  return <div>Hello</div>
}
export default Home
