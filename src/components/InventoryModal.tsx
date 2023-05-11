import * as S from './InventoryModal.style';
import { PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { useAppSelector } from '../store';
import { ElixirIcon } from './ElixirIcon';
import { useEffect, useState } from 'react';
import { OptionResult } from '../type/option';
import { cutThousandUnit, getActivationByLevel, getOptionName } from '../util';
import { IconButton } from './common/IconButton';
import { SwitchIcon } from './SwitchIcon';

export const InventoryModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<InventoryModalContent />} zIndex={zIndex} />;
};

const InventoryModalContent = () => {
  const { usedGold, usedCatalyst, elixirs } = useAppSelector((state) => state.result);
  const { resetCount } = useAppSelector((state) => state.ui);
  const [hoveredIndex, setHoveredIndex] = useState<number>(null);
  const [listView, setListView] = useState(false);

  useEffect(() => {
    const reset = () => {
      setHoveredIndex(null);
    };

    window.addEventListener('mouseover', reset);
    return () => window.removeEventListener('mouseover', reset);
  }, []);

  const handleElixirMouseOver = (e: React.MouseEvent, idx: number) => {
    e.stopPropagation();
    setHoveredIndex(idx);
  };

  const handleSwitchButtonClick = () => {
    setHoveredIndex(null);
    setListView(!listView);
  };

  return (
    <S.InventoryModal>
      <S.InventoryContainer>
        {listView ? (
          <S.ListViewInventory>
            {elixirs.map((elixir) => (
              <S.ListViewElixir>
                {elixir.options.map((option) => (
                  <ElixirOption {...option} />
                ))}
              </S.ListViewElixir>
            ))}
          </S.ListViewInventory>
        ) : (
          <S.Inventory>
            {elixirs.map((elixir, idx) => (
              <S.Elixir hover={hoveredIndex === idx} onMouseOver={(e) => handleElixirMouseOver(e, idx)}>
                <ElixirIcon />
              </S.Elixir>
            ))}
          </S.Inventory>
        )}
        <S.BottomSection>
          <S.UsageInfo>
            <div>사용한 엘릭서: {1 + resetCount}</div>
            <div>사용한 골드: {cutThousandUnit(usedGold)}</div>
            <div>사용한 연성 촉매: {usedCatalyst}</div>
          </S.UsageInfo>
          <IconButton onClick={handleSwitchButtonClick}>
            <SwitchIcon />
          </IconButton>
        </S.BottomSection>
      </S.InventoryContainer>
      <S.ElixirInfoModalContainer>
        {elixirs[hoveredIndex] !== undefined && (
          <S.ElixirInfoModal>
            {elixirs[hoveredIndex].options.map((elixir) => (
              <ElixirOption {...elixir} />
            ))}
          </S.ElixirInfoModal>
        )}
      </S.ElixirInfoModalContainer>
    </S.InventoryModal>
  );
};

const ElixirOption = (option: OptionResult) => {
  return (
    <div style={{ display: 'flex', width: '8rem' }}>
      <div style={{ flex: 9 }}>{getOptionName(option)}</div>
      <div style={{ flex: 1 }}>{getActivationByLevel(option.level)}</div>
    </div>
  );
};
