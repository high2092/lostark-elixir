export interface Option {
  name: string;
  type?: '혼돈' | '질서';
  part?: '투구' | '상의' | '하의' | '어깨' | '장갑';
  odds: number;
}

type AlchemyStatusText = '연성 대성공' | '연성 성공' | '연성 단계 상승' | '연성 단계 하락';

export interface OptionInstanceBody extends Option {
  level: number;
  locked: boolean;
  hitRate: number;
  bigHitRate: number;
  statusText: AlchemyStatusText;

  tempHitRate: number;
  tempBigHitRate: number;

  backUpHitRate: number;
  isMaxLevel: boolean;
}

export interface OptionInstance extends OptionInstanceBody {
  id: number;
}
