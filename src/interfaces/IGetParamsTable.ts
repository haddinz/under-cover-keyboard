interface IGetParamsTable<IStateContentData> {
  // filters: Partial<IStateContentData>,
  // hasPrevious: boolean,
  // hasNext: boolean,
  order: string;
  orderDesc: boolean;
  page: number;
  limit: number;
  searchTerm?: string,
}

export default IGetParamsTable;
