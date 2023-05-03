import { useEffect } from 'react';
import { optionLengthTest, optionOddsSumTest, randomTest } from '../test/option';

const Test = () => {
  useEffect(() => {
    optionLengthTest();
    optionOddsSumTest();
    randomTest();
  }, []);
  return <></>;
};

export default Test;
