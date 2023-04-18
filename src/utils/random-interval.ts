const random = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export interface RandomIntervalClear {
  clear: () => void;
}

const setRandomInterval = (intervalFunction: () => void, minDelay = 0, maxDelay = 0): RandomIntervalClear => {
  let timeout: ReturnType<typeof setTimeout>;

  const runInterval = (): void => {
    timeout = setTimeout(() => {
      intervalFunction();
      runInterval();
    }, random(minDelay, maxDelay));
  };

  runInterval();

  return {
    clear(): void {
      clearTimeout(timeout);
    },
  };
};

export default setRandomInterval;
