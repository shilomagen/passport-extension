import { generateUuid } from './challenge-resolver';

describe('challengeResolver', () => {
  it('should generate the correct UUID given a seedWithZero', () => {
    const seedWithZero =
      '+LX+97PfqTwsxDVvEdp8r6tMs3+qVTvYzV/QNAT5hD8IOeVCM6TQ6MqR1rk3k+hs8sBvlKVVLhxUoNVcXlEOfo4BeXpVZqatplOaa3yse68bFbG5Dd7kBnpKa15GM/0cuBI+WwOcdAZw+f7pIalOzpiH/xu8HNImcEi7s2fAVcVpCSKYxvaux0Eh4eA4JPj6Gdb6LWMXBgt3s7yeSSoCTK2F/z1aqsPsGDhkcrdZ3srwaXkuiVHB7dGGBkCZtu+H0';

    const expected = 'b08780b1a73a0b8228450d833988bfaac9e58419';

    const resolved = generateUuid(seedWithZero);
    expect(resolved).toBe(expected);
  });
});
