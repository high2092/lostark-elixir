import * as S from './PatchNoteModal.style';
import { PreparedModalProps } from '../type/common';
import { CenteredModal } from './Modal';
import { useEffect } from 'react';
import { PATCH_NOTE } from '../database/patchNote';
import { convertLocalTimeString } from '../util';

export const PatchNoteModal = ({ zIndex }: PreparedModalProps) => {
  return <CenteredModal content={<PatchNoteModalContent />} zIndex={zIndex} />;
};

function PatchNoteModalContent() {
  return (
    <S.PatchNoteModal>
      <S.PatchNoteTitle>패치 노트</S.PatchNoteTitle>
      <S.PatchNote>
        {PATCH_NOTE.map(({ date, details }) => (
          <S.Patch>
            <S.PatchDate>{date}</S.PatchDate>
            <div key={`patch-${date}`}>
              {details.map((detail, j) => (
                <PatchDetail key={`patchDetail-${date}-${j}`} {...detail} />
              ))}
            </div>
          </S.Patch>
        ))}
      </S.PatchNote>
    </S.PatchNoteModal>
  );
}

interface PatchDetailProps {
  time: string;
  description: string;
}

function PatchDetail({ time, description }: PatchDetailProps) {
  const [pre, value] = convertLocalTimeString(time).split(' ');
  return (
    <S.PatchDetail>
      <S.PatchDetailTime>
        <div>{pre}</div>
        <div style={{ textAlign: 'right' }}>{value}</div>
      </S.PatchDetailTime>
      <S.PatchDetailDescription>{description}</S.PatchDetailDescription>
    </S.PatchDetail>
  );
}
