import { injectable } from 'inversify';

@injectable()
export default class LoadingService {
  public onStartLoading: (label?: string) => any | undefined;
  public onStopLoading: () => any | undefined;

  start = (label?: string) => {
    if (this.onStartLoading) {
      this.onStartLoading(label);
    }
  }
  stop = () => {
    if (this.onStopLoading) {
      this.onStopLoading();
    }
  }
}
