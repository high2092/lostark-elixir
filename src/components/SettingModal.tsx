import * as S from './SettingModal.style';
import { PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { CheckBox } from './CheckBox';
import { useAppDispatch, useAppSelector } from '../store';
import { setChecked } from '../features/uiSlice';
import { useEffect } from 'react';

export const SettingModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<SettingModalContent />} zIndex={zIndex} />;
};

function SettingModalContent() {
  const { hideBackgroundImage } = useAppSelector((state) => state.ui);
  const dispatch = useAppDispatch();

  return (
    <S.SettingModal>
      <CheckBox checked={hideBackgroundImage} setChecked={(checked: boolean) => dispatch(setChecked(checked))} />
      <label>배경 제거</label>
    </S.SettingModal>
  );
}
