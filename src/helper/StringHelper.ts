import RegexHelper from './RegexHelper';

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
const lowerCaseFirstLetter = (string: string) => {
  return string.charAt(0).toLowerCase() + string.slice(1);
};

const avatarName = (firstName?: string, lastName?: string) => {
  const str = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  return str.toUpperCase();
};

const addSpaceBetweenCapitalizeLetter = (string: string) => {
  return string.replace(RegexHelper.capitalCharacter, ' $1').trim();
};

const keyToTitle = (string: string) => {
  if (string === '') return '';
  string = string[0].toUpperCase() + string.slice(1);
  return addSpaceBetweenCapitalizeLetter(string);
};

const generateUUID = () => { // Public Domain/MIT
  let d = new Date().getTime();// Timestamp
  let d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;// Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = Math.random() * 16;// random number between 0 and 16
    if (d > 0) { // Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else { // Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
};

const StringHelper = {
  addSpaceBetweenCapitalizeLetter,
  avatarName,
  capitalizeFirstLetter,
  lowerCaseFirstLetter,
  keyToTitle,
  generateUUID,
};

export default StringHelper;
