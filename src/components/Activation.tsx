import { MAX_ACTIVE } from '../constants';
import * as S from './Activation.style';

const LEVEL = [null, null, 1, null, null, 2, null, 3, 4, 5];

export const Activation = ({ percentage }) => {
  return (
    <S.Activation percentage={percentage}>
      {Array.from({ length: MAX_ACTIVE }).map((_, idx) => (
        <div>{LEVEL[idx]}</div>
      ))}
    </S.Activation>
  );
};
