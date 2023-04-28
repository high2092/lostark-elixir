interface Elixir {
  name: string;
  type?: '혼돈' | '질서';
  part?: '투구' | '상의' | '하의' | '어깨' | '장갑';
  odds: number;
}

type AlchemyStatusText = '연성 대성공' | '연성 성공' | '연성 단계 상승' | '연성 단계 하락';

interface ElixirInstance extends Elixir {
  id: number;
  level: number;
  locked: boolean;
  hitRate: number;
  bigHitRate: number;
  statusText: AlchemyStatusText;
  nextHitRate: number;
  nextBigHitRate: number;
}

type AdviceEffect = (beforeElixirs: ElixirInstance[], optionIdx?: number) => ElixirInstance[];

interface AdviceParam {
  optionIndex?: number;
  n?: number;
}

type AdviceType = 'potential' | 'util';
type SageName = '루베도' | '비르디타스' | '치트리니';
interface Advice {
  type: AdviceType;
  special?: SageType;
  sage?: SageName;
  name: string;
  effect: (param?: AdviceParam) => AdviceEffect;
  odds: number;
}

interface IAdviceInstance extends Advice {
  execute: AdviceEffect;
}
