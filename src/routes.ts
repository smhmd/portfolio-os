import { index, route, type RouteConfig } from '@react-router/dev/routes'

import { apps } from 'src/apps'

const appRoutes = Object.keys(apps).map((app) =>
  route(app, `apps/${app}/route.tsx`),
)

export default [
  index('apps/launcher/route.tsx'),
  ...appRoutes,
] satisfies RouteConfig
