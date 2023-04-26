import { useEffect } from 'react';
import { elixirLengthTest, elixirOddsSumTest } from '../test/elixer';

const Test = () => {
  useEffect(() => {
    elixirLengthTest();
    elixirOddsSumTest();
  }, []);
  return <></>;
};

export default Test;
