import {
  Resolver,
  Mutation,
  Arg,
  Field,
  // Ctx,
  ObjectType,
  Query,
  // FieldResolver,
  // Root,
} from 'type-graphql'
import { getConnection } from 'typeorm'
import * as argon2 from 'argon2'

// import { MyContext } from '../types'
import { validateRegister } from '../utils/validateRegister'
import { UserAccount } from '../entities/index'
import { UserInput } from './userInput'

@ObjectType()
class FieldError {
  @Field()
  field: string
  @Field()
  message: string
}

@ObjectType()
//  return the errors associated and the user
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]

  @Field(() => UserAccount, { nullable: true })
  user?: UserAccount
}

@Resolver(UserAccount)
export class UserResolver {
  @Query(() => UserAccount, { nullable: true })
  user(@Arg('id') id: string) {
    const user = UserAccount.findOne({ where: { id } })
    if (!user) return null

    return user
  }

  @Query(() => [UserAccount], { nullable: true })
  users() {
    console.log('users query reached')
    const users = UserAccount.find()
    if (!users) return null

    return users
  }

  @Mutation(() => UserResponse)
  async createUser(@Arg('options') options: UserInput): Promise<UserResponse> {
    const errors = validateRegister(options)
    if (errors) {
      return { errors }
    }

    const hashedPassword = await argon2.hash(options.password)
    let user
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(UserAccount)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning('*')
        .execute()
      user = result.raw[0]
    } catch (err) {
      if (err.code === '23505') {
        return {
          errors: [
            {
              field: 'username',
              message: 'username already taken',
            },
          ],
        }
      }
    }

    return { user }
  }
}
