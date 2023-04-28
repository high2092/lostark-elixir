export interface Elixir {
  name: string;
  type?: '혼돈' | '질서';
  part?: '투구' | '상의' | '하의' | '어깨' | '장갑';
  odds: number;
}

type AlchemyStatusText = '연성 대성공' | '연성 성공' | '연성 단계 상승' | '연성 단계 하락';

export interface ElixirInstance extends Elixir {
  id: number;
  level: number;
  locked: boolean;
  hitRate: number;
  bigHitRate: number;
  statusText: AlchemyStatusText;
  nextHitRate: number;
  nextBigHitRate: number;
}
