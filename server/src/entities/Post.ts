import { Entity, PrimaryKey, Property } from '@mikro-orm/core'

@Entity()
export class Post {
  @PrimaryKey()
  id!: number

  @Property()
  createdAt = new Date()

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()

  @Property()
  title!: string
}
