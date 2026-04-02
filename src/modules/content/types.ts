export type PublishTarget = "site" | "instagram" | "both"

export interface CreatePostInput {
  imageUrl: string
  caption: string
  publishTarget: PublishTarget
}
