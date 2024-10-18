export default class JsonRpcResponse {
  jsonrpc: string;
  error: { message: string } | undefined;
  id: number;
  result: any | undefined;
  type?: string;
  topic?: string;
}
