export enum ChannelType {
  TEXT = 0
}

export default interface Channel {
  id: string
  type: ChannelType
  name: string
  createdAt: string
  updatedAt?: string
}
