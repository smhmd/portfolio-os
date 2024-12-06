import { index, route, type RouteConfig } from '@react-router/dev/routes'

import { apps } from 'app/apps'

const appRoutes = Object.keys(apps).map((app) =>
  route(app, `apps/${app}/index.tsx`),
)

export default [
  index('apps/launcher/index.tsx'),
  ...appRoutes,
] satisfies RouteConfig
