import styled from '@emotion/styled';
import { ELIXIR_ICON_SIZE, MOBILE_CRITERIA_MAX_WIDTH, MODAL_DEFAULT_BORDER_RADIUS } from '../constants';

const ELIXIR_PADDING = '1vw';
const ELIXIR_INFO_MODAL_CONTAINER_WIDTH = '16vw';
const ELIXIR_INFO_MODAL_HORIZONTAL_SIZE = '10vh';
const ELIXIR_INFO_MODAL_CONTAINER_HEIGHT = '7vh';

export const InventoryModal = styled.div`
  display: flex;

  transform: translateX(calc(${ELIXIR_INFO_MODAL_CONTAINER_WIDTH} / 2));

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    flex-direction: column;
    transform: translateY(calc(${ELIXIR_INFO_MODAL_CONTAINER_HEIGHT} / 2));
    align-items: center;
  }
`;

const ELIXIRS_PER_LINE = 8;

export const InventoryContainer = styled.div`
  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};
  background-color: white;

  width: calc(calc(${ELIXIR_ICON_SIZE} + calc(${ELIXIR_PADDING} * 2)) * ${ELIXIRS_PER_LINE});
  min-height: calc(calc(${ELIXIR_ICON_SIZE} + calc(${ELIXIR_PADDING} * 2)) * 5);

  padding: 2rem;
`;

export const Inventory = styled.div`
  display: grid;
  grid-template-columns: repeat(${ELIXIRS_PER_LINE}, 1fr);

  & > * {
    padding: ${ELIXIR_PADDING};
  }
`;

export const Elixir = styled.div<{ hover: boolean }>`
  ${({ hover }) => (hover ? 'fill: #c9a7eb;' : '')}
`;

export const ElixirInfoModalContainer = styled.div`
  width: ${ELIXIR_INFO_MODAL_CONTAINER_WIDTH};
  height: ${ELIXIR_INFO_MODAL_CONTAINER_HEIGHT};

  display: flex;
  justify-content: center;
`;

export const ElixirInfoModal = styled.div`
  margin-left: 2rem;
  height: 100%;
  background-color: white;
  padding: calc(${ELIXIR_INFO_MODAL_HORIZONTAL_SIZE} - ${ELIXIR_INFO_MODAL_CONTAINER_HEIGHT});

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    margin-left: auto;
    margin-top: -52vh;
  }
`;

export const UsageInfo = styled.div`
  position: absolute;
  bottom: 0;

  font-size: 0.8rem;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    bottom: ${ELIXIR_INFO_MODAL_CONTAINER_HEIGHT};
  }
`;
