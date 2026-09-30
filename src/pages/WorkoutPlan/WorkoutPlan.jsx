import { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import { getProfile } from '../../services/api';
import { generateWorkoutPlan } from '../../services/featureApi';

function extractPlan(response) {
  return response?.data || response;
}

export default function WorkoutPlan() {
  const [profile, setProfile] = useState(null);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [saveToSchedule, setSaveToSchedule] = useState(true);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const response = await getProfile();
        setProfile(response?.data || response);
      } catch (error) {
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
        ? { start_date: startDate, save_to_schedule: true }
        : { save_to_schedule: false };

      const response = await generateWorkoutPlan(payload);
      setPlan(extractPlan(response));
      setMessage(
        saveToSchedule
          ? 'Workout plan berhasil dibuat dan disimpan ke jadwal.'
          : 'Preview workout plan berhasil dibuat.',
      );
    } catch (error) {
      setMessage(error.response?.data?.message || 'Workout plan gagal dibuat.');
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

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
        <h1 className='font-heading text-heading-xl font-bold text-text'>
          Rencana Workout 7 Hari
        </h1>
        <p className='mt-2 font-body text-body leading-relaxed text-text'>
          Generate rencana latihan dari AI dan pilih apakah hasilnya langsung
          disimpan ke jadwal.
        </p>

        <Card className='mt-8 p-5 sm:p-6'>
          <form onSubmit={handleGenerate} className='grid gap-4 sm:grid-cols-2'>
            <div>
              <label className='block font-body text-body-sm font-semibold text-text'>
                Tanggal Mulai
              </label>
              <input
                type='date'
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                disabled={!saveToSchedule}
                className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none disabled:opacity-50'
              />
            </div>

            <label className='flex items-center gap-3 pt-8 font-body text-body-sm text-text'>
              <input
                type='checkbox'
                checked={saveToSchedule}
                onChange={(event) => setSaveToSchedule(event.target.checked)}
              />
              Simpan hasil ke jadwal
            </label>

            <div className='sm:col-span-2'>
              <button
                type='submit'
                disabled={generating || loading}
                className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white disabled:opacity-60'
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
            <p className='mt-4 font-body text-body-sm text-text'>{message}</p>
          )}
        </Card>

        {plan && (
          <Card className='mt-6 p-5 sm:p-6'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <h2 className='font-heading text-heading-lg font-bold text-text'>
                  Hasil Rencana Workout
                </h2>
                {plan.saved_schedules_count != null && (
                  <p className='mt-1 font-body text-body-sm text-text'>
                    Jadwal tersimpan: {plan.saved_schedules_count}
                  </p>
                )}
              </div>

              {profile && (
                <span className='rounded-full bg-primary/10 px-3 py-1 font-body text-body-sm font-semibold text-primary'>
                  {profile.fitnessGoal || profile.fitness_goal || '-'} ·{' '}
                  {profile.fitnessLevel || profile.fitness_level || '-'}
                </span>
              )}
            </div>

            {days.length === 0 ? (
              <p className='mt-6 font-body text-body-sm text-text'>
                Response berhasil diterima, tetapi struktur daftar hari belum
                dikenali oleh frontend. Periksa response di Network/Postman.
              </p>
            ) : (
              <div className='mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {days.map((day, index) => (
                  <div key={index} className='rounded-lg bg-background p-4'>
                    <p className='font-heading text-lg font-semibold text-text'>
                      {day.day || day.date || `Hari ${index + 1}`}
                    </p>
                    <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                      {day.title ||
                        day.focusMuscle ||
                        day.focus_muscle ||
                        'Rest'}
                    </p>
                    {day.progression_note && (
                      <p className='mt-2 font-body text-[13px] leading-relaxed text-text'>
                        {day.progression_note}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
