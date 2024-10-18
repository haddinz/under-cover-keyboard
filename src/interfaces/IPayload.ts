interface IPayload {
  id?: number | string,
  data?: any | any[],
  params?: any,
  filter?: string,
  ids?: any[],
}

export default IPayload;
