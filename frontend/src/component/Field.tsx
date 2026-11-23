import type {ReactNode} from "react";

type Props = {
    id: string;
    name: string;
    label: string;
    type: string;
    value: string;
    error: string;
    ok?: string; // green message shown when there is no error, e.g. "Strong password"
    autoComplete: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    children?: ReactNode; // extra UI under the input, e.g. the password strength bar
};

// input with its label and its own message line, read out by screen readers through aria-describedby
// (the input only points at the message line while it has text)
function Field({id, name, label, type, value, error, ok = "", autoComplete, onChange, onBlur, children}: Props) {
    const message = error || ok;
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
        aria-describedby={message ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
      />
        {children}
        {/* always rendered so its space is reserved and the page does not grow when a message shows */}
        <p className={error ? "field-error" : "field-error ok"} id={`${id}-error`}>{message}</p>
    </div>
  );
}
export default Field;
