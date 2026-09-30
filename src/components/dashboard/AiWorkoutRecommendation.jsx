import { useEffect, useState } from 'react';
import Card from '../common/Card';
import { getProfile } from '../../services/api';
import { recommendWorkout } from '../../services/featureApi';

const goalLabels = {
  lose: 'Menurunkan Berat Badan',
  gain: 'Menambah Berat Badan',
  healthy: 'Menjaga Kesehatan',
};

const levelLabels = {
  easy: 'Mudah',
  medium: 'Sedang',
  intermediate: 'Menengah',
};

export default function AiWorkoutRecommendation() {
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [lastFocus, setLastFocus] = useState('');
  const [targetDate, setTargetDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
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

      const payload = {
        fitness_level: profile?.fitnessLevel || profile?.fitness_level,
        fitness_goal: profile?.fitnessGoal || profile?.fitness_goal,
        last_workout_focus: lastFocus || null,
        target_date: targetDate,
      };

      const response = await recommendWorkout(payload);
      setResult(response?.data || response);
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Rekomendasi latihan gagal dibuat.',
      );
    } finally {
      setGenerating(false);
    }
  };

  const exercises = Array.isArray(result?.exercises) ? result.exercises : [];

  return (
    <Card className='p-5 sm:p-6'>
      <div>
        <h2 className='font-heading text-heading-lg font-bold text-text'>
          Rekomendasi Latihan AI
        </h2>
        <p className='mt-2 font-body text-body-sm leading-relaxed text-text'>
          Buat rekomendasi latihan berdasarkan profil kebugaran dan latihan
          terakhir Anda.
        </p>
      </div>

      <form
        onSubmit={handleGenerate}
        className='mt-6 grid gap-4 sm:grid-cols-2'
      >
        <div>
          <label className='block font-body text-body-sm font-semibold text-text'>
            Level Kebugaran
          </label>
          <input
            value={
              loading
                ? ''
                : levelLabels[
                    profile?.fitnessLevel || profile?.fitness_level
                  ] || ''
            }
            readOnly
            className='mt-2 w-full rounded-lg border border-primary/10 bg-background px-4 py-3 font-body text-body text-text outline-none'
            placeholder='Diambil dari profil'
          />
        </div>

        <div>
          <label className='block font-body text-body-sm font-semibold text-text'>
            Tujuan Kebugaran
          </label>
          <input
            value={
              loading
                ? ''
                : goalLabels[profile?.fitnessGoal || profile?.fitness_goal] ||
                  ''
            }
            readOnly
            className='mt-2 w-full rounded-lg border border-primary/10 bg-background px-4 py-3 font-body text-body text-text outline-none'
            placeholder='Diambil dari profil'
          />
        </div>

        <div>
          <label className='block font-body text-body-sm font-semibold text-text'>
            Fokus Latihan Terakhir
          </label>
          <input
            value={lastFocus}
            onChange={(event) => setLastFocus(event.target.value)}
            placeholder='Contoh: Chest & Triceps'
            className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
          />
        </div>

        <div>
          <label className='block font-body text-body-sm font-semibold text-text'>
            Tanggal Target
          </label>
          <input
            type='date'
            value={targetDate}
            onChange={(event) => setTargetDate(event.target.value)}
            className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
          />
        </div>

        <div className='sm:col-span-2'>
          <button
            type='submit'
            disabled={generating || loading}
            className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'
          >
            {generating ? 'Membuat Rekomendasi...' : 'Buat Rekomendasi'}
          </button>
        </div>
      </form>

      {message && (
        <p className='mt-4 font-body text-body-sm text-text'>{message}</p>
      )}

      {result && (
        <div className='mt-7 rounded-lg bg-background p-5'>
          <div className='flex flex-wrap items-start justify-between gap-4'>
            <div>
              <p className='font-body text-body-sm font-semibold text-primary'>
                {result.focusMuscle ||
                  result.focus_muscle ||
                  'Fokus belum tersedia'}
              </p>
              <h3 className='mt-2 font-heading text-heading-lg font-bold text-text'>
                {result.title || result.name || 'Rekomendasi Workout'}
              </h3>
            </div>
            {result.durationMinutes != null && (
              <span className='rounded-full bg-primary/10 px-3 py-1 font-body text-body-sm font-semibold text-primary'>
                {result.durationMinutes} menit
              </span>
            )}
          </div>

          {exercises.length > 0 && (
            <div className='mt-5 space-y-3'>
              {exercises.map((exercise, index) => (
                <div
                  key={`${exercise.name}-${index}`}
                  className='rounded-lg bg-surface p-4 shadow-sm'
                >
                  <p className='font-body text-body-sm font-semibold text-text'>
                    {exercise.name}
                  </p>
                  <p className='mt-1 font-body text-body-sm text-text'>
                    {exercise.sets} set × {exercise.reps} repetisi · Istirahat{' '}
                    {exercise.restSec ?? exercise.rest_sec ?? '-'} detik
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
