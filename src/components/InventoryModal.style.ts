import styled from '@emotion/styled';
import { ELIXIR_ICON_SIZE, MOBILE_CRITERIA_MAX_WIDTH, MODAL_DEFAULT_BORDER_RADIUS } from '../constants';

const ELIXIR_PADDING = '1vw';
const ELIXIR_INFO_MODAL_CONTAINER_WIDTH = '13rem';
const ELIXIR_INFO_MODAL_CONTAINER_HEIGHT = '7vh';

export const InventoryModal = styled.div`
  display: flex;

  transform: translateX(calc(${ELIXIR_INFO_MODAL_CONTAINER_WIDTH} / 2));

  font-size: 0.9rem;

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
  height: max-content;

  display: grid;
  grid-template-columns: repeat(${ELIXIRS_PER_LINE}, 1fr);

  & > * {
    padding: ${ELIXIR_PADDING};
  }
`;

export const Elixir = styled.div<{ hover: boolean }>`
  ${({ hover }) => (hover ? 'fill: #c9a7eb;' : '')}
`;

const LIST_VIEW_ELIXIR_BORDER = 'solid 1px #bbbbbb';
export const ListViewElixir = styled.div`
  padding: 0.8rem 0;
  margin: 0.5vw 0;

  border-radius: 5px;

  border: ${LIST_VIEW_ELIXIR_BORDER};

  display: flex;
  justify-content: space-around;
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

export const ElixirInfoModal = styled.div`
  padding: 1rem 2rem;
  height: 100%;
  background-color: white;

  border-radius: ${MODAL_DEFAULT_BORDER_RADIUS};

  display: flex;
  flex-direction: column;
  justify-content: space-around;

  @media (max-width: ${MOBILE_CRITERIA_MAX_WIDTH}) {
    margin-top: -49vh;
  }
`;

export const BottomSection = styled.div`
  padding: 0 2rem;
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
  font-size: 0.6rem;
  line-height: 1;
`;
