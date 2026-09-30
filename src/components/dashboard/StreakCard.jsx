import Card from '../common/Card';

function formatLastActivity(date) {
  if (!date) {
    return 'Belum ada aktivitas';
  }

  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function StreakCard({ streak }) {
  const currentStreak = Number(streak?.currentStreak || 0);

  return (
    <Card className='min-h-[220px] p-5 sm:p-6'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-heading text-heading-lg font-bold text-text'>
          Konsistensi
        </h2>

        <span className='rounded-full bg-accent px-3 py-1 font-body text-body-sm font-semibold text-white'>
          Streak
        </span>
      </div>

      <div className='mt-7 flex items-end gap-3'>
        <span className='font-heading text-5xl font-bold text-primary'>
          {currentStreak}
        </span>

        <span className='pb-1 font-body text-body text-text'>hari</span>
      </div>

      <p className='mt-4 font-body text-body-sm leading-relaxed text-text'>
        {currentStreak > 0
          ? 'Pertahankan konsistensi latihan Anda.'
          : 'Mulai aktivitas workout untuk membangun streak Anda.'}
      </p>

      <div className='mt-5 border-t border-primary/10 pt-4'>
        <p className='font-body text-body-sm text-text'>Aktivitas terakhir</p>

        <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
          {formatLastActivity(streak?.lastActivityDate)}
        </p>
      </div>
    </Card>
  );
}
