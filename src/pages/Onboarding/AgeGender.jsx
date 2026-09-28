import Counter from '../../components/common/Counter';

function FemaleIcon() {
  return (
    <svg
      viewBox='0 0 140 140'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='h-32 w-32 sm:h-36 sm:w-36'
    >
      <path
        d='M70 20C42.386 20 20 42.386 20 70v50h100V70c0-27.614-22.386-50-50-50Z'
        fill='currentColor'
      />
      <path
        d='M70 48c20.435 0 37 16.565 37 37v7H33v-7c0-20.435 16.565-37 37-37Z'
        fill='white'
      />
      <circle cx='54' cy='82' r='7' fill='currentColor' />
      <circle cx='86' cy='82' r='7' fill='currentColor' />
      <path
        d='M41 54c8-12 18-18 29-18 11 0 21 6 29 18-5 8-15 14-29 14-14 0-24-6-29-14Z'
        fill='currentColor'
      />
    </svg>
  );
}

function MaleIcon() {
  return (
    <svg
      viewBox='0 0 140 140'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='h-32 w-32 sm:h-36 sm:w-36'
    >
      <circle cx='70' cy='70' r='50' fill='currentColor' />
      <path
        d='M70 48c20.435 0 37 16.565 37 37v7H33v-7c0-20.435 16.565-37 37-37Z'
        fill='white'
      />
      <circle cx='54' cy='82' r='7' fill='currentColor' />
      <circle cx='86' cy='82' r='7' fill='currentColor' />
      <path
        d='M41 54c8-12 18-18 29-18 11 0 21 6 29 18-5 8-15 14-29 14-14 0-24-6-29-14Z'
        fill='currentColor'
      />
    </svg>
  );
}

const genderOptions = [
  {
    id: 'female',
    label: 'Perempuan',
    icon: FemaleIcon,
  },
  {
    id: 'male',
    label: 'Laki-laki',
    icon: MaleIcon,
  },
];

export default function AgeGender({
  gender,
  age,
  onGenderChange,
  onAgeChange,
}) {
  const handleIncreaseAge = () => {
    if (age < 120) {
      onAgeChange(age + 1);
    }
  };

  const handleDecreaseAge = () => {
    if (age > 1) {
      onAgeChange(age - 1);
    }
  };

  return (
    <div className='w-full'>
      {/* Jenis Kelamin */}
      <section>
        <h1 className='text-center font-heading text-heading-xl font-bold text-text'>
          Jenis Kelamin Anda
        </h1>

        <div className='mx-auto mt-10 grid max-w-[520px] grid-cols-1 gap-6 sm:grid-cols-2'>
          {genderOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = gender === option.id;

            return (
              <button
                key={option.id}
                type='button'
                onClick={() => onGenderChange(option.id)}
                aria-pressed={isSelected}
                className={`flex flex-col items-center rounded-lg bg-surface px-6 py-6 shadow-md transition ${
                  isSelected
                    ? 'ring-4 ring-primary/30'
                    : 'hover:-translate-y-1 hover:shadow-lg'
                }`}
              >
                <div className={`${isSelected ? 'text-primary' : 'text-text'}`}>
                  <Icon />
                </div>

                <span className='mt-5 font-heading text-heading-lg font-semibold text-text'>
                  {option.label}
                </span>

                {isSelected && (
                  <span className='mt-3 rounded-full bg-primary px-3 py-1 font-body text-body-sm font-semibold text-white'>
                    Dipilih
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Usia */}
      <section className='mt-14'>
        <h2 className='text-center font-heading text-heading-xl font-bold text-text'>
          Usia Anda
        </h2>

        <div className='mx-auto mt-8 max-w-[480px]'>
          <Counter
            value={age}
            unit='tahun'
            onIncrease={handleIncreaseAge}
            onDecrease={handleDecreaseAge}
            onChange={onAgeChange}
            min={1}
            max={120}
          />
        </div>
      </section>
    </div>
  );
}
