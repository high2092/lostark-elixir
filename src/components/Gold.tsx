import { cutThousandUnit } from '../util';

export const Gold = ({ amount }: { amount: number }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <span>{cutThousandUnit(amount)}</span>
      <img src="image/gold.png" style={{ width: '16px', height: '16px' }} />
    </div>
  );
};
