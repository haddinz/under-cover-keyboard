import FormatDateEnum from '../../enums/FormatDateEnum';
import DateHelper from '../DateHelper';

describe('Test DateHelper', () => {
  it('numberToHours - Return correct value', () => {
    const result = DateHelper.formatDateToString(FormatDateEnum.YYYY_MM_DD, '2021-10-10 10:10:10');
    const result2 = DateHelper.formatDateToString(FormatDateEnum.YYYY_MM_DD_H_M, '2021-10-10 10:10:10');

    expect(result).toBe('2021-10-10');
    expect(result2).toBe('2021-10-10 10:10 AM');
  });
});
