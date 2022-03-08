import homeRoutes from './home/routes'
import postViewRoutes from './postView/routes'

import { Posts } from './posts'

export const routes = [
  ...homeRoutes,
  ...postViewRoutes
]

export const modules = {
  Posts
}