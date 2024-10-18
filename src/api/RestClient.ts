import Axios, { AxiosError, AxiosResponse } from 'axios';
import { inject, injectable } from 'inversify';
import { HttpStatus } from '../enums/HttpStatus';
import ConflictError from '../models/errors/ConflictError';
import LoadingService from '../services/LoadingService';
import NotFoundError from '../models/errors/NotFoundError';

@injectable()
export default class RestClient {
  @inject(LoadingService)
  private loading: LoadingService;

  private stopLoading = (withDefaultLoading: boolean) => {
    if (withDefaultLoading) {
      this.loading.stop();
    }
  }
  private startLoading = (withDefaultLoading: boolean, loadingLabel: string | undefined) => {
    if (withDefaultLoading) {
      this.loading.start(loadingLabel);
    }
  }

  get = <T>(url: string, withDefaultLoading = true, loadingLabel: string | undefined = undefined): Promise<T> => {
    return this.executeCommonApi(Axios.get(url, { headers: {} }), withDefaultLoading, loadingLabel);
  }
  patch = <T>(url: string, body: any, withDefaultLoading = true, loadingLabel: string | undefined = undefined): Promise<T> => {
    return this.executeCommonApi(Axios.patch(url, body, {}), withDefaultLoading, loadingLabel);
  }
  put = <T>(url: string, body: any, withDefaultLoading = true, loadingLabel: string | undefined = undefined): Promise<T> => {
    return this.executeCommonApi(Axios.put(url, body, {}), withDefaultLoading, loadingLabel);
  }
  post = <T>(url: string, body: any, withDefaultLoading = true, loadingLabel: string | undefined = undefined): Promise<T> => {
    return this.executeCommonApi(Axios.post(url, body, {}), withDefaultLoading, loadingLabel);
  }
  delete = <T>(url: string, withDefaultLoading = true, loadingLabel: string | undefined = undefined): Promise<T> => {
    return this.executeCommonApi(Axios.delete(url, {}), withDefaultLoading, loadingLabel);
  }
  executeCommonApi = <T>(promise: Promise<AxiosResponse<T>>, withDefaultLoading = true, loadingLabel: string | undefined = undefined) => {
    return new Promise<T>((resolve, reject) => {
      this.startLoading(withDefaultLoading, loadingLabel);
      promise
        .then((response: AxiosResponse) => {
          resolve(response.data);
        })
        .catch((err: AxiosError) => {
          if (err.response?.status === HttpStatus.CONFLICT) {
            reject(new ConflictError(err.response?.data?.toString() ?? err.message));
            return;
          }
          if (err.response?.status === HttpStatus.NOT_FOUND) {
            reject(new NotFoundError(err.response?.data?.toString() ?? err.message));
            return;
          }
          const dataExist = err.response?.data && err.response?.data.toString().trim() !== '';
          reject(dataExist ? err.response?.data : new Error(err.message ?? err.toString()));
        })
        .finally(() => this.stopLoading(withDefaultLoading));
    });
  }
  /**
   * download response content with specified name
   * @param path
   * @param fileName
   * @param loadingLabel
   */
  downloadGetNamed = (path: string, fileName: string, loadingLabel?: string) => {
    return new Promise((resolve, reject) => {
      this.loading.start(loadingLabel);
      Axios.get(path, { responseType: 'blob' })
        .then((axiosResponse) => {
          const response = axiosResponse.data;
          const blob = new Blob([response], { type: axiosResponse.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          document.body.appendChild(a);

          a.href = url;
          a.style.display = 'none';
          a.download = fileName;
          a.click();
          a.parentNode?.removeChild(a);
          resolve(null);
        })
        .catch(reject)
        .finally(this.loading.stop);
    });
  }

  downloadPostNamed = (path: string, body: any, fileName: string, loadingLabel?: string) => {
    return new Promise((resolve, reject) => {
      this.loading.start(loadingLabel);
      Axios.post(path, body, { responseType: 'blob' })
        .then((axiosResponse) => {
          const response = axiosResponse.data;
          const blob = new Blob([response], { type: axiosResponse.headers['content-type'] });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');

          document.body.appendChild(a);

          a.href = url;
          a.style.display = 'none';
          a.download = fileName;
          a.click();
          a.parentNode?.removeChild(a);
          resolve(null);
        })
        .catch(reject)
        .finally(this.loading.stop);
    });
  }
}
