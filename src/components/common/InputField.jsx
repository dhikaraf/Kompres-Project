import { useState } from 'react';

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  autoComplete,
  error = '',
  required = false,
  disabled = false,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div>
      <label
        htmlFor={id}
        className='font-body text-body-sm font-semibold text-text'
      >
        {label}

        {required && (
          <span className='ml-1 text-accent' aria-hidden='true'>
            *
          </span>
        )}
      </label>

      <div className='relative mt-2'>
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-10 w-full rounded-md border bg-surface px-3 font-body text-body-sm text-text outline-none transition placeholder:text-gray-400 ${
            isPassword ? 'pr-11' : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary'
          } ${disabled ? 'cursor-not-allowed bg-gray-100 opacity-70' : ''}`}
        />

        {isPassword && (
          <button
            type='button'
            onClick={() => setShowPassword((current) => !current)}
            disabled={disabled}
            aria-label={
              showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'
            }
            className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-primary disabled:cursor-not-allowed'
          >
            {showPassword ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.8'
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 0 0 1.5 12s3.75 7.5 10.5 7.5c1.45 0 2.75-.27 3.89-.72'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6.228 6.228C7.72 5.155 9.66 4.5 12 4.5c6.75 0 10.5 7.5 10.5 7.5a19.04 19.04 0 0 1-3.022 4.136'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3 3l18 18'
                />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth='1.8'
                stroke='currentColor'
                className='h-5 w-5'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.25 12s3.75-7.5 9.75-7.5 9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12Z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z'
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className='mt-1.5 font-body text-body-sm text-red-600'
        >
          {error}
        </p>
      )}
    </div>
  );
}
