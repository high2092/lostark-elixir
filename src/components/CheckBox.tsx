interface CheckBoxProps {
  id?: string;
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export const CheckBox = ({ id, checked, setChecked }: CheckBoxProps) => {
  const handleCheckBoxInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setChecked(target.checked);
  };

  return <input id={id} type="checkbox" onChange={handleCheckBoxInputChange} checked={checked} />;
};
