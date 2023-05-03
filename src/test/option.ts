import { ADVICE_COUNT, FINAL_OPTION_COUNT, OPTION_COUNT } from '../constants';
import { OPTIONS } from '../database/option';
import { generateRandomInt } from '../util';

export const optionOddsSumTest = () => {
  const sum = OPTIONS.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  console.log(`odds sum: ${sum}`);
  if (sum < 99 || sum > 100) throw Error(`확률 합이 1에 근접하지 않습니다.: ${sum}`);
};

export const optionLengthTest = () => {
  console.log(`option count: ${OPTIONS.length}`);
};

export const safeLockTest = () => {
  if (OPTION_COUNT < FINAL_OPTION_COUNT + ADVICE_COUNT) throw Error('초기 옵션 수는 현자 수와 최종 옵션 수의 합보다 커야 합니다.');
};

export const randomTest = () => {
  console.log(
    Array.from({ length: 10000 })
      .map((_) => generateRandomInt(-200, 200))
      .reduce((acc, cur) => [Math.max(acc[0], cur), Math.min(acc[1], cur)], [0, 2200000])
  );
};
