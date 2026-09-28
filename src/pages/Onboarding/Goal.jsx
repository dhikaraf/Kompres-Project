const goals = [
  {
    id: 'lose-weight',
    label: 'Menurunkan Berat Badan',
    icon: '⚖',
  },
  {
    id: 'gain-weight',
    label: 'Menambah Berat Badan',
    icon: '💪',
  },
  {
    id: 'stay-healthy',
    label: 'Menjaga Kesehatan',
    icon: '🧘',
  },
];

export default function Goal({ selectedGoal, onSelectGoal }) {
  return (
    <div>
      {/* Judul */}
      <div className='text-center'>
        <h1 className='font-heading text-heading-xl font-bold text-text'>
          Apa Tujuan Anda?
        </h1>
      </div>

      {/* Pilihan tujuan */}
      <div className='mt-10 space-y-5'>
        {goals.map((goal) => {
          const isSelected = selectedGoal === goal.id;

          return (
            <button
              key={goal.id}
              type='button'
              onClick={() => onSelectGoal(goal.id)}
              aria-pressed={isSelected}
              className={`flex min-h-[66px] w-full items-center gap-5 rounded-lg px-5 py-4 text-left font-body text-body font-semibold transition duration-200 ${
                isSelected
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-accent text-white hover:brightness-95'
              }`}
            >
              {/* Ikon */}
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-xl ${
                  isSelected
                    ? 'bg-surface text-primary'
                    : 'bg-surface text-text'
                }`}
              >
                {goal.icon}
              </span>

              {/* Nama tujuan */}
              <span>{goal.label}</span>

              {/* Tanda pilihan */}
              {isSelected && (
                <span className='ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-surface text-sm font-bold text-primary'>
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
