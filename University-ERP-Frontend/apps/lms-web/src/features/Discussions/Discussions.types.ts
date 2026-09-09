export interface DiscussionPostDto {
  id: string;
  authorName: string;
  authorRole: string;
  title: string;
  content: string;
  createdAt: string;
  replyCount: number;
}
