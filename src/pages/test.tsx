import { useEffect } from 'react';
import { elixirLengthTest, elixirOddsSumTest } from '../test/elixir';

const Test = () => {
  useEffect(() => {
    elixirLengthTest();
    elixirOddsSumTest();
  }, []);
  return <></>;
};

export default Test;
