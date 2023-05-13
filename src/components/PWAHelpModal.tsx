/** @jsxImportSource @emotion/react */
import * as S from './PWAHelpModal.style';
import { PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { useState } from 'react';
import { AnchorStyle } from '../style/common';

export const IOSPWAHelpModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<IOSPWAHelpModalContent />} zIndex={zIndex} />;
};

const IOSPWAHelpModalContent = () => {
  const STEPS = 3;
  const [step, setStep] = useState(1);

  const handlePrevButtonClick = () => {
    if (step <= 1) return;
    setStep(step - 1);
  };

  const handleNextButtonClick = () => {
    if (step >= STEPS) return;
    setStep(step + 1);
  };

  return (
    <S.PWAHelpModal>
      <div>
        <S.Image src={`/image/pwa-help/ios/${step}.png`} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {step > 1 ? (
            <div css={AnchorStyle} onClick={handlePrevButtonClick}>
              이전
            </div>
          ) : (
            <div />
          )}
          {step < STEPS ? (
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
