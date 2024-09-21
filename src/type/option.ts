export type OptionType = '혼돈' | '질서';

export interface Option {
  id: number;
  name: string;
  type?: OptionType;
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

export interface OptionResult {
  name: string;
  type?: OptionType;
  level: number;
}

export interface AlchemyResult {
  options: OptionInstance[];
  bigHit: boolean;
}
