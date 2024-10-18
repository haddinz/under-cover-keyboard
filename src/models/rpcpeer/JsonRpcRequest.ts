export default class JsonRpcRequest {
  method: string;
  params: any[];
  id: string;
  type?: 'request' | 'response';
  clientId?: string;
}
