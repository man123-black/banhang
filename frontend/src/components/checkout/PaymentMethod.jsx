import { PAYMENT_METHODS } from '../../utils/constants';

export default function PaymentMethod({ value, onChange }) {
  return (
    <div className="space-y-2">
      {Object.entries(PAYMENT_METHODS).map(([key, method]) => (
        <label key={key} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:border-primary-500">
          <input type="radio" value={key} checked={value === key} onChange={e => onChange(e.target.value)} />
          <span className="text-2xl">{method.icon}</span>
          <span>{method.label}</span>
        </label>
      ))}
    </div>
  );
}
