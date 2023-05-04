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
const INVENTORY_CONTAINER_WIDTH = `calc(calc(${ELIXIR_ICON_SIZE} + calc(${ELIXIR_PADDING} * 2)) * ${ELIXIRS_PER_LINE})`;
const INVENTORY_CONTAINER_HEIGHT = `calc(calc(${ELIXIR_ICON_SIZE} + calc(${ELIXIR_PADDING} * 2)) * 5)`;
export const InventoryContainer = styled.div`
  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};
  background-color: white;

  width: ${INVENTORY_CONTAINER_WIDTH};
  min-height: ${INVENTORY_CONTAINER_HEIGHT};

  padding: 2rem;

  display: flex;
  justify-content: center;
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

export const ListViewInventory = styled.div`
  width: 100%;

  height: ${INVENTORY_CONTAINER_HEIGHT};
  overflow-y: scroll;
`;

const LIST_VIEW_ELIXIR_BORDER = 'solid 1px #bbbbbb';
export const ListViewElixir = styled.div`
  padding: 2vw 0;
  margin: 0.5vw 0;

  border-radius: 5px;

  border: ${LIST_VIEW_ELIXIR_BORDER};

  display: flex;
  justify-content: space-around;
`;

export const ElixirInfoModal = styled.div`
  margin-left: 3rem;
  height: 100%;
  background-color: white;
  padding: calc(${ELIXIR_INFO_MODAL_HORIZONTAL_SIZE} - ${ELIXIR_INFO_MODAL_CONTAINER_HEIGHT}) 1rem;

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    margin-left: auto;
    margin-top: -52vh;
  }
`;

export const BottomSection = styled.div`
  position: absolute;
  bottom: 0;

  width: ${INVENTORY_CONTAINER_WIDTH};

  display: flex;
  justify-content: space-between;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    bottom: ${ELIXIR_INFO_MODAL_CONTAINER_HEIGHT};
  }
`;

export const UsageInfo = styled.div`
  font-size: 0.8rem;
`;
