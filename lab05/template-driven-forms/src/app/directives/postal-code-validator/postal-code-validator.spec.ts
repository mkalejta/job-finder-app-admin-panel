import { PostalCodeValidator } from './postal-code-validator';

describe('PostalCodeInvalid', () => {
  it('should create an instance', () => {
    const directive = new PostalCodeValidator();
    expect(directive).toBeTruthy();
  });
});
