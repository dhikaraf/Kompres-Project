export default function FitnessLevel({ selectedLevel, onSelectLevel }) {
  const levels = [
    {
      value: 'easy',
      label: 'Mudah',
    },
    {
      value: 'medium',
      label: 'Sedang',
    },
    {
      value: 'intermediate',
      label: 'Menengah',
    },
  ];

  return (
    <div className='w-full max-w-3xl rounded-lg bg-surface px-8 py-10 shadow-md sm:px-12'>
      <h2 className='text-center font-heading text-heading-lg font-semibold text-text'>
        Tingkat Kesulitan yang Diinginkan?
      </h2>

      <div className='mt-12 space-y-6'>
        {levels.map((level) => {
          const isSelected = selectedLevel === level.value;

          return (
            <button
              key={level.value}
              type='button'
              onClick={() => onSelectLevel(level.value)}
              aria-pressed={isSelected}
              className={`w-full rounded-lg py-5 font-body text-body font-semibold text-white transition ${
                isSelected
                  ? 'bg-primary shadow-md ring-2 ring-primary ring-offset-2'
                  : 'bg-accent shadow-sm hover:brightness-95'
              }`}
            >
              {level.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
