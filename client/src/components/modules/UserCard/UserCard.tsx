import { Wrapper } from '../../elements/index'
import { Grid } from '@material-ui/core'

interface UserCardProps {
  user: any
}

export const UserCard: React.FC<UserCardProps> = (user: any) => {
  console.log(user.user)
  return (
    <Wrapper>
      <Grid>
        {Object.keys(user.user).map((key: string, i: number) => {
          return <div key={i}>{`${key}: ${user.user[key]}`}</div>
        })}
      </Grid>
    </Wrapper>
  )
}
