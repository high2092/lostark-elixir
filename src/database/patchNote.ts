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
    date: '2023-08-26',
    details: [
      { time: '22:03', description: '<1, 3, 5 ↔ 2,4 슬롯 효과 단계 교환> 조언의 패널티가 1에서 2로 변경되었습니다.' },
      { time: '22:01', description: '누락되어 있던 <이번 연성 모든 효과 대성공 확률 증가>, <이번 연성 선택한 효과 대성공 확률 증가> 조언이 추가되었습니다.' },
      { time: '00:29', description: '혼돈 6스택 <특정 효과 단계를 모두 다른 효과에 분배> 조언이 특정 상황에서 동작하지 않던 문제가 해결되었습니다.' },
    ],
  },
  {
    date: '2023-06-12',
    details: [{ time: '21:37', description: '<특정 효과 봉인>,  <임의 효과 봉인> 조언이 연성 초반에 나오지 않도록 변경되었습니다.' }],
  },
  {
    date: '2023-05-23',
    details: [
      { time: '00:39', description: '<남은 연성 대성공 확률 10% 증가> 조언 등장 확률이 하향 조정되었습니다.' },
      { time: '00:29', description: '혼돈 6스택 조언에 <특정 효과 단계를 모두 다른 효과에 분배> 조언이 추가되었습니다.' },
    ],
  },
  { date: '2023-05-15', details: [{ time: '16:20', description: '<최고 단계 상승 + 다른 단계 하락> 조언이 연성 초반에 나오지 않도록 변경되었습니다.' }] },
  {
    date: '2023-05-14',
    details: [
      { time: '16:34', description: '혼돈 6스택 조언에 <엘릭서 초기화> 조언이 추가되었습니다.' },
      { time: '01:22', description: '모바일 환경에서 앱처럼 구동할 수 있도록 개선되었습니다. 설정 창에서 앱 설치 방법을 확인하실 수 있습니다.' },
    ],
  },
  {
    date: '2023-05-13',
    details: [{ time: '01:34', description: '각 현자 간 비슷한 조언이 나오지 않도록 변경되었습니다.' }],
  },
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
