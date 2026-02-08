import { getOrCreateUserId } from '../utils/userId';

describe('getOrCreateUserId', () => {
  it('returns a string userId', () => {
    const id = getOrCreateUserId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });
});
