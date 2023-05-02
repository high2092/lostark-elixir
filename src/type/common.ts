export const AlchemyStatuses = {
  REFINE: 'refine', // 정제
  ADVICE: 'advice', // 조언
  ALCHEMY: 'alchemy', // 연성
  COMPLETE: 'complete',
} as const;

export type AlchemyStatus = (typeof AlchemyStatuses)[keyof typeof AlchemyStatuses];
