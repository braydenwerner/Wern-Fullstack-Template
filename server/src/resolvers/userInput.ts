import { InputType, Field } from 'type-graphql'

@InputType()
export class UserInput {
  @Field()
  email: string
  @Field()
  username: string
  @Field()
  password: string
}
