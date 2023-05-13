export const AlchemyStatuses = {
  REFINE: 'refine', // 정제
  ADVICE: 'advice', // 조언
  ALCHEMY: 'alchemy', // 연성
  COMPLETE: 'complete',
} as const;

export type AlchemyStatus = (typeof AlchemyStatuses)[keyof typeof AlchemyStatuses];

export type OddsKey = 'odds' | 'hitRate' | 'tempHitRate';

export const ModalTypes = {
  INVENTORY: 'inventory',
  SETTING: 'setting',
  PATCH_NOTE: 'patchNote',
  PWA_HELP_IOS: 'pwaHelpIOS',
} as const;

export type ModalType = (typeof ModalTypes)[keyof typeof ModalTypes];

export interface PreparedModalProps {
  zIndex: number;
}
