import Card from '../common/Card';

function formatDate(date) {
  if (!date) {
    return 'Tanggal belum tersedia';
  }

  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function HistoryCard({ activity }) {
  const title = activity?.title || activity?.name || 'Aktivitas Workout';

  const focus =
    activity?.focusMuscle || activity?.focus_muscle || 'Fokus belum tersedia';

  const duration = activity?.durationMinutes || activity?.duration || null;

  const date =
    activity?.completedAt || activity?.date || activity?.createdAt || null;

  return (
    <Card className='p-5'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div>
          <p className='font-body text-body-sm font-semibold text-primary'>
            Aktivitas Workout
          </p>

          <h3 className='mt-2 font-heading text-heading-lg font-semibold text-text'>
            {title}
          </h3>

          <p className='mt-2 font-body text-body-sm text-text'>
            Fokus: {focus}
          </p>
        </div>

        <div className='rounded-lg bg-background px-4 py-3 sm:min-w-[130px] sm:text-right'>
          <p className='font-body text-body-sm text-text'>{formatDate(date)}</p>

          {duration && (
            <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
              {duration} menit
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
