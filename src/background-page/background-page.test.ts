import './background-page';
import { TestsDriver } from '../../test/driver';

const driver = new TestsDriver();

describe('[Background Page]', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
