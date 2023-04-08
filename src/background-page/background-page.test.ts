import './background-page';
import { TestsDriver } from '../../test/driver';

const driver = new TestsDriver();

describe('[Background Page]', () => {
  beforeEach(driver.reset);
  it('should work', () => {
    expect(true).toBe(true);
  });
});
