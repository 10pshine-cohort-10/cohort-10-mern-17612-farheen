type Props = {
    id: string;
    name: string;
    label: string;
    type: string;
    value: string;
    error: string;
    autoComplete: string;
    onChange: (value: string) => void;
    onBlur: () => void;
};

// input with its label and its own error line, read out by screen readers through aria-describedby
// (the input only points at the error line while there is an error)
function Field({id, name, label, type, value, error, autoComplete, onChange, onBlur}: Props) {
  return (
    <div className="field">
        <label className="label" htmlFor={id}>{label}</label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
        {/* always rendered so its space is reserved and the page does not grow when an error shows */}
        <p className="field-error" id={`${id}-error`}>{error}</p>
    </div>
  );
}
export default Field;
