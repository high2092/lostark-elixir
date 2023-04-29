import { useEffect, useState } from 'react';
import * as S from './Loading.style';

export const Loading = () => {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((dotCount) => (dotCount < 3 ? dotCount + 1 : 0));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return <S.Loading>{`Loading${'.'.repeat(dotCount)}`}</S.Loading>;
};
