/** @jsxImportSource @emotion/react */
import * as S from './PWAHelpModal.style';
import { PWAPlayformType, PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { useState } from 'react';
import { AnchorStyle } from '../style/common';

interface PWAHelpModalProps extends PreparedModalProps {
  type: PWAPlayformType;
  length: number;
}

export const PWAHelpModal = ({ zIndex, type, length }: PWAHelpModalProps) => {
  const props = { type, length };
  return <CenteredModal content={<PWAHelpModalContent {...props} />} zIndex={zIndex} />;
};

const PWAHelpModalContent = ({ type, length }) => {
  const [step, setStep] = useState(1);

  const handlePrevButtonClick = () => {
    if (step <= 1) return;
    setStep(step - 1);
  };

  const handleNextButtonClick = () => {
    if (step >= length) return;
    setStep(step + 1);
  };

  return (
    <S.PWAHelpModal>
      <div>
        <S.Image src={`/image/pwa-help/${type}/${step}.png`} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {step > 1 ? (
            <div css={AnchorStyle} onClick={handlePrevButtonClick}>
              이전
            </div>
          ) : (
            <div />
          )}
          {step < length ? (
            <div css={AnchorStyle} onClick={handleNextButtonClick}>
              다음
            </div>
          ) : (
            <div />
          )}
        </div>
      </div>
    </S.PWAHelpModal>
  );
};
