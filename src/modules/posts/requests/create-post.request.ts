export interface ICreatePostRequestBody {
  title: string;
  imageCover: string | null;
  summary: string | null;
  postContents: string | null;
  isPublished: boolean | null;

  categories: number[];
  tags: number[];
}
