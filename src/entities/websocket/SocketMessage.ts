
export default interface SocketMessage {
  id: string
  content: string

  channelId: string
  authorId: string

  createdAt: string
  updatedAt?: string
}
