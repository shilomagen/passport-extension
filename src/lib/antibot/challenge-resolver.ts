/// Secret challenge resolver that is used in MyVisit page to block bots

const randomStr = (length: number) => {
  const all = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += all.charAt(Math.floor(Math.random() * all.length));
  }

  return result;
};

export const generateZebraUrl = (): string => {
  return `https://myvisit.com/7060ac19f50208cbb6b45328ef94140a612ee92387e015594234077b4d1e64f1/${randomStr(32)}`;
};

export const generateZebraHeader = (seed: string): Record<string, string> => {
  const date = (new Date().getTimezoneOffset() * 123456789).toString();

  const seedWithZero = seed + '0';
  const uuid = generateUuid(seedWithZero);
  const salt = [uuid, 0, date, 'disabled', seed].join(';$(hash);_xcalc(arguments.calle);').replace('=', '-');

  const zebraId = randomStr(8);

  return { [`x-zebra-${zebraId}`]: btoa(salt).replace('=', '-') };
};

/// Core functionality - not a subject for review
export const generateUuid = (seedWithZero: string): string => {
  let formulaCode: number | undefined;

  const calcByFormulaCode = function (...args: number[]): number {
    let v2: number;
    const M2 = args;

    switch (formulaCode) {
      case 2:
        v2 = (M2[0] - M2[2]) * M2[1] * M2[3] + M2[4];
        break;
      case 35:
        v2 = (M2[4] - M2[2]) / M2[3] + M2[1] + M2[0];
        break;
      case 20:
        v2 = -M2[2] / M2[4] - M2[1] + M2[3] + M2[0];
        break;
      case 32:
        v2 = -M2[3] * M2[0] - M2[2] + M2[1];
        break;
      case 16:
        v2 = (M2[1] + M2[2]) * M2[4] * M2[3] - M2[0];
        break;
      case 22:
        v2 = (M2[1] + M2[3]) * M2[2] - M2[0];
        break;
      case 8:
        v2 = (M2[3] >>> (M2[1] * M2[2])) & M2[0];
        break;
      case 4:
        v2 = M2[1] - M2[4] + M2[3] + M2[2] - M2[0];
        break;
      case 30:
        v2 = (-M2[3] - M2[0]) / M2[1] + M2[2];
        break;
      case 3:
        v2 = M2[2] - M2[1] - M2[0];
        break;
      case 28:
        v2 = M2[1] >>> M2[0];
        break;
      case 12:
        v2 = (M2[0] & M2[2]) | M2[1];
        break;
      case 10:
        v2 = M2[0] - M2[1] + M2[2] - M2[3];
        break;
      case 9:
        v2 = (M2[2] * M2[1] * M2[3]) / M2[4] - M2[0];
        break;
      case 5:
        v2 = M2[0] + M2[2] - M2[1];
        break;
      case 6:
        v2 = (M2[2] << M2[0]) | (M2[4] >>> (M2[1] - M2[3]));
        break;
      case 14:
        v2 = M2[3] + M2[2] - M2[1] - M2[0];
        break;
      case 23:
        v2 = (M2[1] - M2[2] + M2[4]) * M2[3] - M2[0];
        break;
      case 26:
        v2 = (M2[4] + M2[1] - M2[3]) / M2[0] + M2[2];
        break;
      case 24:
        v2 = M2[3] * M2[2] * M2[4] * M2[1] - M2[0];
        break;
      case 0:
        v2 = M2[0] - M2[1];
        break;
      case 29:
        v2 = (M2[2] << M2[1]) & M2[0];
        break;
      case 27:
        v2 = (M2[4] + M2[1] - M2[3]) * M2[0] + M2[2];
        break;
      case 34:
        v2 = M2[1] * M2[3] * M2[2] - M2[0];
        break;
      case 1:
        v2 = (M2[2] / M2[0] + M2[1]) * M2[4] - M2[3];
        break;
      case 11:
        v2 = (M2[1] >> M2[2]) | M2[0];
        break;
      case 7:
        v2 = (M2[2] >>> (M2[4] * M2[3] + M2[0])) & M2[1];
        break;
      case 21:
        v2 = M2[0] / M2[2] + M2[1];
        break;
      case 19:
        v2 = (-M2[1] / M2[2]) * M2[3] + M2[0];
        break;
      case 15:
        v2 = M2[2] / M2[1] - M2[0];
        break;
      case 31:
        v2 = (M2[2] - M2[0]) * M2[3] - M2[1];
        break;
      case 33:
        v2 = (M2[1] + M2[0]) & M2[2];
        break;
      case 18:
        v2 = M2[0] / M2[2] + M2[3] - M2[1];
        break;
      case 25:
        v2 = M2[0] + M2[1];
        break;
      case 13:
        v2 = ((M2[2] >> M2[1]) & M2[3]) | M2[0];
        break;
      case 17:
        v2 = M2[2] - M2[1] + M2[0];
        break;
    }

    return v2!;
  };

  const calcWithSix = (arg1: number, arg2: number) => {
    formulaCode = 6;
    return calcByFormulaCode(arg2, 32, arg1, arg2, arg1);
  };

  const calcSevenTimes = (arg1: number) => {
    let result = '';

    for (let i = 7; i >= 0; i--) {
      formulaCode = 8;
      result += calcByFormulaCode(15, i, 4, arg1).toString(16);
    }

    return result;
  };

  const hashSeed = (arg: string) => {
    arg = arg.replace(/\x0d\u000a/g, '\n');

    let result = '';
    for (let i = 0; i < arg.length; i++) {
      const charCode = arg.charCodeAt(i);

      if (charCode < 128) {
        result += String.fromCharCode(charCode);
      } else if (charCode > 127 && charCode < 2048) {
        formulaCode = 11;
        result += String.fromCharCode(calcByFormulaCode(192, charCode, 6));
        formulaCode = 12;
        result += String.fromCharCode(calcByFormulaCode(charCode, 128, 63));
      } else {
        formulaCode = 11;
        result += String.fromCharCode(calcByFormulaCode(224, charCode, 12));
        formulaCode = 13;
        result += String.fromCharCode(calcByFormulaCode(128, 6, charCode, 63));
        formulaCode = 12;
        result += String.fromCharCode(calcByFormulaCode(charCode, 128, 63));
      }
    }

    return result;
  };

  const R7 = [];
  R7[8] = new Array(80);
  R7[5] = 1732584193;
  R7[9] = 4023233417;
  R7[2] = 2562383102;
  R7[4] = 271733878;
  R7[6] = 3285377520;

  const hashedSeed = hashSeed(seedWithZero);
  const length = hashedSeed.length;

  const arr: number[] = [];
  for (R7[3] = 0; R7[3] < length - 3; R7[3] += 4) {
    formulaCode = 14;
    R7[47] = calcByFormulaCode(234, 20, 14, 264);
    formulaCode = 15;
    R7[40] = calcByFormulaCode(0, 19, 19);
    formulaCode = 16;
    R7[82] = calcByFormulaCode(194, 1, 5, 5, 7);
    formulaCode = 17;
    R7[70] = calcByFormulaCode(18, 16, 0);
    formulaCode = 18;
    R7[27] = calcByFormulaCode(21, 31, 1, 18);
    formulaCode = 19;
    R7[43] = calcByFormulaCode(6, 10, 10, 3);

    R7[1] =
      (hashedSeed.charCodeAt(R7[3]) << R7[47]) |
      (hashedSeed.charCodeAt(R7[3] + R7[40]) << R7[82]) |
      (hashedSeed.charCodeAt(R7[3] + R7[70]) << R7[27]) |
      hashedSeed.charCodeAt(R7[3] + R7[43]);
    arr.push(R7[1]);
  }

  switch (length % 4) {
    case 0:
      R7[3] = 2147483648;
      break;
    case 1:
      formulaCode = 20;
      R7[54] = calcByFormulaCode(6, 15, 15, 15, 3);
      formulaCode = 3;
      R7[58] = calcByFormulaCode(399, 9, 432);
      formulaCode = 21;
      R7[86] = calcByFormulaCode(1398101, 6990507, 1);
      R7[3] = (hashedSeed.charCodeAt(length - R7[54]) << R7[58]) | R7[86];
      break;
    case 2:
      formulaCode = 22;
      R7[78] = calcByFormulaCode(37, 0, 3, 13);
      formulaCode = 23;
      R7[26] = calcByFormulaCode(536, 32, 20, 20, 16);
      formulaCode = 5;
      R7[39] = calcByFormulaCode(0, 17, 18);
      formulaCode = 24;
      R7[83] = calcByFormulaCode(448784, 10, 11, 240, 17);
      formulaCode = 25;
      R7[68] = calcByFormulaCode(32757, 11);
      R7[3] =
        (hashedSeed.charCodeAt(length - R7[78]) << R7[26]) |
        (hashedSeed.charCodeAt(length - R7[39]) << R7[83]) |
        R7[68];
      break;
    case 3:
      formulaCode = 0;
      R7[76] = calcByFormulaCode(27, 24);
      formulaCode = 26;
      R7[49] = calcByFormulaCode(4, 20, 13, 5, 29);
      formulaCode = 21;
      R7[92] = calcByFormulaCode(1, 1, 1);
      formulaCode = 25;
      R7[31] = calcByFormulaCode(2, 14);
      formulaCode = 15;
      R7[30] = calcByFormulaCode(7, 2, 16);
      formulaCode = 24;
      R7[79] = calcByFormulaCode(1630, 9, 13, 1, 14);
      formulaCode = 27;
      R7[24] = calcByFormulaCode(4, 13, 56, 5, 10);
      R7[3] =
        (hashedSeed.charCodeAt(length - R7[76]) << R7[49]) |
        (hashedSeed.charCodeAt(length - R7[92]) << R7[31]) |
        (hashedSeed.charCodeAt(length - R7[30]) << R7[79]) |
        R7[24];
      break;
  }

  arr.push(R7[3]);
  while (arr.length % 16 != 14) {
    arr.push(0);
  }

  arr.push(calcByFormulaCode(29, length, (formulaCode = 28)));
  arr.push(calcByFormulaCode(4294967295, 3, length, (formulaCode = 29)));

  for (R7[7] = 0; R7[7] < arr.length; R7[7] += 16) {
    for (R7[3] = 0; R7[3] < 16; R7[3]++) {
      formulaCode = 25;
      R7[8][R7[3]] = arr[calcByFormulaCode(R7[7], R7[3])];
    }
    for (R7[3] = 16; R7[3] <= 79; R7[3]++) {
      R7[8][R7[3]] = calcWithSix(R7[8][R7[3] - 3] ^ R7[8][R7[3] - 8] ^ R7[8][R7[3] - 14] ^ R7[8][R7[3] - 16], 1);
    }

    R7[60] = R7[5];
    R7[56] = R7[9];
    R7[41] = R7[2];
    R7[69] = R7[4];
    R7[74] = R7[6];

    for (R7[3] = 0; R7[3] <= 19; R7[3]++) {
      formulaCode = 30;
      R7[98] = calcByFormulaCode(14, 1, 22, 3);
      formulaCode = 31;
      R7[71] = calcByFormulaCode(17, 107813517526, 12148001992, 9);
      R7[36] =
        (calcWithSix(R7[60], R7[98]) + ((R7[56] & R7[41]) | (~R7[56] & R7[69])) + R7[74] + R7[8][R7[3]] + R7[71]) &
        4294967295;
      R7[74] = R7[69];
      R7[69] = R7[41];
      R7[41] = calcWithSix(R7[56], 30);
      R7[56] = R7[60];
      R7[60] = R7[36];
    }

    for (R7[3] = 20; R7[3] <= 39; R7[3]++) {
      formulaCode = 15;
      R7[89] = calcByFormulaCode(3, 10, 80);
      formulaCode = 25;
      R7[81] = calcByFormulaCode(1859775376, 17);
      R7[36] = (calcWithSix(R7[60], R7[89]) + (R7[56] ^ R7[41] ^ R7[69]) + R7[74] + R7[8][R7[3]] + R7[81]) & 4294967295;
      R7[74] = R7[69];
      R7[69] = R7[41];
      R7[41] = calcWithSix(R7[56], 30);
      R7[56] = R7[60];
      R7[60] = R7[36];
    }

    for (R7[3] = 40; R7[3] <= 59; R7[3]++) {
      formulaCode = 4;
      R7[97] = calcByFormulaCode(38, 30, 11, 7, 5);
      R7[36] =
        (calcWithSix(R7[60], R7[97]) +
          ((R7[56] & R7[41]) | (R7[56] & R7[69]) | (R7[41] & R7[69])) +
          R7[74] +
          R7[8][R7[3]] +
          2400959708) &
        4294967295;
      R7[74] = R7[69];
      R7[69] = R7[41];
      R7[41] = calcWithSix(R7[56], 30);
      R7[56] = R7[60];
      R7[60] = R7[36];
    }

    for (R7[3] = 60; R7[3] <= 79; R7[3]++) {
      formulaCode = 32;
      R7[37] = calcByFormulaCode(4, 32, 15, 3);
      R7[36] =
        (calcWithSix(R7[60], R7[37]) + (R7[56] ^ R7[41] ^ R7[69]) + R7[74] + R7[8][R7[3]] + 3395469782) & 4294967295;
      R7[74] = R7[69];
      R7[69] = R7[41];
      R7[41] = calcWithSix(R7[56], 30);
      R7[56] = R7[60];
      R7[60] = R7[36];
    }

    formulaCode = 33;
    R7[5] = calcByFormulaCode(R7[60], R7[5], 4294967295);
    formulaCode = 33;
    R7[9] = calcByFormulaCode(R7[56], R7[9], 4294967295);
    formulaCode = 33;
    R7[2] = calcByFormulaCode(R7[41], R7[2], 4294967295);
    formulaCode = 33;
    R7[4] = calcByFormulaCode(R7[69], R7[4], 4294967295);
    formulaCode = 33;
    R7[6] = calcByFormulaCode(R7[74], R7[6], 4294967295);
  }

  const res =
    calcSevenTimes(R7[5]) +
    calcSevenTimes(R7[9]) +
    calcSevenTimes(R7[2]) +
    calcSevenTimes(R7[4]) +
    calcSevenTimes(R7[6]);

  return res.toLowerCase();
};
