import Card from '../common/Card';

function formatCalories(value) {
  if (value === null || value === undefined) {
    return '—';
  }

  return `${Number(value).toLocaleString('id-ID')} kkal`;
}

export default function NutritionSummaryCard({ nutrition }) {
  const mealPlan = nutrition?.mealPlanSuggestion;

  return (
    <Card className='p-5 sm:p-6'>
      <div>
        <h2 className='font-heading text-heading-lg font-bold text-text'>
          Rincian Rencana Nutrisi AI
        </h2>

        <p className='mt-2 font-body text-body-sm leading-relaxed text-text sm:text-body'>
          Informasi tambahan berdasarkan hasil perhitungan kebutuhan energi
          harian Anda.
        </p>
      </div>

      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3'>
        <div className='rounded-lg bg-background px-4 py-4'>
          <p className='font-body text-body-sm text-text'>BMR</p>

          <p className='mt-1 font-heading text-heading-lg font-bold text-primary'>
            {formatCalories(nutrition?.bmr)}
          </p>

          <p className='mt-1 font-body text-[13px] text-text'>
            Kebutuhan dasar tubuh
          </p>
        </div>

        <div className='rounded-lg bg-background px-4 py-4'>
          <p className='font-body text-body-sm text-text'>TDEE</p>

          <p className='mt-1 font-heading text-heading-lg font-bold text-primary'>
            {formatCalories(nutrition?.tdee)}
          </p>

          <p className='mt-1 font-body text-[13px] text-text'>
            Perkiraan kebutuhan harian
          </p>
        </div>

        <div className='rounded-lg bg-primary px-4 py-4'>
          <p className='font-body text-body-sm text-white'>Target Kalori</p>

          <p className='mt-1 font-heading text-heading-lg font-bold text-white'>
            {formatCalories(nutrition?.targetCalories)}
          </p>

          <p className='mt-1 font-body text-[13px] text-white'>
            Sesuai tujuan kebugaran
          </p>
        </div>
      </div>

      <div className='mt-6'>
        <h3 className='font-heading text-lg font-semibold text-text'>
          Pembagian Kalori per Waktu Makan
        </h3>

        <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
          <div className='rounded-lg border border-primary/10 bg-surface px-4 py-3'>
            <p className='font-body text-body-sm text-text'>Sarapan</p>
            <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
              {formatCalories(mealPlan?.breakfastCalories)}
            </p>
          </div>

          <div className='rounded-lg border border-primary/10 bg-surface px-4 py-3'>
            <p className='font-body text-body-sm text-text'>Makan Siang</p>
            <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
              {formatCalories(mealPlan?.lunchCalories)}
            </p>
          </div>

          <div className='rounded-lg border border-primary/10 bg-surface px-4 py-3'>
            <p className='font-body text-body-sm text-text'>Makan Malam</p>
            <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
              {formatCalories(mealPlan?.dinnerCalories)}
            </p>
          </div>

          <div className='rounded-lg border border-primary/10 bg-surface px-4 py-3'>
            <p className='font-body text-body-sm text-text'>Snack</p>
            <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
              {formatCalories(mealPlan?.snackCalories)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
