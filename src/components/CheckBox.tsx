interface CheckBoxProps {
  checked: boolean;
  setChecked: (checked: boolean) => void;
}

export const CheckBox = ({ checked, setChecked }: CheckBoxProps) => {
  const handleCheckBoxInputChange = (e: React.ChangeEvent) => {
    const target = e.target as HTMLInputElement;
    setChecked(target.checked);
  };

  return <input type="checkbox" onChange={handleCheckBoxInputChange} checked={checked} />;
};
