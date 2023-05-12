import * as S from './SettingModal.style';
import { ModalTypes, PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { CheckBox } from './CheckBox';
import { useAppDispatch, useAppSelector } from '../store';
import { setHideBackgroundImage } from '../features/uiSlice';
import { setMuteSoundEffect } from '../features/elixirSlice';
import { openModal } from '../features/modalSlice';

export const SettingModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<SettingModalContent />} zIndex={zIndex} />;
};

const HIDE_BACKGROUND_IMAGE_CHECKBOX_ID = 'hideBackgroundImage';
const MUTE_SOUND_EFFECT_CHECKBOX_ID = 'muteSoundEffect';

function SettingModalContent() {
  const { hideBackgroundImage } = useAppSelector((state) => state.ui);
  const { muteSoundEffect } = useAppSelector((state) => state.elixir);
  const dispatch = useAppDispatch();

  const handlePatchNoteOpenButtonClick = () => {
    dispatch(openModal(ModalTypes.PATCH_NOTE));
  };

  return (
    <S.SettingModal>
      <div>
        <CheckBox id={HIDE_BACKGROUND_IMAGE_CHECKBOX_ID} checked={hideBackgroundImage} setChecked={(checked: boolean) => dispatch(setHideBackgroundImage(checked))} />
        <label htmlFor={HIDE_BACKGROUND_IMAGE_CHECKBOX_ID}>배경 제거</label>
      </div>
      <div>
        <CheckBox id={MUTE_SOUND_EFFECT_CHECKBOX_ID} checked={muteSoundEffect} setChecked={(checked: boolean) => dispatch(setMuteSoundEffect(checked))} />
        <label htmlFor={MUTE_SOUND_EFFECT_CHECKBOX_ID}>효과음 음소거</label>
      </div>
      <S.PatchNoteOpenButton onClick={handlePatchNoteOpenButtonClick}>패치 노트 보기</S.PatchNoteOpenButton>
    </S.SettingModal>
  );
}
