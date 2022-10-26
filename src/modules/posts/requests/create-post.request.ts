export interface ICreatePostRequestBody {
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  isPublished: boolean | null;

  userId: number;
  categories: number[];
  tags: number[];
}
