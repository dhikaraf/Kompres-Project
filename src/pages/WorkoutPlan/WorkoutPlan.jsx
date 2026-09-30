import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../../layouts/DashboardLayout';

import Card from '../../components/common/Card';

import { getProfile } from '../../services/api';

import { generateWorkoutPlan } from '../../services/featureApi';

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

  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Jakarta',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatFocusMuscle(value) {
  if (!value) {
    return 'Istirahat';
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1).toLowerCase())
    .join(' + ');
}

function formatStatus(status) {
  if (status === 'completed') {
    return 'Selesai';
  }

  return 'Menunggu';
}

function extractPlan(response) {
  return response?.data || response;
}

export default function WorkoutPlan() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);

  const [startDate, setStartDate] = useState(getIndonesiaDate());

  const [saveToSchedule, setSaveToSchedule] = useState(true);

  const [plan, setPlan] = useState(null);

  const [selectedDay, setSelectedDay] = useState(null);

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] = useState(false);

  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getProfile();

        setProfile(response?.data || response);
      } catch (error) {
        console.error('Gagal mengambil profil:', error);

        setMessage('Profil belum dapat dimuat.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleGenerate = async (event) => {
    event.preventDefault();

    try {
      setGenerating(true);
      setMessage('');

      const payload = saveToSchedule
        ? {
            start_date: startDate,
            save_to_schedule: true,
          }
        : {
            save_to_schedule: false,
          };

      const response = await generateWorkoutPlan(payload);

      const result = extractPlan(response);

      setPlan(result);

      const savedCount = Number(result?.saved_schedules_count ?? 0);

      if (saveToSchedule) {
        if (savedCount > 0) {
          setMessage(
            `${savedCount} jadwal latihan berhasil dibuat dan disimpan ke jadwal.`,
          );
        } else {
          setMessage(
            'Rencana workout berhasil dibuat, tetapi tidak ada jadwal baru yang tersimpan.',
          );
        }
      } else {
        setMessage('Preview workout plan berhasil dibuat.');
      }
    } catch (error) {
      console.error('Gagal membuat workout plan:', error);

      setMessage(
        error.response?.data?.message ||
          'Workout plan gagal dibuat. Silakan coba lagi.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const days = Array.isArray(plan?.workout_plan)
    ? plan.workout_plan
    : Array.isArray(plan?.workoutPlan)
      ? plan.workoutPlan
      : Array.isArray(plan?.days)
        ? plan.days
        : [];

  const savedCount = Number(plan?.saved_schedules_count ?? 0);

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
        <div>
          <h1 className='font-heading text-heading-xl font-bold text-text'>
            Rekomendasi Rencana Workout 7 Hari
          </h1>

          <p className='mt-2 max-w-3xl font-body text-body leading-relaxed text-text'>
            Buat rencana latihan selama 7 hari berdasarkan profil kebugaran Anda
            dan gunakan hasilnya sebagai jadwal latihan.
          </p>
        </div>

        <Card className='mt-8 p-5 sm:p-6'>
          <form
            onSubmit={handleGenerate}
            className='grid gap-5 lg:grid-cols-[1fr_auto]'
          >
            <div>
              <label className='block font-body text-body-sm font-semibold text-text'>
                Tanggal Mulai
              </label>

              <input
                type='date'
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={!saveToSchedule || generating}
                className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary disabled:cursor-not-allowed disabled:opacity-50'
              />

              <p className='mt-2 font-body text-body-sm text-text'>
                Rencana akan mencakup 7 hari mulai dari tanggal yang dipilih.
              </p>
            </div>

            <div className='flex flex-col justify-end gap-4'>
              <label className='flex items-center gap-3 font-body text-body-sm text-text'>
                <input
                  type='checkbox'
                  checked={saveToSchedule}
                  onChange={(event) => setSaveToSchedule(event.target.checked)}
                  disabled={generating}
                  className='h-4 w-4 accent-primary'
                />
                Simpan hasil ke jadwal
              </label>

              <button
                type='submit'
                disabled={generating || loading}
                className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {generating
                  ? 'Membuat Plan...'
                  : saveToSchedule
                    ? 'Generate & Simpan'
                    : 'Generate Preview'}
              </button>
            </div>
          </form>

          {message && (
            <div className='mt-5 rounded-lg bg-background px-4 py-3'>
              <p className='font-body text-body-sm text-text'>{message}</p>
            </div>
          )}
        </Card>

        {plan && (
          <Card className='mt-6 p-5 sm:p-6'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <h2 className='font-heading text-heading-lg font-bold text-text'>
                  Hasil Rencana Workout
                </h2>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {days.length > 0
                    ? `${days.length} hari berhasil diterima dari AI.`
                    : 'Belum ada rencana latihan yang dapat ditampilkan.'}
                </p>
              </div>

              {profile && (
                <span className='w-fit rounded-full bg-primary/10 px-3 py-1 font-body text-body-sm font-semibold text-primary'>
                  {profile.fitnessGoal || profile.fitness_goal || '-'} ·{' '}
                  {profile.fitnessLevel || profile.fitness_level || '-'}
                </span>
              )}
            </div>

            {days.length === 0 ? (
              <div className='mt-6 rounded-lg bg-background px-5 py-6 text-center'>
                <p className='font-body text-body-sm leading-relaxed text-text'>
                  AI belum mengembalikan daftar workout. Silakan coba generate
                  kembali atau periksa response dari backend.
                </p>
              </div>
            ) : (
              <>
                <div className='mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                  {days.map((day, index) => {
                    const exercises = Array.isArray(day.exercises)
                      ? day.exercises
                      : [];

                    const isRestDay =
                      day.title?.toLowerCase() === 'rest day' ||
                      exercises.length === 0;

                    return (
                      <div
                        key={`${day.date || index}-${index}`}
                        className='flex min-h-[220px] flex-col rounded-lg bg-background p-5'
                      >
                        <div className='flex items-start justify-between gap-3'>
                          <div>
                            <p className='font-heading text-lg font-semibold text-text'>
                              {formatIndonesiaDate(day.date)}
                            </p>

                            <h3 className='mt-2 font-heading text-lg font-bold text-text'>
                              {day.title || 'Workout'}
                            </h3>
                          </div>

                          <span
                            className={`shrink-0 rounded-full px-3 py-1 font-body text-body-sm font-semibold ${
                              isRestDay
                                ? 'bg-surface text-text'
                                : 'bg-primary/10 text-primary'
                            }`}
                          >
                            {isRestDay
                              ? 'Istirahat'
                              : `${exercises.length} latihan`}
                          </span>
                        </div>

                        <p className='mt-3 font-body text-body-sm text-text'>
                          {isRestDay
                            ? 'Hari istirahat untuk pemulihan tubuh.'
                            : formatFocusMuscle(day.focus_muscle)}
                        </p>

                        <div className='mt-auto pt-5'>
                          <button
                            type='button'
                            onClick={() => setSelectedDay(day)}
                            className='w-full rounded-lg bg-surface px-4 py-2.5 font-body text-body-sm font-semibold text-text shadow-sm transition hover:bg-primary hover:text-white'
                          >
                            Selengkapnya
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {saveToSchedule && (
                  <div className='mt-6 flex flex-col gap-3 rounded-lg bg-background p-5 sm:flex-row sm:items-center sm:justify-between'>
                    <div>
                      <p className='font-body text-body-sm font-semibold text-text'>
                        Jadwal tersimpan
                      </p>

                      <p className='mt-1 font-body text-body-sm text-text'>
                        {savedCount} jadwal baru berhasil disimpan oleh backend.
                      </p>
                    </div>

                    <button
                      type='button'
                      onClick={() =>
                        navigate('/schedule', {
                          state: {
                            startDate,
                            endDate: addDays(startDate, 6),
                          },
                        })
                      }
                      className='rounded-lg bg-primary px-4 py-2.5 font-body text-body-sm font-semibold text-white transition hover:opacity-90'
                    >
                      Lihat Jadwal
                    </button>
                  </div>
                )}
              </>
            )}
          </Card>
        )}
      </div>

      {selectedDay && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-8'
          onClick={() => setSelectedDay(null)}
        >
          <div
            role='dialog'
            aria-modal='true'
            className='max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-surface shadow-xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='p-6 sm:p-7'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='font-body text-body-sm font-semibold text-primary'>
                    {formatIndonesiaDate(selectedDay.date)}
                  </p>

                  <h2 className='mt-2 font-heading text-heading-lg font-bold text-text'>
                    {selectedDay.title || 'Workout'}
                  </h2>

                  <p className='mt-2 font-body text-body-sm text-text'>
                    {selectedDay.focus_muscle
                      ? formatFocusMuscle(selectedDay.focus_muscle)
                      : 'Hari istirahat'}
                  </p>
                </div>

                <button
                  type='button'
                  onClick={() => setSelectedDay(null)}
                  aria-label='Tutup detail workout'
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-text transition hover:bg-background'
                >
                  ×
                </button>
              </div>

              <div className='mt-5 flex flex-wrap gap-2'>
                <span className='rounded-full bg-primary/10 px-3 py-1 font-body text-body-sm font-semibold text-primary'>
                  Status: {formatStatus(selectedDay.status)}
                </span>

                {!selectedDay.exercises?.length && (
                  <span className='rounded-full bg-background px-3 py-1 font-body text-body-sm font-semibold text-text'>
                    Rest Day
                  </span>
                )}
              </div>

              {Array.isArray(selectedDay.exercises) &&
              selectedDay.exercises.length > 0 ? (
                <div className='mt-7 space-y-4'>
                  {selectedDay.exercises.map((exercise, index) => (
                    <div
                      key={`${exercise.name}-${index}`}
                      className='rounded-lg bg-background p-5'
                    >
                      <div className='flex items-start gap-4'>
                        <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-body-sm font-bold text-white'>
                          {index + 1}
                        </div>

                        <div className='min-w-0'>
                          <h3 className='font-heading text-lg font-bold text-text'>
                            {exercise.name}
                          </h3>

                          <p className='mt-1 font-body text-body-sm text-text'>
                            {exercise.target || '-'}
                          </p>
                        </div>
                      </div>

                      <div className='mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4'>
                        <div className='rounded-lg bg-surface p-3'>
                          <p className='font-body text-body-sm text-text'>
                            Kelompok otot
                          </p>

                          <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                            {exercise.muscle_group || '-'}
                          </p>
                        </div>

                        <div className='rounded-lg bg-surface p-3'>
                          <p className='font-body text-body-sm text-text'>
                            Peralatan
                          </p>

                          <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                            {exercise.equipment || '-'}
                          </p>
                        </div>

                        <div className='rounded-lg bg-surface p-3'>
                          <p className='font-body text-body-sm text-text'>
                            Set × Repetisi
                          </p>

                          <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                            {exercise.sets ?? '-'} × {exercise.reps ?? '-'}
                          </p>
                        </div>

                        <div className='rounded-lg bg-surface p-3'>
                          <p className='font-body text-body-sm text-text'>
                            Istirahat
                          </p>

                          <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                            {exercise.rest_seconds ?? '-'} detik
                          </p>
                        </div>
                      </div>

                      {exercise.progression_note && (
                        <div className='mt-4 rounded-lg bg-surface p-4'>
                          <p className='font-body text-body-sm leading-relaxed text-text'>
                            <span className='font-semibold'>
                              Catatan progresi:
                            </span>{' '}
                            {exercise.progression_note}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className='mt-7 rounded-lg bg-background p-5'>
                  <p className='font-body text-body-sm leading-relaxed text-text'>
                    Hari ini merupakan hari istirahat. Tidak ada latihan yang
                    perlu dilakukan.
                  </p>
                </div>
              )}

              <button
                type='button'
                onClick={() => setSelectedDay(null)}
                className='mt-6 w-full rounded-lg bg-accent py-3 font-body text-body-sm font-semibold text-white transition hover:brightness-95'
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
