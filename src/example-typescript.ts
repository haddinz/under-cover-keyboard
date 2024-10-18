/**
 * type interface
 */
const name = '';
const isMale = true;
const total = 1;
const arrTotal: number[] = [1, 2, 3];

// this line will error
// name = true;

// type enum
enum Gender {
  male = 'male',
  female = 'female'
}

// const Gender = Object.freeze({
//   male: 'male',
//   female: 'female',
// })

let gender: keyof typeof Gender = 'male';

gender = Gender.female;

/**
 * type vs interface
 */
type IOneOther = {
  name1: string,
}

interface IOne {
  name1: string,
}

interface ITwo {
  name2: string,
}

interface IThree {
  name3: string
}

interface IResult extends IOne {
  id: number,
}

const result: IResult = {
  id: 0,
  name1: '',
};

type IResultType = {
  id: number,
} & ITwo & IThree;

const resultType: IResultType = {
  id: 1,
  name2: '',
  name3: '',
};

/**
 * function in typescript
 */

function editByGender(gender1: keyof typeof Gender) {
}

editByGender('female');
editByGender(Gender.male);

function returnNumber(value: number): number {
  return value;
}

const valueOfNumber: number = returnNumber(1);

type IArrowFunc = () => void;

const arrowFunc: IArrowFunc = () => {

};

arrowFunc();

const arrowFunc1: (name: string) => string[] = (name1) => {
  return [name1, name1];
};

const resultArrowFunc1: string[] = arrowFunc1('test');

function returnBySomething<T>(value: any): T {
  return value as T;
}

const valueOfAny: boolean = returnBySomething<boolean>(4);

/**
 * utility type
 */

interface ICommon {
  commonString: string,
  commonNumber: number,
  commonBoolean: boolean,
}

const common: ICommon = {
  commonString: '',
  commonNumber: 0,
  commonBoolean: false,
};

// Partial<Type>
const commonPartial: Partial<ICommon> = {
  commonString: '',
};

// Required<Type>
const commonRequire: Required<Partial<ICommon>> = {
  commonString: '',
  commonNumber: 0,
  commonBoolean: false,
};

// Omit<Type>
const commonOmit: Omit<ICommon, 'commonString'> = {
  commonNumber: 1,
  commonBoolean: true,
};

// Pick<Type>
const commonPick: Pick<ICommon, 'commonString' | 'commonBoolean'> = {
  commonString: '',
  commonBoolean: true,
};

/**
 * advance typescript
 */

interface IData {
  id: number,
  name: string,
  isMale: boolean,
}

type IDataToString<T> = {
  [key in keyof T]: string
}

type IDataToOriginal<T> = {
  [key in keyof T]: T[key]
}

const dataOriginal: IData = {
  id: 0,
  name: '',
  isMale: false,
};

const dataToString: IDataToString<IData> = {
  id: '',
  name: '',
  isMale: '',
};

const dataToOriginal: IDataToOriginal<IData> = {
  id: 1,
  name: '',
  isMale: true,
};

interface IMultiParamsOnFunction {
  (key: string): void,
  (key: string, total: number): void,
  (key: string, total: number, callback: () => void): void,
}

const functionExample: IMultiParamsOnFunction = (key?, total1?, callback?) => {

};

functionExample('test');
functionExample('test', 1);
functionExample('string', 1, () => {});

interface IMultiOrSingle {
  (key: 'single', value: number): number,
  (key: 'multi', value: number[]): number[]
}

const functionMultiOrSingle: IMultiOrSingle = (key, value) => {
  if (key === 'single') return value;
  return [value, value];
};

const number1: number = functionMultiOrSingle('single', 1);
const numberOfArray: number[] = functionMultiOrSingle('multi', [1]);

export {};
