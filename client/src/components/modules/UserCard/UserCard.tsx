interface UserCardProps {
  user: any
}

export const UserCard: React.FC<UserCardProps> = (user: any) => {
  console.log(user.user)
  return (
    <>
      {Object.keys(user.user).map((key: string, i: number) => {
        return <div key={i}>{`${key}: ${user.user[key]}`}</div>
      })}
    </>
  )
}
