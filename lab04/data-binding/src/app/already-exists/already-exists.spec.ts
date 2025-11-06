import { AlreadyExists } from './already-exists';

describe('AlreadyExists', () => {
  it('should create an instance', () => {
    const directive = new AlreadyExists();
    expect(directive).toBeTruthy();
  });
});
