import { OPTION_COUNT, SageTypes } from './constants';
import { SageInstance, SageTypesType, SageTypesTypes } from './type/sage';

export const gacha = <T>(arr: T[], oddsKey: 'odds' | 'hitRate') => {
  const oddsSum = arr.reduce((acc, cur) => {
    const odds = cur[oddsKey];
    if (typeof odds !== 'number') throw new Error('gacha: Given odds key has value that is not a number.');
    return acc + odds;
  }, 0);
  const randomNumber = Math.random() * oddsSum;

  let oddsCur = 0;
  for (let i = 0; i < arr.length; i++) {
    const odds = arr[i][oddsKey];
    if (randomNumber <= (oddsCur += odds)) {
      return i;
    }
  }

  throw new Error('gacha: [bug] result was not returned');
};

export const calculateOddsSum = <T>(arr: T[], oddsKey: 'odds' | 'hitRate') => {
  return arr.reduce((acc, cur) => {
    const odds = cur[oddsKey];
    return acc + odds;
  }, 0);
};

export const getStackForDisplaying = (type: SageTypesType, stack: number) => {
  if (!type) return null;
  if (stack === 0) return SageTypes[type].fullStack;
  return stack;
};

export const validateOptionIndex = (idx: number) => {
  if (typeof idx !== 'number') throw new Error();
  if (idx < 0 || idx >= OPTION_COUNT) throw new Error();
};

export const isFullStack = (type: SageTypesType, stack: number) => {
  return stack === SageTypes[type]?.fullStack;
};

export const playRefineSuccessSound = () => new Audio('/sound/refine-success.mp3').play();
export const playRefineFailureSound = () => new Audio('/sound/refine-failure.mp3').play();
export const playClickSound = () => new Audio('sound/click.mp3').play();
