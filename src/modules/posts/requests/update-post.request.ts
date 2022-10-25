export interface IUpdatePostRequestBody {
  title?: string;
  imageCover?: string;
  summary?: string;
  postContents?: string;
  lastRead?: Date;
  counterLike?: number;
  isPublished?: boolean;

  categories: number[];
  tags: number[];
}

export interface INewDataPostRequest
  extends Omit<IUpdatePostRequestBody, 'categories' | 'tags'> {
  categories: {
    deleteMany: any;
    create: { category: { connect: { id: number } } }[];
  };
  tags: { deleteMany: any; create: { tag: { connect: { id: number } } }[] };
}

export interface IUpdatePostRequestParams {
  id: number;
}
