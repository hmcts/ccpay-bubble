import { FormatDisplayCurrencyPipe } from 'src/app/shared/pipes/format-display-currency.pipe';

describe('Format display currency pipe', () => {
  const pipe = new FormatDisplayCurrencyPipe();

  it('Transforms a value into a formatted currency', () => {
    expect(pipe.transform('10')).toBe('£ 10.00');
  });

  it('Transforms an empty value into an empty string', () => {
    expect(pipe.transform('')).toBe('');
  });
});
