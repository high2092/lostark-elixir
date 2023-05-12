interface PatchDetail {
  time: string;
  description: string;
}

export interface Patch {
  date: string;
  details: PatchDetail[];
}

export const PATCH_NOTE: Patch[] = [
  {
    date: '2023-05-12',
    details: [
      { time: '10:58', description: '패치 노트가 추가되었습니다.' },
      { time: '10:58', description: '일부 상황에서 연성 확률 일시 증가가 적용되지 않던 문제가 해결되었습니다.' },
    ],
  },
  {
    date: '2023-05-11',
    details: [
      { time: '18:54', description: '효과음 음소거 기능이 추가되었습니다.' },
      { time: '17:13', description: '배경 제거 기능이 추가되었습니다.' },
    ],
  },
];