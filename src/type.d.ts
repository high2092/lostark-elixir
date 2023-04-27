interface Elixir {
  name: string;
  type?: '혼돈' | '질서';
  part?: '투구' | '상의' | '하의' | '어깨' | '장갑';
  odds: number;
}

interface ElixirInstance extends Elixir {
  id: number;
  level: number;
  locked: boolean;
}

type ChoiceEffect = (optionIdx: number) => ElixirInstance[];
type AdviceResult = ElixirInstance[] | ChoiceEffect;
interface AdviceParameter {
  optionIdx?: number;
}

interface Advice {
  name: string;
  effect: (beforeElixirs: ElixirInstance[], parameter?: AdviceParameter) => () => AdviceResult;
  odds: number;
}

interface IAdviceInstance extends Advice {
  execute: () => AdviceResult;
}
