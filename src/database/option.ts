import { Option } from '../type/option';

const _OPTIONS: Omit<Option, 'id'>[] = [
  { name: '강맹', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '달인', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '선각자', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '선봉대', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '신념', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '진군', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '칼날 방패', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '행운', type: '질서', part: '투구', odds: 0.555555555555555 },
  { name: '회심', type: '질서', part: '투구', odds: 0.555555555555555 },

  { name: '각성기 피해', part: '어깨', odds: 1.25 },
  { name: '보스 피해', part: '어깨', odds: 1.25 },
  { name: '보호막 강화', part: '어깨', odds: 1.25 },
  { name: '회복 강화', part: '어깨', odds: 1.25 },

  { name: '마법 방어력', part: '상의', odds: 1.25 },
  { name: '물리 방어력', part: '상의', odds: 1.25 },
  { name: '받는 피해 감소', part: '상의', odds: 1.25 },
  { name: '최대 생명력', part: '상의', odds: 1.25 },

  { name: '아군 강화', part: '하의', odds: 1.25 },
  { name: '아이덴티티 획득', part: '하의', odds: 1.25 },
  { name: '추가 피해', part: '하의', odds: 1.25 },
  { name: '치명타 피해', part: '하의', odds: 1.25 },

  { name: '강맹', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '달인', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '선각자', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '선봉대', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '신념', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '진군', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '칼날 방패', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '행운', type: '혼돈', part: '장갑', odds: 0.555555555555555 },
  { name: '회심', type: '혼돈', part: '장갑', odds: 0.555555555555555 },

  { name: '공격력', odds: 2.5 },
  { name: '마나', odds: 7.5 },
  { name: '무기 공격력', odds: 2.5 },
  { name: '무력화', odds: 7.5 },
  { name: '물약 중독', odds: 7.5 },
  { name: '힘/민첩/지능', odds: 2.5 },
  { name: '방랑자', odds: 7.5 },
  { name: '생명의 축복', odds: 7.5 },
  { name: '자원의 축복', odds: 7.5 },
  { name: '탈출의 달인', odds: 7.5 },
  { name: '폭발물 달인', odds: 7.5 },
  { name: '회피의 달인', odds: 7.5 },
];

export const OPTIONS: Option[] = _OPTIONS.map((option, i) => ({ ...option, id: i + 1 }));
