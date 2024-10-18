class ServiceResponse<TContent> {
  public content: TContent;
  public errorMsg: string;
  constructor(content?: TContent) {
    if (content) {
      this.content = content;
    }
  }
}
export class DefaultServiceResponse extends ServiceResponse<any> {
  constructor(content?: any) {
    super();
    if (content) {
      this.content = content;
    }
  }
}
export default ServiceResponse;
