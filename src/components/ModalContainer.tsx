import { useAppSelector } from '../store';
import { ModalType, ModalTypes } from '../type/common';
import { InventoryModal } from './InventoryModal';
import { PWAHelpModal } from './PWAHelpModal';
import { PatchNoteModal } from './PatchNoteModal';
import { SettingModal } from './SettingModal';
import { FixRefineModal } from './modals/fix-refine/ui';

type ModalComponents = {
  [key in ModalType]: (...params: any[]) => JSX.Element;
};

const ModalComponents: ModalComponents = {
  [ModalTypes.INVENTORY]: InventoryModal,
  [ModalTypes.SETTING]: SettingModal,
  [ModalTypes.PATCH_NOTE]: PatchNoteModal,
  [ModalTypes.PWA_HELP_IOS]: PWAHelpModal,
  [ModalTypes.FIX_REFINE]: FixRefineModal,
};

const DEFAULT_MODAL_Z_INDEX = 1000;

export const ModalContainer = () => {
  const { modals } = useAppSelector((state) => state.modal);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {modals.map(({ type, props }, idx) => {
        const ModalComponent = ModalComponents[type];
        return <ModalComponent key={`modal-${type}-${idx}`} zIndex={DEFAULT_MODAL_Z_INDEX + idx} {...props} />;
      })}
    </div>
  );
};
