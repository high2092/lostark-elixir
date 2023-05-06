import { useEffect } from 'react';
import { optionLengthTest, optionOddsSumTest, randomTest } from '../test/option';
import { MaxLevelEffect } from '../components/MaxLevelEffect';

const Test = () => {
  useEffect(() => {
    optionLengthTest();
    optionOddsSumTest();
    randomTest();
  }, []);
  return (
    <>
      <MaxLevelEffect />
    </>
  );
};

export default Test;
