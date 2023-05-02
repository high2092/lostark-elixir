import { DEFAULT_BIG_HIT_RATE_PERCENT, FINAL_OPTION_COUNT, MAX_ACTIVE, OPTION_COUNT, Placeholders, SageTypes } from './constants';
import { Advice, AdviceType } from './type/advice';
import { OddsKey } from './type/common';
import { Elixir, ElixirInstance, ElixirInstanceBody } from './type/elixir';
import { Sage, SageTemplate, SageTypesType } from './type/sage';

type FilterCondition = (elem: Record<string, any>, idx: number) => boolean;

interface GachaProps {
  oddsKey?: OddsKey;
  count?: number;
  filterConditions?: FilterCondition[];
  locked?: boolean;
}

export const gacha = (arr: Record<string, any>[], props?: GachaProps) => {
  props ??= {};
  let { oddsKey, count, filterConditions, locked } = props;
  count ??= 1;
  filterConditions ??= [];

  filterConditions.push((elem) => !elem.locked === !locked);

  const _arr = arr.map((elem, idx) => {
    const copy = { ...elem };
    const pass = filterConditions.reduce((acc, cur) => {
      return acc && cur(copy, idx);
    }, true);
    copy.odds = pass === false ? 0 : oddsKey ? elem[oddsKey] : 1;
    return copy;
  });

  const result: number[] = [];
  // Q: 가능성은 0에 가깝겠지만, 4개 봉인된 상태에서 2개 뽑아야 하는 상황이 생긴다면 어떻게 할 것인가

  if (count > _arr.length) throw new Error('gacha: Given count is greater than arr length.');
  for (let i = 0; i < count; i++) {
    const idx = gachaInternal(_arr);
    result.push(idx);
    _arr.splice(idx, 1, { ..._arr[idx], odds: 0 });
  }

  return result;
};

const gachaInternal = (arr: Record<string, any>[]) => {
  const oddsSum = arr.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  if (oddsSum === 0) throw new Error('gacha: 뽑을 수 있는 아이템이 없습니다.');

  const randomNumber = generateRandomNumber(0, oddsSum);

  let oddsCur = 0;
  for (let i = 0; i < arr.length; i++) {
    const { odds } = arr[i];
    if (randomNumber <= (oddsCur += odds)) {
      return i;
    }
  }

  throw new Error('gacha: [bug] result was not returned');
};

export const calculateOddsSum = <T>(arr: T[], oddsKey: OddsKey) => {
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

export const isFullStack = (sage: Sage) => {
  return sage.stack === SageTypes[sage.type]?.fullStack;
};

const REFINE_SUCCESS_SOUND_VOLUME = 0.1;
export const playRefineSuccessSound = () => {
  const audio = new Audio('/sound/refine-success.mp3');
  audio.volume = REFINE_SUCCESS_SOUND_VOLUME;
  audio.play();
};

const REFINE_FAILURE_SOUND_VOLUME = 0.1;
export const playRefineFailureSound = () => {
  const audio = new Audio('/sound/refine-failure.mp3');
  audio.volume = REFINE_FAILURE_SOUND_VOLUME;
  audio.play();
};

const CLICK_SOUND_VOLUME = 0.1;
export const playClickSound = () => {
  const audio = new Audio('/sound/click.mp3');
  audio.volume = CLICK_SOUND_VOLUME;
  audio.play();
};

export const convertToSignedString = (n: number) => {
  if (n > 0) return `+${n}`;
  return `${n}`;
};

export const getLockedCount = (elixirs: ElixirInstance[]) => {
  return elixirs.reduce((acc, { locked }) => acc + Number(locked), 0);
};

export function createSage(template: SageTemplate): Sage {
  return {
    name: template.name,
    type: null,
    dialogueEnds: template.dialogueEnds,
    stack: 0,
    viewStack: null,
    advice: null,
    elixir: null,
    meditation: false,
  };
}

export function replaceOptionPlaceholder(advice: Advice, elixirs: ElixirInstance[]) {
  const option = elixirs[advice.optionIndex];
  const subOption = elixirs[advice.subOptionIndex];
  advice.name = advice.name.replaceAll(Placeholders.OPTION, getOptionName(option)).replaceAll(Placeholders.SUB_OPTION, getOptionName(subOption));
}

export function getOptionName(option: ElixirInstance) {
  if (!option) return 'null';
  return `${option.name}${option.type ? ` (${option.type})` : ''}`;
}

/**
 *
 * @param min 실수
 * @param max 실수
 * @returns min 이상 max 미만의 실수
 */
export function generateRandomNumber(min: number, max: number) {
  const randomValue = new Uint32Array(1);
  window.crypto.getRandomValues(randomValue);
  return min + (randomValue[0] / 0xffffffff) * (max - min);
}

/**
 *
 * @param min 정수
 * @param max 정수
 * @returns min 이상 max 미만의 정수
 */
export function generateRandomInt(min: number, max: number) {
  return Math.floor(generateRandomNumber(min, max));
}

export function getHitRate(option: ElixirInstance) {
  if (option.tempHitRate !== null) return option.tempHitRate;
  return option.hitRate;
}

export function getBigHitRate(option: ElixirInstance) {
  if (option.tempBigHitRate !== null) return option.tempBigHitRate;
  return option.bigHitRate;
}

export function createElixirInstanceBody(elixir: Elixir): ElixirInstanceBody {
  return {
    ...elixir,
    level: 0,
    locked: false,
    hitRate: 100 / OPTION_COUNT,
    bigHitRate: DEFAULT_BIG_HIT_RATE_PERCENT,
    tempHitRate: null,
    tempBigHitRate: null,
    statusText: null,
    backUpHitRate: null,
    isMaxLevel: false,
  };
}
interface ApplyAdviceProps {
  level?: number;
  hitRate?: number;
  bigHitRate?: number;
  tempHitRate?: number;
  tempBigHitRate?: number;
}

function getSafeResult(props: ApplyAdviceProps) {
  const { level, hitRate, bigHitRate, tempHitRate, tempBigHitRate } = props;

  const result: ApplyAdviceProps = {};

  if (level !== undefined) result.level = Math.max(Math.min(level, MAX_ACTIVE), 0);
  if (hitRate !== undefined) result.hitRate = Math.max(Math.min(hitRate, 100), 0);
  if (bigHitRate !== undefined) result.bigHitRate = Math.max(Math.min(bigHitRate, 100), 0);
  if (tempHitRate !== undefined) result.tempHitRate = Math.max(Math.min(tempHitRate, 100), 0);
  if (tempBigHitRate !== undefined) result.tempBigHitRate = Math.max(Math.min(tempBigHitRate, 100), 0);

  return result;
}

export function applySafeResult(option: ElixirInstance, props: ApplyAdviceProps) {
  if (option.locked) return;

  const result = getSafeResult(props);
  const { level, hitRate, bigHitRate, tempHitRate, tempBigHitRate } = result;

  if (level !== undefined) option.level = level;
  if (hitRate !== undefined) option.hitRate = hitRate;
  if (bigHitRate !== undefined) option.bigHitRate = bigHitRate;
  if (tempHitRate !== undefined) option.tempHitRate = tempHitRate;
  if (tempBigHitRate !== undefined) option.tempBigHitRate = tempBigHitRate;
}

function handleReachMaxLevel(idx: number, elixirs: ElixirInstance[]) {
  const target = elixirs[idx];
  const backUpHitRate = (target.backUpHitRate = target.hitRate);
  const unlockedCount = OPTION_COUNT - getLockedCount(elixirs);
  elixirs.forEach((option, i) => {
    if (idx === i) applySafeResult(option, { hitRate: 0 });
    else applySafeResult(option, { hitRate: option.hitRate + backUpHitRate / (unlockedCount - 1) });
  });
}

function handleDemotedFromMaxLevel(idx: number, elixirs: ElixirInstance[]) {
  const target = elixirs[idx];
  const unlockedCount = OPTION_COUNT - getLockedCount(elixirs);
  elixirs.forEach((option, i) => {
    if (idx === i) applySafeResult(option, { hitRate: target.backUpHitRate });
    else applySafeResult(option, { hitRate: option.hitRate - target.backUpHitRate / (unlockedCount - 1) });
  });
}

export function checkMaxLevel(elixirs: ElixirInstance[]) {
  elixirs.forEach((option, idx) => {
    if (!option.isMaxLevel && option.level === MAX_ACTIVE) {
      handleReachMaxLevel(idx, elixirs);
      option.isMaxLevel = true;
    } else if (option.isMaxLevel && option.level !== MAX_ACTIVE) {
      handleDemotedFromMaxLevel(idx, elixirs);
      option.isMaxLevel = false;
    }
  });
}

export function recalculateHitRate(elixirs: ElixirInstance[]) {
  const unlocked = elixirs.filter((elixir) => !elixir.locked);
  const hitRateSum = calculateOddsSum(unlocked, 'hitRate') / 100;
  const tempHitRateSum = calculateOddsSum(unlocked, 'tempHitRate') / 100;

  elixirs.forEach((option) => {
    option.hitRate /= hitRateSum;
    if (tempHitRateSum) option.tempHitRate /= tempHitRateSum;
  });
}

interface RequireLockParameter {
  remainChance: number;
  lockedCount: number;
  extraChanceConsume?: number;
  adviceType: AdviceType;
}

export function requireLock({ remainChance, lockedCount, extraChanceConsume, adviceType }: RequireLockParameter) {
  extraChanceConsume ??= 0;
  return remainChance - extraChanceConsume <= OPTION_COUNT - FINAL_OPTION_COUNT - lockedCount - Number(adviceType === 'utillock');
}

export function getMinLevel(elixirs: ElixirInstance[]) {
  return elixirs.reduce((acc, cur) => {
    if (!cur.locked) Math.min(acc, cur.level);
    return acc;
  }, MAX_ACTIVE);
}
