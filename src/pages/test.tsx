import { useEffect } from 'react';
import { elixirLengthTest, elixirOddsSumTest, randomTest } from '../test/elixir';

const Test = () => {
  useEffect(() => {
    elixirLengthTest();
    elixirOddsSumTest();
    randomTest();
  }, []);
  return <></>;
};

export default Test;
