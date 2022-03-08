import { PostView } from './views/PostView'

export default [{
  name: 'post-view',
  exact: true,
  path: '/posts/:id',
  component: PostView
}]