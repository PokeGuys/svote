import { isValid } from './hkid.extractor';

describe('HKIDValidator', () => {
  describe('isValid', () => {
    it('should return false for invalid format', async () => {
      const input = '12123456';
      expect(isValid(input)).toBeFalsy();
    });
    it('should return false for incorrect check digit', async () => {
      const input = 'C2123456';
      expect(isValid(input)).toBeFalsy();
    });
    it('should return false for invalid check digit', async () => {
      const input = 'C212345(F)';
      expect(isValid(input)).toBeFalsy();
    });
    it('should return true for single letter prefix with parenthesis HKID number', async () => {
      const input = 'U584981(8)';
      expect(isValid(input)).toBeTruthy();
    });
    it('should return true for single letter prefix HKID number', async () => {
      const input = 'U5849818';
      expect(isValid(input)).toBeTruthy();
    });
    it('should return true for double letter prefix HKID number', async () => {
      const input = 'XA987658(5)';
      expect(isValid(input)).toBeTruthy();
    });
    it('should return true for "A" suffix HKID number', async () => {
      const input = 'G123456(A)';
      expect(isValid(input)).toBeTruthy();
    });
  });
});
