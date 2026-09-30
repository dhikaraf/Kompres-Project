import { useEffect, useState } from 'react';

import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import { getSchedules } from '../../services/featureApi';

function getIndonesiaDate() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(new Date());
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T00:00:00`);

  date.setDate(date.getDate() + days);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getList(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.schedules)) {
    return response.data.schedules;
  }

  if (Array.isArray(response?.schedules)) {
    return response.schedules;
  }

  return [];
}

function formatIndonesiaDate(dateString) {
  if (!dateString) {
    return 'Tanggal belum tersedia';
  }

  const normalizedDate =
    typeof dateString === 'string' && dateString.length === 10
      ? `${dateString}T00:00:00`
      : dateString;

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return 'Tanggal tidak valid';
  }

  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatFocusMuscle(value) {
  if (!value) {
    return '-';
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(' + ');
}

export default function History() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');

        const today = getIndonesiaDate();

        // Ambil jadwal dari 30 hari sebelum sampai 30 hari setelah hari ini.
        // Dengan begitu workout yang sudah selesai pada tanggal mendatang
        // tetap ikut ditampilkan di halaman riwayat.
        const response = await getSchedules({
          startDate: addDays(today, -30),
          endDate: addDays(today, 30),
        });

        const schedules = getList(response);

        const completedSchedules = schedules
          .filter(
            (schedule) =>
              String(schedule.status || '').toLowerCase() === 'completed',
          )
          .sort((first, second) => {
            const firstDate = first.scheduledDate || first.scheduled_date || '';
            const secondDate =
              second.scheduledDate || second.scheduled_date || '';

            return secondDate.localeCompare(firstDate);
          });

        setActivities(completedSchedules);
      } catch (requestError) {
        console.error('Gagal mengambil riwayat aktivitas:', requestError);

        setError(
          requestError.response?.data?.message ||
            'Riwayat aktivitas gagal dimuat.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-5xl px-5 py-8 sm:px-8'>
          <Card className='flex min-h-[300px] items-center justify-center'>
            <p className='font-body text-body text-text'>
              Memuat riwayat aktivitas...
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-5xl px-5 py-8 sm:px-8'>
          <Card className='px-6 py-8 text-center'>
            <h1 className='font-heading text-heading-lg font-bold text-text'>
              Riwayat tidak dapat dimuat
            </h1>

            <p className='mt-3 font-body text-body-sm text-text'>{error}</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-5xl px-5 py-8 sm:px-8'>
        <div>
          <h1 className='font-heading text-heading-xl font-bold text-text'>
            Riwayat Aktivitas
          </h1>

          <p className='mt-2 font-body text-body-sm leading-relaxed text-text sm:text-body'>
            Aktivitas workout yang sudah Anda selesaikan.
          </p>
        </div>

        {activities.length === 0 ? (
          <Card className='mt-8 px-6 py-12 text-center'>
            <h2 className='font-heading text-heading-lg font-semibold text-text'>
              Belum Ada Aktivitas
            </h2>

            <p className='mt-3 font-body text-body-sm text-text'>
              Workout yang sudah diselesaikan akan muncul di sini.
            </p>
          </Card>
        ) : (
          <div className='mt-8 grid gap-5'>
            {activities.map((activity, index) => {
              const id = activity.id || activity.scheduleId || index;

              const title = activity.title || 'Workout';

              const date = activity.scheduledDate || activity.scheduled_date;

              const focus =
                activity.focusMuscle || activity.focus_muscle || '-';

              return (
                <Card key={id} className='p-5 sm:p-6'>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <h2 className='font-heading text-heading-lg font-bold text-text'>
                        {title}
                      </h2>

                      <p className='mt-2 font-body text-body-sm text-text'>
                        {formatIndonesiaDate(date)}
                      </p>

                      <p className='mt-1 font-body text-body-sm text-text'>
                        Fokus Otot:{' '}
                        <span className='font-semibold'>
                          {formatFocusMuscle(focus)}
                        </span>
                      </p>
                    </div>

                    <span className='w-fit rounded-full bg-primary px-4 py-2 font-body text-body-sm font-semibold text-white'>
                      Selesai
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
