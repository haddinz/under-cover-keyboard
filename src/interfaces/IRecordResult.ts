export default interface IRecordResult<T> {
  items: T[];
  totalData: number;
  order: string;
  orderDesc: boolean;
  page: number;
  limit: number;
  searchTerm?: string;
}
