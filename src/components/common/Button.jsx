const variants = {
  primary: 'bg-primary text-white hover:opacity-90',

  accent: 'bg-accent text-white hover:brightness-95',

  secondary: 'bg-surface text-text shadow-sm hover:shadow-md',

  text: 'bg-transparent text-text hover:text-primary',
};

export default function Button({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  className = '',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 font-body text-body-sm font-semibold transition ${
        variants[variant]
      } ${disabled ? 'cursor-not-allowed opacity-60' : ''} ${className}`}
    >
      {children}
    </button>
  );
}
