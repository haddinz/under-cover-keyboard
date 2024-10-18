import { env } from 'process';

export const invokeLater = (callback: () => any, intervalMs: number) => {
  const timeout = setTimeout(() => {
    callback();
    clearTimeout(timeout);
  }, intervalMs);
};

export const scrollTop = (callback?: () => any, delay = 100) => {
  const opt: any = { top: 0, behavior: 'smooth' };
  invokeLater(() => {
    if (env.NODE_ENV !== 'test') {
      window.scrollTo(opt);
    }
    if (callback) {
      callback();
    }
  }, delay);
};

export const blankFunction = () => {
  //
};
