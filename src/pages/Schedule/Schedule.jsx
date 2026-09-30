import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import StreakActionCard from '../../components/dashboard/StreakActionCard';
import {
  createSchedule,
  deleteSchedule,
  getSchedules,
  updateScheduleStatus,
} from '../../services/featureApi';

const emptyForm = {
  title: '',
  scheduled_date: new Date().toISOString().slice(0, 10),
  focus_muscle: '',
  status: 'pending',
  is_ai_generated: false,
};

function getList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.schedules)) return response.data.schedules;
  if (Array.isArray(response?.schedules)) return response.schedules;
  return [];
}

export default function Schedule() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const response = await getSchedules({ startDate, endDate });
      setSchedules(getList(response));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Jadwal gagal dimuat.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      setForm(emptyForm);
      setMessage('Jadwal berhasil dibuat.');
      await loadSchedules();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Jadwal gagal dibuat.');
    } finally {
      setSaving(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await updateScheduleStatus(id, status);
      await loadSchedules();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Status jadwal gagal diubah.',
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus jadwal workout ini?')) return;

    try {
      await deleteSchedule(id);
      await loadSchedules();
    } catch (error) {
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
                Tambah Jadwal
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
                    <option value='pending'>Pending</option>
                    <option value='completed'>Completed</option>
                  </select>
                </div>

                <label className='flex items-center gap-3 pt-8 font-body text-body-sm text-text'>
                  <input
                    type='checkbox'
                    name='is_ai_generated'
                    checked={form.is_ai_generated}
                    onChange={handleChange}
                    className='h-4 w-4'
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
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h2 className='font-heading text-heading-lg font-bold text-text'>
                Daftar Jadwal
              </h2>
              <p className='mt-1 font-body text-body-sm text-text'>
                Filter jadwal berdasarkan rentang tanggal.
              </p>
            </div>

            <div className='grid grid-cols-2 gap-3'>
              <input
                type='date'
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className='rounded-lg border border-primary/10 bg-surface px-3 py-2 font-body text-body-sm text-text outline-none'
              />
              <input
                type='date'
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className='rounded-lg border border-primary/10 bg-surface px-3 py-2 font-body text-body-sm text-text outline-none'
              />
            </div>
          </div>

          {message && (
            <p className='mt-4 font-body text-body-sm text-text'>{message}</p>
          )}

          {loading ? (
            <p className='mt-6 font-body text-body text-text'>
              Memuat jadwal...
            </p>
          ) : schedules.length === 0 ? (
            <div className='mt-6 rounded-lg bg-background px-4 py-6 text-center'>
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
                          {date || 'Tanggal belum tersedia'} · {focus}
                        </p>
                        <p className='mt-1 font-body text-body-sm text-primary'>
                          Status: {status}
                        </p>
                      </div>

                      {id && (
                        <div className='flex flex-wrap gap-2'>
                          <button
                            type='button'
                            onClick={() => handleStatus(id, 'pending')}
                            className='rounded-lg bg-surface px-3 py-2 font-body text-body-sm font-semibold text-text shadow-sm'
                          >
                            Pending
                          </button>
                          <button
                            type='button'
                            onClick={() => handleStatus(id, 'completed')}
                            className='rounded-lg bg-primary px-3 py-2 font-body text-body-sm font-semibold text-white'
                          >
                            Selesai
                          </button>
                          <button
                            type='button'
                            onClick={() => handleDelete(id)}
                            className='rounded-lg bg-accent px-3 py-2 font-body text-body-sm font-semibold text-white'
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
