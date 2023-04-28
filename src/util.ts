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
