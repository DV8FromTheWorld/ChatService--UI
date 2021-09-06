import { ChannelType } from '@/entities/state/Channel'

export default interface SocketChannel {
  id: string
  type: ChannelType
  name: string
  createdAt: string
  updatedAt?: string
}
