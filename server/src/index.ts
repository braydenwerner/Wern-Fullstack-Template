import { Post } from './entities/Post'

const init = async () => {
  const orm = await MikroORM.init(microConfig)

  const post = orm.em.create(Post, { title: 'my first post' })
  await orm.em.persistAndFlush(post)
}
init()
