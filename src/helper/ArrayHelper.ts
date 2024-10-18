import { isArray } from 'lodash';

const moveElement = (items: any[], element: any, right: boolean) => {
  let moveDone = false;
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    if (item === element) {
      if (right && i <= items.length - 1) {
        // move right
        items[i] = items[i + 1];
        items[i + 1] = item;
        moveDone = true;
        break;
      } else if (!right && i > 0) {
        // move left
        items[i] = items[i - 1];
        items[i - 1] = item;
        moveDone = true;
        break;
      } else {
        // console.warn('Move invalid');
      }
    }
  }
  return moveDone;
};

const containsAll = <T>(arr: T[], search: T | T[]) => {
  if (!isArray(search)) {
    return arr.indexOf(search) >= 0;
  }
  return search.filter((s) => arr.indexOf(s) >= 0).length === search.length;
};

const containsAny = <T>(arr: T[], search: T | T[]) => {
  if (!isArray(search)) {
    return arr.indexOf(search) >= 0;
  }
  return search.filter((s) => arr.indexOf(s) >= 0).length > 0;
};

const equals = <T>(array1: T[], array2: T[]) => {
  const isEqual = (array1.length === array2.length) && array1.every((element, index) => {
    return JSON.stringify(element) === JSON.stringify(array2[index]);
  });
  return isEqual;
};

const create = <T>(start: number, endBefore: number, format: (x: number) => T, increment = 1) => {
  const arr:T[] = [];
  for (let i = start; i < endBefore; i += increment) {
    arr.push(format(i));
  }
  return arr;
};

const clone = <T>(arr: T[]) => {
  const res:T[] = [];
  arr.forEach((i) => res.push(i));
  return res;
};

const insert = <T>(arr: T[], el: T, index: number) => {
  if (arr.length <= index) {
    arr.push(el);
    return;
  }
  for (let i = arr.length - 1; i >= index; i -= 1) {
    const element = arr[i];
    arr[i + 1] = element;
  }
  arr[index] = el;
};

const cloneMap = <K, V> (src: Map<K, V>) => {
  const map = new Map<K, V>();
  src.forEach((val, key) => map.set(key, val));
  return map;
};

const fillMissing = <T>(source: T[], maxLength: number, defaultValue: T) => {
  const result: T[] = [];
  for (let i = 0; i < maxLength; i += 1) {
    if (source.length > i) {
      result[i] = source[i];
    } else {
      result[i] = defaultValue;
    }
  }
  return result;
};

const padLeft = <T>(array: T[], ...newValues: T[]) => {
  array.splice(0, newValues.length);
  newValues.forEach((v) => array.push(v));
};

const ArrayHelper = {
  swapElement: moveElement,
  containsAll,
  equals,
  create,
  clone,
  insert,
  containsAny,
  cloneMap,
  fillMissing,
  padLeft,
};

(window as any).arrInsert = insert;

export default ArrayHelper;
