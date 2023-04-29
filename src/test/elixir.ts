import { ELIXIRS } from '../database/elixir';

export const elixirOddsSumTest = () => {
  const sum = ELIXIRS.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  console.log(`odds sum: ${sum}`);
  if (sum < 99 || sum > 100) throw Error(`확률 합이 1에 근접하지 않습니다.: ${sum}`);
};

export const elixirLengthTest = () => {
  console.log(`elixir count: ${ELIXIRS.length}`);
};
