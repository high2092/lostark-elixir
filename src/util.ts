import { DEFAULT_BIG_HIT_RATE_PERCENT, FINAL_OPTION_COUNT, MAX_ACTIVE, OPTION_COUNT, Placeholders, SageTypes } from './constants';
import { NoOptionSelectedError } from './error/NoOptionSelectedError';
import { store } from './store';
import { Advice, AdviceType } from './type/advice';
import { OddsKey } from './type/common';
import { Option, OptionInstance, OptionInstanceBody, OptionResult } from './type/option';
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
    if (idx === null) return result;
    result.push(idx);
    _arr.splice(idx, 1, { ..._arr[idx], odds: 0 });
  }

  return result;
};

const gachaInternal = (arr: Record<string, any>[]) => {
  const oddsSum = arr.reduce((acc, { odds }) => {
    return acc + odds;
  }, 0);

  if (oddsSum === 0) return null;

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
  if (!isExist(idx)) throw new NoOptionSelectedError();
  if (typeof idx !== 'number') throw Error();
  if (idx < 0 || idx >= OPTION_COUNT) throw new Error();
  return;
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
  const { muteSoundEffect } = store.getState().elixir;
  if (muteSoundEffect) return;
  const audio = new Audio('/sound/click.mp3');
  audio.volume = CLICK_SOUND_VOLUME;
  audio.play();
};

export const convertToSignedString = (n: number) => {
  if (n > 0) return `+${n}`;
  return `${n}`;
};

export const getLockedCount = (options: OptionInstance[]) => {
  return options.reduce((acc, { locked }) => acc + Number(locked), 0);
};

export const getLockedOrMaxLevelCount = (options: OptionInstance[]) => {
  return options.reduce((acc, { locked, isMaxLevel }) => acc + Number(locked || isMaxLevel), 0);
};

export function createSage(template: SageTemplate): Sage {
  return {
    name: template.name,
    type: null,
    dialogueEnds: template.dialogueEnds,
    stack: 0,
    viewStack: null,
    advice: null,
    option: null,
    meditation: false,
  };
}

export function replaceOptionPlaceholder(advice: Advice, options: OptionInstance[]) {
  const option = options[advice.optionIndex];
  const subOption = options[advice.subOptionIndex];
  advice.name = advice.name.replaceAll(Placeholders.OPTION, getOptionName(option)).replaceAll(Placeholders.SUB_OPTION, getOptionName(subOption));
}

export function getOptionName(option: OptionResult) {
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

export function getHitRate(option: OptionInstance) {
  if (option.tempHitRate !== null) return option.tempHitRate;
  return option.hitRate;
}

export function getBigHitRate(option: OptionInstance) {
  if (option.tempBigHitRate !== null) return option.tempBigHitRate;
  return option.bigHitRate;
}

export function createOptionInstanceBody(option: Option): OptionInstanceBody {
  return {
    ...option,
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

export function extractOptionDefaultProps({ id, name, type, part, odds }: OptionInstance): Option {
  return { id, name, type, part, odds };
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

export function applySafeResult(option: OptionInstance, props: ApplyAdviceProps) {
  if (option.locked) return;

  const result = getSafeResult(props);
  const { level, hitRate, bigHitRate, tempHitRate, tempBigHitRate } = result;

  if (level !== undefined) option.level = level;

  if (bigHitRate !== undefined) option.bigHitRate = bigHitRate;
  if (tempBigHitRate !== undefined) option.tempBigHitRate = tempBigHitRate;

  if (option.isMaxLevel) return;

  if (hitRate !== undefined) option.hitRate = hitRate;
  if (tempHitRate !== undefined) option.tempHitRate = tempHitRate;
}

export function redistribute(options: OptionInstance[], levelSum?: number) {
  if (levelSum === undefined) {
    levelSum = options.reduce((acc, cur) => {
      if (!cur.locked) {
        acc += cur.level;
        cur.level = 0;
      }
      return acc;
    }, 0);
  }

  while (levelSum) {
    const [idx] = gacha(options, { filterConditions: [(option: OptionInstance) => option.level !== MAX_ACTIVE] });
    if (idx === undefined) break;
    options[idx].level++;
    levelSum--;
  }
}

export function lockOption(options: OptionInstance[], idx: number) {
  const target = options[idx];
  target.locked = true;
  changeHitRate(idx, -target.hitRate, options, { lock: true });
}

export function unlockOption(options: OptionInstance[], idx: number) {
  const target = options[idx];
  changeHitRate(idx, target.hitRate, options, { lock: true });
  target.locked = false;
}

interface ChangeHitRateProps {
  lock?: boolean; // lock, unlock 시에만 true
  temp?: boolean; // 이번 연성에만 적용
}

export function changeHitRate(idx: number, hitRateDiff: number, options: OptionInstance[], props?: ChangeHitRateProps) {
  props ??= {};
  const { lock, temp } = props;
  const remainHitRateSum = options.reduce((acc, cur, i) => (idx === i || cur.locked || cur.isMaxLevel ? acc : acc + cur.hitRate), 0);
  const remainOptionCount = options.reduce((acc, cur, i) => (idx === i || cur.locked || cur.isMaxLevel ? acc : acc + 1), 0);
  const hitRateKey = temp ? 'tempHitRate' : 'hitRate';

  const target = options[idx];
  const actualHitRateDiff = getSafeResult({ [hitRateKey]: target.hitRate + hitRateDiff })[hitRateKey] - target.hitRate;

  options.forEach((option, i) => {
    if (option.isMaxLevel) return;
    if (idx === i) applySafeResult(option, { [hitRateKey]: option.hitRate + actualHitRateDiff });
    else {
      if (lock && actualHitRateDiff < 0) applySafeResult(option, { [hitRateKey]: option.hitRate - actualHitRateDiff / remainOptionCount });
      else applySafeResult(option, { [hitRateKey]: option.hitRate - actualHitRateDiff * (option.hitRate / remainHitRateSum) });
    }
  });
}

export function checkMaxLevel(options: OptionInstance[]) {
  // backUpHitRate 복원과 활성도 만렙 달성으로 인한 확률 분배는 순서가 중요하며, 복원이 먼저 이루어져야 함
  options.forEach((option, idx) => {
    if (option.isMaxLevel && option.level !== MAX_ACTIVE) {
      option.isMaxLevel = false;
      changeHitRate(idx, option.backUpHitRate, options);
    }
  });

  options.forEach((option, idx) => {
    if (!option.isMaxLevel && option.level === MAX_ACTIVE) {
      option.backUpHitRate = option.hitRate;
      changeHitRate(idx, -option.hitRate, options);
      option.isMaxLevel = true;
    }
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

export function getMinLevel(options: OptionInstance[]) {
  return options.reduce((acc, cur) => {
    if (!cur.locked) acc = Math.min(acc, cur.level);
    return acc;
  }, MAX_ACTIVE);
}

export function getMaxLevel(options: OptionInstance[]) {
  return options.reduce((acc, cur) => {
    if (!cur.locked) acc = Math.max(acc, cur.level);
    return acc;
  }, 0);
}

export function cutThousandUnit(amount: number) {
  return amount.toLocaleString();
}

export function getActivationByLevel(level: number) {
  if (level >= 10) return 5;
  if (level >= 9) return 4;
  if (level >= 8) return 3;
  if (level >= 6) return 2;
  if (level >= 3) return 1;
  return 0;
}

export function isExist(obj: any) {
  return obj !== null && obj !== undefined;
}

export function checkBreakCriticalPoint(prev: OptionInstance[], next: OptionInstance[]) {
  const CRITICAL_POINT = MAX_ACTIVE;
  for (let i = 0; i < OPTION_COUNT; i++) {
    if (prev[i].level < CRITICAL_POINT && next[i].level >= CRITICAL_POINT) return true;
  }
  return false;
}

export function checkEarlyComplete(options: OptionInstance[]) {
  for (const { level, locked } of options) {
    if (!locked && level < MAX_ACTIVE) return false;
  }
  if (getLockedCount(options) !== OPTION_COUNT - FINAL_OPTION_COUNT) return false;
  return true;
}

export function convertLocalTimeString(timeString: string) {
  const date = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);
  date.setHours(hours);
  date.setMinutes(minutes);
  return date.toLocaleTimeString('ko-KR', { hour12: true, hour: 'numeric', minute: 'numeric' });
}

export const isContradict = (advices: Advice[], uniqueKey: string) => {
  if (!uniqueKey) return false;
  return advices.find((advice) => advice.uniqueKey === uniqueKey) !== undefined;
};
