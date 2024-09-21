/** @jsxImportSource @emotion/react */
import * as S from './SettingModal.style';
import { PWAPlatformTypes, ModalTypes, PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { CheckBox } from './CheckBox';
import { useAppDispatch, useAppSelector } from '../store';
import { setDownsizeHeight, setHideBackgroundImage } from '../features/uiSlice';
import { setMuteSoundEffect } from '../features/elixirSlice';
import { openModal } from '../features/modalSlice';
import { AnchorStyle } from '../style/common';

export const SettingModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<SettingModalContent />} zIndex={zIndex} />;
};

const HIDE_BACKGROUND_IMAGE_CHECKBOX_ID = 'hideBackgroundImage';
const MUTE_SOUND_EFFECT_CHECKBOX_ID = 'muteSoundEffect';
const DOWNSIZE_HEIGHT_CHECKBOX_ID = 'downsizeHeight';

function SettingModalContent() {
  const { hideBackgroundImage, downsizeHeight } = useAppSelector((state) => state.ui);
  const { muteSoundEffect } = useAppSelector((state) => state.elixir);
  const dispatch = useAppDispatch();

  const handlePatchNoteOpenButtonClick = () => {
    dispatch(openModal({ type: ModalTypes.PATCH_NOTE }));
  };

  return (
    <S.SettingModal>
      <div className="flex gap-1">
        <CheckBox id={HIDE_BACKGROUND_IMAGE_CHECKBOX_ID} checked={hideBackgroundImage} setChecked={(checked: boolean) => dispatch(setHideBackgroundImage(checked))} />
        <label htmlFor={HIDE_BACKGROUND_IMAGE_CHECKBOX_ID}>배경 제거</label>
      </div>
      <div className="flex gap-1">
        <CheckBox id={MUTE_SOUND_EFFECT_CHECKBOX_ID} checked={muteSoundEffect} setChecked={(checked: boolean) => dispatch(setMuteSoundEffect(checked))} />
        <label htmlFor={MUTE_SOUND_EFFECT_CHECKBOX_ID}>효과음 음소거</label>
      </div>
      <div className="flex gap-1">
        <CheckBox id={DOWNSIZE_HEIGHT_CHECKBOX_ID} checked={downsizeHeight} setChecked={(checked: boolean) => dispatch(setDownsizeHeight(checked))} />
        <label htmlFor={DOWNSIZE_HEIGHT_CHECKBOX_ID}>{`높이 축소 (모바일 UI 전용)`}</label>
      </div>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>앱 설치 방법</div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <span css={AnchorStyle} onClick={() => dispatch(openModal({ type: ModalTypes.PWA_HELP_IOS, props: { type: PWAPlatformTypes.IOS, length: 3 } }))}>
            iOS
          </span>
          <span css={AnchorStyle} onClick={() => dispatch(openModal({ type: ModalTypes.PWA_HELP_IOS, props: { type: PWAPlatformTypes.ANDROID, length: 2 } }))}>
            Android
          </span>
          <span css={AnchorStyle} onClick={() => dispatch(openModal({ type: ModalTypes.PWA_HELP_IOS, props: { type: PWAPlatformTypes.PC, length: 2 } }))}>
            PC
          </span>
        </div>
      </div>
      <S.PatchNoteOpenButton onClick={handlePatchNoteOpenButtonClick}>패치 노트 보기</S.PatchNoteOpenButton>
    </S.SettingModal>
  );
}
