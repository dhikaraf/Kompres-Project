import { useEffect, useState } from 'react';

import Card from '../common/Card';

import { checkInStreak, getStreak } from '../../services/featureApi';

function formatDate(date) {
  if (!date) return 'Belum ada aktivitas';

  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function StreakActionCard() {
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [message, setMessage] = useState('');

  const loadStreak = async () => {
    try {
      setLoading(true);

      const response = await getStreak();

      setStreak(response?.data || response);
    } catch (error) {
      console.error('Gagal mengambil streak:', error);

      setMessage(error.response?.data?.message || 'Data streak gagal dimuat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStreak();
  }, []);

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      setMessage('');

      await checkInStreak();

      setMessage('Check-in hari ini berhasil.');

      await loadStreak();
    } catch (error) {
      console.error('Gagal melakukan check-in:', error);

      setMessage(error.response?.data?.message || 'Check-in gagal dilakukan.');
    } finally {
      setCheckingIn(false);
    }
  };

  const currentStreak = Number(
    streak?.currentStreak ?? streak?.current_streak ?? 0,
  );

  const lastActivity = streak?.lastActivityDate || streak?.last_activity_date;

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
          {loading ? '—' : currentStreak}
        </span>

        <span className='pb-1 font-body text-body text-text'>hari</span>
      </div>

      <p className='mt-4 font-body text-body-sm leading-relaxed text-text'>
        {currentStreak > 0
          ? 'Pertahankan konsistensi latihan Anda.'
          : 'Mulai aktivitas untuk membangun streak Anda.'}
      </p>

      <div className='mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-primary/10 pt-4'>
        <div>
          <p className='font-body text-body-sm text-text'>Aktivitas terakhir</p>

          <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
            {formatDate(lastActivity)}
          </p>
        </div>

        <button
          type='button'
          onClick={handleCheckIn}
          disabled={loading || checkingIn}
          className='rounded-lg bg-primary px-4 py-2.5 font-body text-body-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {checkingIn ? 'Memproses...' : 'Check-in Hari Ini'}
        </button>
      </div>

      {message && (
        <p className='mt-3 font-body text-body-sm text-text'>{message}</p>
      )}
    </Card>
  );
}
