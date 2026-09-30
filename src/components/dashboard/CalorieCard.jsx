import Card from '../common/Card';

export default function CalorieCard({ calories }) {
  const target = Number(calories?.target || 0);
  const consumed = Number(calories?.consumed || 0);
  const remaining = Number(calories?.remaining || 0);

  const progress = target > 0 ? Math.min((consumed / target) * 100, 100) : 0;

  return (
    <Card className='p-5 sm:p-6'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <h2 className='font-heading text-heading-lg font-bold text-text'>
            Tracking Kalori
          </h2>

          <p className='mt-1 font-body text-body-sm text-text'>
            Ringkasan konsumsi kalori hari ini.
          </p>
        </div>

        <span className='font-body text-body-sm font-semibold text-primary'>
          {consumed.toLocaleString('id-ID')} / {target.toLocaleString('id-ID')}{' '}
          kkal
        </span>
      </div>

      <div className='mt-6 h-3 overflow-hidden rounded-full bg-primary/10'>
        <div
          className='h-full rounded-full bg-primary transition-all duration-500'
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className='mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3'>
        <div className='rounded-lg bg-background px-4 py-3'>
          <p className='font-body text-body-sm text-text'>Target</p>

          <p className='mt-1 font-heading text-heading-lg font-semibold text-primary'>
            {target.toLocaleString('id-ID')}
          </p>

          <p className='font-body text-[13px] text-text'>kkal</p>
        </div>

        <div className='rounded-lg bg-background px-4 py-3'>
          <p className='font-body text-body-sm text-text'>Dikonsumsi</p>

          <p className='mt-1 font-heading text-heading-lg font-semibold text-accent'>
            {consumed.toLocaleString('id-ID')}
          </p>

          <p className='font-body text-[13px] text-text'>kkal</p>
        </div>

        <div className='rounded-lg bg-background px-4 py-3'>
          <p className='font-body text-body-sm text-text'>Tersisa</p>

          <p className='mt-1 font-heading text-heading-lg font-semibold text-primary'>
            {remaining.toLocaleString('id-ID')}
          </p>

          <p className='font-body text-[13px] text-text'>kkal</p>
        </div>
      </div>

      {target === 0 && (
        <p className='mt-4 font-body text-body-sm text-text'>
          Belum ada target atau pencatatan kalori untuk hari ini.
        </p>
      )}
    </Card>
  );
}
