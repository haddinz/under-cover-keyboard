export default class ServiceError extends Error {
  constructor(public code: string, public message: string) {
    super(message);
  }
}
