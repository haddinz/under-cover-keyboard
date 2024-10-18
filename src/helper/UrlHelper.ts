import { invokeLater } from './EventHelper';

const getParam = ({
  urlString = '',
  paramName = '',
}) : string | null => {
  if (!urlString) return null;
  const arrUrlString = urlString.split('?');
  const result: any = {};
  if (!arrUrlString[1]) return null;
  let params: any = arrUrlString[1];
  params = params.split('&');
  params.forEach((item: any) => {
    item = item.split('=');
    const key = item[0];
    const value = item[1];
    result[key] = value;
  });

  return result[paramName];
};

const getCurrentPath = (urlString: any) => {
  if (!urlString) return null;
  const arrUrlString = urlString.split('//');
  if (!arrUrlString[1]) return null;
  let paths: any = arrUrlString[1];
  paths = paths.split('/');

  return paths[1];
};

const downloadFile = (data: any, filename: string, type: string) => {
  const file = new Blob([data], { type: type });
  const a = document.createElement('a');
  const url = URL.createObjectURL(file);

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  invokeLater(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
};

const openImage = (dataURL: string, width: number, height: number) => {
  const iframe = `<iframe width='${width}' height='${height}' src='${dataURL}'></iframe>`;
  const x: any = window.open();
  x.document.open();
  x.document.write(iframe);
  x.document.close();
};

const UrlHelper = {
  getParam,
  getCurrentPath,
  downloadFile,
  openImage,
};

export default UrlHelper;
