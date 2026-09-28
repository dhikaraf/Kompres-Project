import Card from '../common/Card';

export default function WorkoutCard({ workout, onMore }) {
  return (
    <Card className='flex h-[405px] w-[270px] shrink-0 flex-col overflow-hidden sm:w-[280px]'>
      {/* Gambar Workout */}
      <div className='h-[145px] w-full shrink-0 overflow-hidden'>
        <img
          src={workout.image}
          alt={workout.name}
          className='h-full w-full object-cover'
        />
      </div>

      {/* Isi Card */}
      <div className='flex flex-1 flex-col p-4'>
        {/* Level */}
        <p className='min-h-[20px] font-body text-body-sm font-semibold text-text'>
          Level: {workout.level}
        </p>

        {/* Nama Workout */}
        <h3 className='mt-2 h-[58px] overflow-hidden font-heading text-heading-lg font-semibold leading-tight text-text'>
          {workout.name}
        </h3>

        {/* Detail Workout */}
        <div className='mt-4 min-h-[44px] font-body text-[13px] leading-snug text-text'>
          <p>
            {workout.sets} Set × {workout.reps} Repetisi
          </p>

          <p className='mt-1'>Istirahat: {workout.rest} detik</p>
        </div>

        {/* Rekomendasi Beban */}
        <p className='mt-4 min-h-[20px] font-body text-body-sm text-text'>
          Rekomendasi: {workout.recommendedWeight} Kg
        </p>

        {/* Tombol selalu di bawah */}
        <button
          type='button'
          onClick={() => onMore?.(workout)}
          className='mt-auto w-full rounded-lg bg-accent py-2.5 font-body text-body-sm font-semibold text-white transition hover:brightness-95 active:scale-[0.99]'
        >
          Selengkapnya
        </button>
      </div>
    </Card>
  );
}
