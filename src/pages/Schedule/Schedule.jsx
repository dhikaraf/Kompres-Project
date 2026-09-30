import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import DashboardLayout from '../../layouts/DashboardLayout';

import Card from '../../components/common/Card';

import StreakActionCard from '../../components/dashboard/StreakActionCard';

import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateScheduleStatus,
} from '../../services/featureApi';

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

function formatStatus(status) {
  return status === 'completed' ? 'Selesai' : 'Menunggu';
}

const emptyForm = {
  title: '',
  scheduled_date: getIndonesiaDate(),
  focus_muscle: '',
  status: 'pending',
  is_ai_generated: false,
};

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

export default function Schedule() {
  const location = useLocation();

  const navigate = useNavigate();

  const initialStartDate = location.state?.startDate || getIndonesiaDate();

  const initialEndDate =
    location.state?.endDate || addDays(initialStartDate, 6);

  const [startDate, setStartDate] = useState(initialStartDate);

  const [endDate, setEndDate] = useState(initialEndDate);

  const [schedules, setSchedules] = useState([]);

  const [form, setForm] = useState({
    ...emptyForm,
    scheduled_date: getIndonesiaDate(),
  });

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');

  const loadSchedules = async () => {
    try {
      setLoading(true);

      const response = await getSchedules({
        startDate,
        endDate,
      });

      setSchedules(getList(response));
    } catch (error) {
      console.error('Gagal mengambil jadwal:', error);

      setMessage(error.response?.data?.message || 'Jadwal gagal dimuat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate > endDate) {
      setEndDate(startDate);
      return;
    }

    loadSchedules();
  }, [startDate, endDate]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage('');

      await createSchedule({
        title: form.title.trim(),
        scheduled_date: form.scheduled_date,
        focus_muscle: form.focus_muscle.trim(),
        status: form.status,
        is_ai_generated: form.is_ai_generated,
      });

      setForm({
        ...emptyForm,
        scheduled_date: getIndonesiaDate(),
      });

      setMessage('Jadwal berhasil dibuat.');

      await loadSchedules();
    } catch (error) {
      console.error('Gagal membuat jadwal:', error);

      setMessage(error.response?.data?.message || 'Jadwal gagal dibuat.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      setMessage('');

      await updateScheduleStatus(id, status);

      if (status === 'completed') {
        navigate('/history');
        return;
      }

      await loadSchedules();
    } catch (error) {
      console.error('Gagal memperbarui status:', error);

      setMessage(
        error.response?.data?.message || 'Status jadwal gagal diubah.',
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus jadwal workout ini?')) {
      return;
    }

    try {
      await deleteSchedule(id);

      setMessage('Jadwal berhasil dihapus.');

      await loadSchedules();
    } catch (error) {
      console.error('Gagal menghapus jadwal:', error);

      setMessage(error.response?.data?.message || 'Jadwal gagal dihapus.');
    }
  };

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
        <div>
          <h1 className='font-heading text-heading-xl font-bold text-text'>
            Jadwal Workout
          </h1>

          <p className='mt-2 font-body text-body leading-relaxed text-text'>
            Atur jadwal latihan dan pantau konsistensi workout Anda.
          </p>
        </div>

        <div className='mt-8 grid gap-6 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <Card className='p-5 sm:p-6'>
              <h2 className='font-heading text-heading-lg font-bold text-text'>
                Buat Jadwal Tambahan
              </h2>

              <form
                onSubmit={handleSubmit}
                className='mt-6 grid gap-4 sm:grid-cols-2'
              >
                <div className='sm:col-span-2'>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Nama Workout
                  </label>

                  <input
                    name='title'
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder='Contoh: Push Day Workout'
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
                  />
                </div>

                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Tanggal Workout
                  </label>

                  <input
                    type='date'
                    name='scheduled_date'
                    value={form.scheduled_date}
                    onChange={handleChange}
                    required
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
                  />
                </div>

                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Fokus Otot
                  </label>

                  <input
                    name='focus_muscle'
                    value={form.focus_muscle}
                    onChange={handleChange}
                    required
                    placeholder='Contoh: Chest & Triceps'
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
                  />
                </div>

                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Status
                  </label>

                  <select
                    name='status'
                    value={form.status}
                    onChange={handleChange}
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
                  >
                    <option value='pending'>Menunggu</option>

                    <option value='completed'>Selesai</option>
                  </select>
                </div>

                <label className='flex items-center gap-3 pt-8 font-body text-body-sm text-text'>
                  <input
                    type='checkbox'
                    name='is_ai_generated'
                    checked={form.is_ai_generated}
                    onChange={handleChange}
                    className='h-4 w-4 accent-primary'
                  />
                  Jadwal dibuat oleh AI
                </label>

                <div className='sm:col-span-2'>
                  <button
                    type='submit'
                    disabled={saving}
                    className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Jadwal'}
                  </button>
                </div>
              </form>
            </Card>
          </div>

          <StreakActionCard />
        </div>

        <Card className='mt-6 p-5 sm:p-6'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between'>
            <div>
              <h2 className='font-heading text-heading-lg font-bold text-text'>
                Daftar Jadwal Workout
              </h2>

              <p className='mt-1 font-body text-body-sm text-text'>
                Menampilkan jadwal workout berdasarkan rentang tanggal.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <div>
                <label className='mb-1 block font-body text-body-sm font-semibold text-text'>
                  Dari
                </label>

                <input
                  type='date'
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                  className='w-full rounded-lg border border-primary/10 bg-surface px-3 py-2 font-body text-body-sm text-text outline-none focus:border-primary'
                />
              </div>

              <div>
                <label className='mb-1 block font-body text-body-sm font-semibold text-text'>
                  Sampai
                </label>

                <input
                  type='date'
                  value={endDate}
                  onChange={(event) => setEndDate(event.target.value)}
                  className='w-full rounded-lg border border-primary/10 bg-surface px-3 py-2 font-body text-body-sm text-text outline-none focus:border-primary'
                />
              </div>
            </div>
          </div>

          {message && (
            <div className='mt-5 rounded-lg bg-background px-4 py-3'>
              <p className='font-body text-body-sm text-text'>{message}</p>
            </div>
          )}

          {loading ? (
            <p className='mt-6 font-body text-body text-text'>
              Memuat jadwal...
            </p>
          ) : schedules.length === 0 ? (
            <div className='mt-6 rounded-lg bg-background px-4 py-8 text-center'>
              <p className='font-body text-body text-text'>
                Belum ada jadwal pada rentang tanggal ini.
              </p>
            </div>
          ) : (
            <div className='mt-6 space-y-3'>
              {schedules.map((schedule, index) => {
                const id = schedule.id || schedule.scheduleId;

                const title = schedule.title || 'Workout';

                const date = schedule.scheduledDate || schedule.scheduled_date;

                const focus =
                  schedule.focusMuscle || schedule.focus_muscle || '-';

                const status = schedule.status || 'pending';

                const isCompleted = status === 'completed';

                return (
                  <div
                    key={id || index}
                    className='rounded-lg bg-background p-4'
                  >
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                      <div>
                        <p className='font-heading text-lg font-semibold text-text'>
                          {title}
                        </p>

                        <p className='mt-1 font-body text-body-sm text-text'>
                          {formatIndonesiaDate(date)}
                        </p>

                        <p className='mt-1 font-body text-body-sm text-primary'>
                          {formatFocusMuscle(focus)}
                        </p>

                        <p className='mt-1 font-body text-body-sm text-text'>
                          Status:{' '}
                          <span className='font-semibold'>
                            {formatStatus(status)}
                          </span>
                        </p>
                      </div>

                      {id && (
                        <div className='flex flex-wrap gap-2'>
                          <button
                            type='button'
                            onClick={() => handleStatus(id, 'pending')}
                            disabled={status === 'pending'}
                            className='rounded-lg bg-surface px-3 py-2 font-body text-body-sm font-semibold text-text shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            Menunggu
                          </button>

                          <button
                            type='button'
                            onClick={() => handleStatus(id, 'completed')}
                            disabled={isCompleted}
                            className='rounded-lg bg-primary px-3 py-2 font-body text-body-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50'
                          >
                            Selesai
                          </button>

                          <button
                            type='button'
                            onClick={() => handleDelete(id)}
                            className='rounded-lg bg-accent px-3 py-2 font-body text-body-sm font-semibold text-white transition hover:brightness-95'
                          >
                            Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
