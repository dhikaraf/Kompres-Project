import Card from '../common/Card';

function getScheduleTime(schedule) {
  const rawTime =
    schedule?.time || schedule?.startTime || schedule?.scheduledTime;

  if (!rawTime) {
    return 'Waktu belum ditentukan';
  }

  if (String(rawTime).includes('T')) {
    return new Date(rawTime).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return rawTime;
}

export default function ScheduleCard({ schedules = [] }) {
  const visibleSchedules = schedules.slice(0, 3);

  return (
    <Card className='min-h-[220px] p-5 sm:p-6'>
      <div className='flex items-center justify-between gap-3'>
        <h2 className='font-heading text-heading-lg font-bold text-text'>
          Jadwal Workout
        </h2>

        <span className='rounded-full bg-primary/10 px-3 py-1 font-body text-body-sm font-semibold text-primary'>
          Hari Ini
        </span>
      </div>

      {visibleSchedules.length === 0 ? (
        <div className='mt-8 rounded-lg bg-background px-4 py-6 text-center'>
          <p className='font-body text-body text-text'>
            Belum ada jadwal workout hari ini.
          </p>

          <p className='mt-2 font-body text-body-sm text-text'>
            Jadwal workout akan tampil ketika tersedia.
          </p>
        </div>
      ) : (
        <div className='mt-6 space-y-3'>
          {visibleSchedules.map((schedule, index) => (
            <div
              key={schedule.id || index}
              className='flex items-center justify-between gap-4 rounded-lg bg-background px-4 py-3'
            >
              <div>
                <p className='font-body text-body-sm font-semibold text-text'>
                  {schedule.title || schedule.name || 'Workout'}
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {schedule.focusMuscle ||
                    schedule.focus_muscle ||
                    'Latihan kebugaran'}
                </p>
              </div>

              <div className='shrink-0 text-right'>
                <p className='font-heading text-lg font-semibold text-primary'>
                  {getScheduleTime(schedule)}
                </p>

                {schedule.durationMinutes && (
                  <p className='mt-1 font-body text-[13px] text-text'>
                    {schedule.durationMinutes} menit
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
