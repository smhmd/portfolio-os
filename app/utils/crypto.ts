import { v4 } from 'uuid'

const uuid = 'randomUUID' in crypto ? crypto.randomUUID.bind(crypto) : v4

export { uuid }
