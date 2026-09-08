import { normaliseNigerianPhone } from './phone.transform';

describe('normaliseNigerianPhone', () => {
  it.each([
    // The format people actually type — this one previously failed validation.
    ['09113378646', '+2349113378646'],
    ['08123456789', '+2348123456789'],
    // National format without the trunk prefix
    ['9113378646', '+2349113378646'],
    // Country code without the plus
    ['2349113378646', '+2349113378646'],
    // Already correct
    ['+2349113378646', '+2349113378646'],
    // Punctuation people paste from contacts
    ['+234 911 337 8646', '+2349113378646'],
    ['0911-337-8646', '+2349113378646'],
    ['(0911) 337 8646', '+2349113378646'],
    [' 09113378646 ', '+2349113378646'],
  ])('normalises %s to %s', (input, expected) => {
    expect(normaliseNigerianPhone(input)).toBe(expected);
  });

  it('leaves a valid international number alone', () => {
    expect(normaliseNigerianPhone('+14155552671')).toBe('+14155552671');
    expect(normaliseNigerianPhone('+447911123456')).toBe('+447911123456');
  });

  it('passes malformed input through for the validator to reject', () => {
    // The transform decides formatting, never validity.
    for (const bad of ['', '   ', 'not-a-number', '12', 'abc09113378646']) {
      expect(typeof normaliseNigerianPhone(bad)).toBe('string');
    }
    expect(normaliseNigerianPhone('not-a-number')).toBe('not-a-number');
  });

  it('leaves non-strings untouched', () => {
    expect(normaliseNigerianPhone(undefined)).toBeUndefined();
    expect(normaliseNigerianPhone(null)).toBeNull();
    expect(normaliseNigerianPhone(12345)).toBe(12345);
  });
});
