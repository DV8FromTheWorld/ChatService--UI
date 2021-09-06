import User from '@/entities/state/User'
import Channel from '@/entities/state/Channel'

export default interface Message {
  id: string
  content: string
  channel: Channel
  author: User
  createdAt: string
  updatedAt?: string
}
