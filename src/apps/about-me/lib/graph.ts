import data from './dialogue.json'

export type AvatarNodeId = keyof (typeof data)['avatar']
export type VisitorNodeId = keyof (typeof data)['visitor']

export type AvatarNode = {
  text: string
  auto?: AvatarNodeId
  children?: VisitorNodeId[]
  animation?: string
}

export type VisitorNode = {
  text: string
  next: AvatarNodeId
}

export const avatar = data.avatar as Record<AvatarNodeId, AvatarNode>
export const visitor = data.visitor as Record<VisitorNodeId, VisitorNode>

export const START_NODE: AvatarNodeId = 'start'
