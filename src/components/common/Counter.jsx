import { useEffect, useState } from 'react';

export default function Counter({
  value,
  unit,
  onIncrease,
  onDecrease,
  onChange,
  min = 0,
  max = 200,
  direction = 'horizontal',
  disabled = false,
}) {
  const [inputValue, setInputValue] = useState(String(value));

  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const canDecrease = value > min;
  const canIncrease = value < max;

  const handleInputChange = (event) => {
    const newValue = event.target.value;

    // Hanya menerima angka.
    if (!/^\d*$/.test(newValue)) {
      return;
    }

    setInputValue(newValue);

    // Input kosong tetap diperbolehkan sementara,
    // supaya user bisa menghapus angka lalu mengetik angka baru.
    if (newValue === '') {
      return;
    }

    const numericValue = Number(newValue);

    // Update parent hanya jika masih berada dalam range.
    if (numericValue >= min && numericValue <= max) {
      onChange(numericValue);
    }
  };

  const handleInputBlur = () => {
    if (inputValue === '') {
      setInputValue(String(value));
      return;
    }

    let numericValue = Number(inputValue);

    if (numericValue < min) {
      numericValue = min;
    }

    if (numericValue > max) {
      numericValue = max;
    }

    setInputValue(String(numericValue));
    onChange(numericValue);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur();
    }
  };

  const buttonClass =
    'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary font-body text-3xl font-medium leading-none text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:h-14 sm:w-14';

  const inputClass =
    'w-32 border-0 bg-transparent text-center font-heading text-6xl font-bold leading-none text-text outline-none sm:text-7xl';

  const numberInput = (
    <div className='flex flex-col items-center'>
      <input
        type='text'
        inputMode='numeric'
        pattern='[0-9]*'
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        disabled={disabled}
        aria-label={`Nilai ${unit}`}
        className={`${inputClass} ${
          disabled ? 'cursor-not-allowed opacity-60' : ''
        }`}
      />

      <span className='mt-4 font-body text-body text-text'>{unit}</span>
    </div>
  );

  if (direction === 'vertical') {
    return (
      <div className='flex min-h-[390px] w-full max-w-[190px] flex-col items-center justify-between rounded-lg bg-surface px-5 py-6 shadow-md'>
        <button
          type='button'
          onClick={onDecrease}
          disabled={disabled || !canDecrease}
          aria-label={`Kurangi ${unit}`}
          className={buttonClass}
        >
          −
        </button>

        {numberInput}

        <button
          type='button'
          onClick={onIncrease}
          disabled={disabled || !canIncrease}
          aria-label={`Tambah ${unit}`}
          className={buttonClass}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className='flex w-full items-center justify-between rounded-lg bg-surface px-5 py-8 shadow-md sm:px-8'>
      <button
        type='button'
        onClick={onDecrease}
        disabled={disabled || !canDecrease}
        aria-label={`Kurangi ${unit}`}
        className={buttonClass}
      >
        −
      </button>

      {numberInput}

      <button
        type='button'
        onClick={onIncrease}
        disabled={disabled || !canIncrease}
        aria-label={`Tambah ${unit}`}
        className={buttonClass}
      >
        +
      </button>
    </div>
  );
}
