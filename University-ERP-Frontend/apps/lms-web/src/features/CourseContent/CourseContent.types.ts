export interface ContentItemDto {
  id: string;
  name: string;
  contentType: string;
  resourceUrl: string;
}

export interface LearningModuleDto {
  id: string;
  title: string;
  description: string;
  orderSequence: number;
  items: ContentItemDto[];
}
