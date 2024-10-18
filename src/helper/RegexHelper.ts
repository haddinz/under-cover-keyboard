const capitalCharacter = /([A-Z])/g;

const excludeNonASCII = '^[ -~]*$';

const vowel = '^[aieouAIEOU].*';

const RegexHelper = {
  capitalCharacter,
  excludeNonASCII,
  vowel,
};

export default RegexHelper;
