export default function Card({ children, className = '' }) {
  return (
    <div className={`rounded-lg bg-surface shadow-md ${className}`}>
      {children}
    </div>
  );
}
