import { useEffect, useState } from 'react';
import * as S from '../style/index.style';
import { cpu } from '../CPU';

const REFINE_BUTTON_TEXT = '효과 정제';

const getAdviceRerollButtonText = (chance: number) => `다른 조언 보기 (${chance}회 남음)`;

const MaterialSectionText = {
  SELECT_OPTION: '엘릭서에 정제할 효과를 위 항목에서 선택하세요.',
};

interface Sage {
  SELECT_OPTION_DIALOGUE_END: string;
}

const sages: Sage[] = [{ SELECT_OPTION_DIALOGUE_END: '효과를 정제하는건 어때?' }, { SELECT_OPTION_DIALOGUE_END: '효과를 정제하는건 어떤가?' }, { SELECT_OPTION_DIALOGUE_END: '효과를 정제하는건 어때요?' }];

interface AdviceTextProps {
  elixirOption: ElixirInstance;
  sage: Sage;
}
const AdviceText = ({ elixirOption, sage }: AdviceTextProps) => {
  const { name, type, part } = elixirOption;
  return (
    <div style={{ height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
      <div>
        <span>{`${name}${type ? ` (${type})` : ''}`}</span>
        <span>{` ${sage.SELECT_OPTION_DIALOGUE_END}`}</span>
      </div>
      <div>{`(${part ? `${part} 전용` : '공용'})`}</div>
    </div>
  );
};

const Gold = ({ amount }: { amount: number }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{amount}</span>
      <img src="image/gold.png" style={{ width: '16px', height: '16px' }} />
    </div>
  );
};

const OPTION_COUNT = 5;

const Home = () => {
  const [selectedAdviceIndex, setSelectedAdviceIndex] = useState<number>(null);
  const handleAdviceClick = (e: React.MouseEvent, idx: number) => {
    setSelectedAdviceIndex(idx);
    new Audio('sound/click.mp3').play();
  };
  const [elixirOptions, setElixirOptions] = useState<ElixirInstance[]>([]);
  const [pickOptionChance, setPickOptionChance] = useState(OPTION_COUNT);
  const [selectedOptions, setSelectedOptions] = useState<ElixirInstance[]>([]);

  useEffect(() => {
    cpu.init();
  }, []);

  useEffect(() => {
    setElixirOptions(cpu.drawOptions());
  }, [pickOptionChance]);

  const handleRefineButtonClick = () => {
    if (pickOptionChance) {
      const id = elixirOptions[selectedAdviceIndex].id;
      const option = cpu.pickOption(id);
      setSelectedOptions((selectedOptions) => selectedOptions.concat(option));
      setSelectedAdviceIndex(null);
      setPickOptionChance(pickOptionChance - 1);
    }
  };

  return (
    <S.Home>
      <S.MainSection>
        <S.ElixirOptionSection>
          {selectedOptions.map(({ name, level, hitRate, bigHitRate }) => (
            <S.ElixirOption>
              <div>{`${name} (${level} 활성화)`}</div>
              <div>{`선택 확률: ${hitRate}%`}</div>
              <div>{`대성공 확률: ${bigHitRate}%`}</div>
            </S.ElixirOption>
          ))}
          {Array.from({ length: OPTION_COUNT - selectedOptions.length }).map((_) => (
            <S.ElixirOption />
          ))}
        </S.ElixirOptionSection>
        <S.AdviceSection>
          {elixirOptions.map((advice, idx) => (
            <S.Advice onClick={(e) => handleAdviceClick(e, idx)} selected={selectedAdviceIndex === idx}>
              {pickOptionChance > 0 && <AdviceText elixirOption={elixirOptions[idx]} sage={sages[idx]} />}
            </S.Advice>
          ))}
          <S.AdviceRerollButton>{getAdviceRerollButtonText(2)}</S.AdviceRerollButton>
        </S.AdviceSection>
      </S.MainSection>
      <S.DescriptionSection>
        <S.MaterialSection>
          <S.MaterialSectionText>{MaterialSectionText.SELECT_OPTION}</S.MaterialSectionText>
          <S.MaterialInfo>
            <S.MaterialInfoSubSection>
              <label>필요 재료</label>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <img style={{ width: '30px', height: '30px', background: '#0b2447' }} src="image/material.png" />
                  </div>
                  <div style={{ flex: 4, padding: '0.5rem' }}>안정된 연성 촉매</div>
                  <div style={{ flex: 4, padding: '0.5rem', textAlign: 'right' }}>413 / 5</div>
                </div>
              </div>
            </S.MaterialInfoSubSection>
            <S.VerticalRule height="3rem" />
            <S.MaterialInfoSubSection>
              <label>필요 비용</label>
              <div style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>정제 비용</div>
                  <Gold amount={280} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>소지 금액</div>
                  <Gold amount={26741} />
                </div>
              </div>
            </S.MaterialInfoSubSection>
          </S.MaterialInfo>
        </S.MaterialSection>
        <S.RefineButton onClick={handleRefineButtonClick}>{REFINE_BUTTON_TEXT}</S.RefineButton>
      </S.DescriptionSection>
    </S.Home>
  );
};

export default Home;
