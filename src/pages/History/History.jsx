import { useEffect, useState } from 'react';

import api from '../../services/api';

import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import HistoryCard from '../../components/dashboard/HistoryCard';

export default function History() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await api.get('/dashboard');

        const dashboard = response.data?.data || null;

        setActivities(
          Array.isArray(dashboard?.recentWorkouts)
            ? dashboard.recentWorkouts
            : [],
        );
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
            Aktivitas workout terbaru yang tersedia pada akun Anda.
          </p>
        </div>

        {activities.length === 0 ? (
          <Card className='mt-8 px-6 py-12 text-center'>
            <h2 className='font-heading text-heading-lg font-semibold text-text'>
              Belum Ada Aktivitas
            </h2>

            <p className='mt-3 font-body text-body-sm text-text'>
              Aktivitas workout Anda akan muncul di sini setelah tersedia.
            </p>
          </Card>
        ) : (
          <div className='mt-8 grid gap-5'>
            {activities.map((activity, index) => (
              <HistoryCard key={activity.id || index} activity={activity} />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
