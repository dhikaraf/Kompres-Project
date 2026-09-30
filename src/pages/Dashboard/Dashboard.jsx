import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import api, { recommendMeal, recommendWorkout } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import FoodCard from '../../components/dashboard/FoodCard';
import WorkoutCard from '../../components/dashboard/WorkoutCard';
import AiWorkoutRecommendation from '../../components/dashboard/AiWorkoutRecommendation';
import ScheduleCard from '../../components/dashboard/ScheduleCard';
import StreakCard from '../../components/dashboard/StreakCard';
import { getSchedules } from '../../services/featureApi';

const goalLabels = {
  lose: 'menurunkan berat badan',
  gain: 'menambah berat badan',
  healthy: 'menjaga kesehatan',
};

const fitnessLevelLabels = {
  easy: 'Mudah',
  medium: 'Sedang',
  intermediate: 'Menengah',
};

const workoutImages = [
  'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
];

export default function Dashboard() {
  const { user } = useUser();

  const [dashboardData, setDashboardData] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [workoutData, setWorkoutData] = useState(null);
  const [todaySchedules, setTodaySchedules] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAllFoods, setShowAllFoods] = useState(false);
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);

  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showNutritionDetails, setShowNutritionDetails] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        /*
         * 1. Ambil data dashboard user
         */
        const dashboardResponse = await api.get('/dashboard');

        const dashboard = dashboardResponse.data?.data || null;

        setDashboardData(dashboard);
        const today = new Intl.DateTimeFormat('en-CA', {
          timeZone: 'Asia/Jakarta',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).format(new Date());

        const schedulesResponse = await getSchedules({
          startDate: today,
          endDate: today,
        });

        const scheduleData = Array.isArray(schedulesResponse)
          ? schedulesResponse
          : Array.isArray(schedulesResponse?.data)
            ? schedulesResponse.data
            : Array.isArray(schedulesResponse?.schedules)
              ? schedulesResponse.schedules
              : Array.isArray(schedulesResponse?.data?.schedules)
                ? schedulesResponse.data.schedules
                : [];

        setTodaySchedules(scheduleData);

        /*
         * 2. Ambil profile dari dashboard
         */
        const profile = dashboard?.profile;

        /*
         * 3. Ambil rekomendasi nutrisi AI
         */
        if (profile) {
          const mealResponse = await recommendMeal({
            weight: Number(profile.weight),
            height: Number(profile.height),
            age: Number(profile.age),
            gender: profile.gender,
            fitness_goal: profile.fitnessGoal,
            fitness_level: profile.fitnessLevel,

            /*
             * Sementara menggunakan intensitas high
             * karena frontend belum memiliki input intensitas latihan.
             */
            workout_intensity: 'high',
          });

          setNutritionData(mealResponse?.data || null);

          /*
           * 4. Ambil rekomendasi latihan AI
           */
          const workoutResponse = await recommendWorkout({
            fitness_level: profile.fitnessLevel,
            fitness_goal: profile.fitnessGoal,
            last_workout_focus: '',
            target_date: new Date().toISOString().split('T')[0],
          });

          setWorkoutData(workoutResponse?.data || null);
        }
      } catch (requestError) {
        console.error('Gagal mengambil data dashboard:', requestError);

        setError(
          requestError.response?.data?.message ||
            'Data dashboard gagal dimuat.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  /*
   * Data dashboard
   */
  const dashboardUser = dashboardData?.user;

  const profile = dashboardData?.profile;

  /*
   * Greeting
   */
  const username =
    dashboardUser?.name || user?.name || user?.username || 'Pengguna';

  /*
   * Goal
   */
  const goal = goalLabels[profile?.fitnessGoal] || 'mencapai tujuan kebugaran';

  /*
   * Fitness level
   */
  const fitnessLevel =
    fitnessLevelLabels[profile?.fitnessLevel] || 'Belum ditentukan';

  /*
   * Data nutrisi AI
   */
  const targetCalories = nutritionData?.targetCalories;

  const protein = nutritionData?.macroDistribution?.proteinG;

  const carbs = nutritionData?.macroDistribution?.carbsG;

  const fat = nutritionData?.macroDistribution?.fatG;

  /*
   * Rekomendasi makanan AI
   */
  const foodRecommendations =
    nutritionData?.recommendedFoods?.map((food) => ({
      id: food.id,
      category: food.category,
      name: food.name,
      servingSize: Number(food.servingSizeG),
      calories: Number(food.calories),
      protein: Number(food.proteinG),
      carbs: Number(food.carbsG),
      fat: Number(food.fatG),
      sugar: Number(food.sugarG),
      fiber: Number(food.fiberG),
    })) || [];

  /*
   * Rekomendasi latihan AI
   *
   * Backend memberikan:
   * - name
   * - sets
   * - reps
   * - restSec
   *
   * WorkoutCard menggunakan:
   * - name
   * - sets
   * - reps
   * - rest
   */
  const workoutRecommendations =
    workoutData?.exercises?.map((exercise, index) => ({
      id: `${workoutData.title}-${index}`,
      level: fitnessLevelLabels[workoutData.fitnessLevel] || 'Belum ditentukan',
      name: exercise.name,
      sets: exercise.sets,
      reps: exercise.reps,
      rest: exercise.restSec,
      recommendedWeight: null,
      image: workoutImages[index % workoutImages.length],

      title: workoutData.title,
      focusMuscle: workoutData.focusMuscle,
      durationMinutes: workoutData.durationMinutes,
      aiNotes: workoutData.aiNotes,
    })) || [];

  /*
   * Tombol Selengkapnya
   */
  const handleMoreFood = (food) => {
    setSelectedFood(food);
  };

  const handleMoreWorkout = (workout) => {
    setSelectedWorkout(workout);
  };

  /*
   * Loading
   */
  if (loading) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
          <Card className='flex min-h-[300px] items-center justify-center'>
            <p className='font-body text-body text-text'>Memuat dashboard...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  /*
   * Error
   */
  if (error) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
          <Card className='px-6 py-8 text-center'>
            <h1 className='font-heading text-heading-lg font-bold text-text'>
              Dashboard tidak dapat dimuat
            </h1>

            <p className='mt-3 font-body text-body-sm text-text'>{error}</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
        {/* =====================================================
            SECTION 1
            GREETING + AI NUTRITION PLAN
            ===================================================== */}

        <section className='grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]'>
          {/* Greeting */}
          <div className='px-0 py-4 lg:px-8'>
            <h1 className='font-heading text-heading-xl font-bold leading-tight text-text'>
              Selamat datang, {username} 👋
            </h1>

            <p className='mt-5 max-w-[560px] font-body text-body leading-relaxed text-text'>
              Kondisi kesehatan Anda sedang diarahkan untuk{' '}
              <span className='font-semibold'>{goal}</span>. Berdasarkan profil
              Anda, berikut adalah rekomendasi nutrisi yang dapat membantu
              mendukung aktivitas dan target kebugaran Anda hari ini.
            </p>
          </div>

          {/* Rincian Nutrisi AI */}
          <Card className='p-5 sm:p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 className='font-heading text-heading-lg font-bold text-text'>
                  Rincian Nutrisi AI
                </h2>

                <p className='mt-1 font-body text-body-sm text-text'>
                  Kebutuhan kalori harian berdasarkan profil Anda.
                </p>
              </div>

              <span className='shrink-0 rounded-full bg-primary/10 px-3 py-1 font-body text-body-sm font-semibold text-primary'>
                {fitnessLevel}
              </span>
            </div>

            <div className='mt-6 rounded-lg bg-primary px-5 py-5 text-white'>
              <p className='font-body text-body-sm'>Target Kalori Harian</p>

              <p className='mt-1 font-heading text-4xl font-bold'>
                {targetCalories != null
                  ? `${Number(targetCalories).toLocaleString('id-ID')} kkal`
                  : '—'}
              </p>

              <p className='mt-1 font-body text-body-sm'>
                Disesuaikan dengan tujuan kebugaran Anda.
              </p>
            </div>

            <button
              type='button'
              onClick={() => setShowNutritionDetails((current) => !current)}
              className='mt-5 flex w-full items-center justify-between rounded-lg bg-background px-4 py-3 text-left transition hover:bg-primary/5'
            >
              <span className='font-body text-body-sm font-semibold text-text'>
                Detail Profil AI
              </span>

              <span className='font-body text-body-sm font-semibold text-primary'>
                {showNutritionDetails ? 'Sembunyikan' : 'Tampilkan'}
              </span>
            </button>

            {showNutritionDetails && (
              <div className='mt-4 space-y-4'>
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
                  <div className='rounded-lg bg-background p-4'>
                    <p className='font-body text-body-sm text-text'>BMR</p>

                    <p className='mt-1 font-heading text-xl font-bold text-primary'>
                      {nutritionData?.bmr != null
                        ? `${Number(nutritionData.bmr).toLocaleString('id-ID')} kkal`
                        : '—'}
                    </p>
                  </div>

                  <div className='rounded-lg bg-background p-4'>
                    <p className='font-body text-body-sm text-text'>TDEE</p>

                    <p className='mt-1 font-heading text-xl font-bold text-primary'>
                      {nutritionData?.tdee != null
                        ? `${Number(nutritionData.tdee).toLocaleString('id-ID')} kkal`
                        : '—'}
                    </p>
                  </div>
                </div>

                <div>
                  <p className='font-heading text-lg font-bold text-text'>
                    Makronutrisi Harian
                  </p>

                  <div className='mt-3 grid grid-cols-3 gap-3'>
                    <div className='rounded-lg bg-background p-3'>
                      <p className='font-body text-body-sm text-text'>
                        Protein
                      </p>

                      <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                        {protein != null ? `${protein}g` : '—'}
                      </p>
                    </div>

                    <div className='rounded-lg bg-background p-3'>
                      <p className='font-body text-body-sm text-text'>
                        Karbohidrat
                      </p>

                      <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                        {carbs != null ? `${carbs}g` : '—'}
                      </p>
                    </div>

                    <div className='rounded-lg bg-background p-3'>
                      <p className='font-body text-body-sm text-text'>Lemak</p>

                      <p className='mt-1 font-body text-body-sm font-semibold text-primary'>
                        {fat != null ? `${fat}g` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* =====================================================
            SECTION 2
            JADWAL + STREAK
            ===================================================== */}

        <section className='mt-8 grid grid-cols-1 items-stretch gap-5 md:grid-cols-2'>
          <div className='h-full'>
            <ScheduleCard schedules={todaySchedules} />
          </div>

          <div className='h-full'>
            <StreakCard streak={dashboardData?.streak} />
          </div>
        </section>

        {/* =====================================================
            SECTION 3
            AI WORKOUT RECOMMENDATION DENGAN INPUT USER
            ===================================================== */}

        <section className='mt-10'>
          <AiWorkoutRecommendation />
        </section>

        {/* =====================================================
            SECTION 4
            FOOD RECOMMENDATION
            ===================================================== */}

        <section className='mt-16'>
          <div>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Rekomendasi Makanan AI
            </h2>

            <p className='mt-2 max-w-3xl font-body text-body-sm leading-relaxed text-text sm:text-body'>
              Semua rekomendasi makanan yang sesuai dengan profil dan tujuan
              Anda.
            </p>
          </div>

          <div className='mt-4 flex justify-end'>
            <button
              type='button'
              onClick={() => setShowAllFoods((current) => !current)}
              className='inline-flex items-center gap-3 rounded-lg bg-surface px-4 py-2.5 font-body text-body-sm font-medium text-text shadow-sm transition hover:shadow-md'
            >
              <span>{showAllFoods ? 'Tampilkan Geser' : 'Lihat Semua'}</span>

              <span className='text-lg leading-none'>
                {showAllFoods ? '←' : '→'}
              </span>
            </button>
          </div>

          {foodRecommendations.length === 0 ? (
            <Card className='mt-5 px-6 py-8 text-center'>
              <p className='font-body text-body-sm text-text'>
                Belum ada rekomendasi makanan untuk ditampilkan.
              </p>
            </Card>
          ) : !showAllFoods ? (
            <div className='mt-5 overflow-x-auto pb-4'>
              <div className='flex w-max gap-5'>
                {foodRecommendations.map((food) => (
                  <FoodCard key={food.id} food={food} onMore={handleMoreFood} />
                ))}
              </div>
            </div>
          ) : (
            <div className='mt-5 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {foodRecommendations.map((food) => (
                <FoodCard key={food.id} food={food} onMore={handleMoreFood} />
              ))}
            </div>
          )}
        </section>

        {/* =====================================================
            SECTION 5
            WORKOUT RECOMMENDATION
            ===================================================== */}

        <section className='mt-16'>
          <div>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Rekomendasi Latihan AI
            </h2>

            <p className='mt-2 max-w-3xl font-body text-body-sm leading-relaxed text-text sm:text-body'>
              {workoutData?.title
                ? `${workoutData.title} — ${workoutData.focusMuscle}.`
                : 'Semua rekomendasi latihan yang disesuaikan dengan profil dan tujuan kebugaran Anda.'}
            </p>
          </div>

          <div className='mt-4 flex justify-end'>
            <button
              type='button'
              onClick={() => setShowAllWorkouts((current) => !current)}
              className='inline-flex items-center gap-3 rounded-lg bg-surface px-4 py-2.5 font-body text-body-sm font-medium text-text shadow-sm transition hover:shadow-md'
            >
              <span>{showAllWorkouts ? 'Tampilkan Geser' : 'Lihat Semua'}</span>

              <span className='text-lg leading-none'>
                {showAllWorkouts ? '←' : '→'}
              </span>
            </button>
          </div>

          {workoutRecommendations.length === 0 ? (
            <Card className='mt-5 px-6 py-8 text-center'>
              <p className='font-body text-body-sm text-text'>
                Belum ada rekomendasi latihan untuk ditampilkan.
              </p>
            </Card>
          ) : !showAllWorkouts ? (
            <div className='mt-5 overflow-x-auto pb-4'>
              <div className='flex w-max gap-5'>
                {workoutRecommendations.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onMore={handleMoreWorkout}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className='mt-5 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              {workoutRecommendations.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onMore={handleMoreWorkout}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          MODAL DETAIL MAKANAN
          ===================================================== */}

      {selectedFood && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-8'
          onClick={() => setSelectedFood(null)}
        >
          <div
            role='dialog'
            aria-modal='true'
            className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface shadow-xl'
            onClick={(event) => event.stopPropagation()}
          >
            <div className='p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='font-body text-body-sm font-semibold text-primary'>
                    {selectedFood.category}
                  </p>

                  <h2 className='mt-2 font-heading text-heading-lg font-bold text-text'>
                    {selectedFood.name}
                  </h2>
                </div>

                <button
                  type='button'
                  onClick={() => setSelectedFood(null)}
                  aria-label='Tutup detail makanan'
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-text transition hover:bg-background'
                >
                  ×
                </button>
              </div>

              <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3'>
                {/* Ukuran Porsi */}
                <div className='rounded-lg bg-primary px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>
                    Ukuran Porsi
                  </p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedFood.servingSize ?? '—'} g
                  </p>
                </div>

                {/* Kalori */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>Kalori</p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedFood.calories ?? '—'} Kkal
                  </p>
                </div>

                {/* Protein */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>
                    Protein
                  </p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedFood.protein ?? '—'} g
                  </p>
                </div>

                {/* Karbohidrat */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>
                    Karbohidrat
                  </p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedFood.carbs ?? '—'} g
                  </p>
                </div>

                {/* Lemak */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>Lemak</p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedFood.fat ?? '—'} g
                  </p>
                </div>

                {/* Gula */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>Gula</p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedFood.sugar ?? '—'} g
                  </p>
                </div>
              </div>

              {/* Serat */}
              <div className='mt-4 rounded-lg bg-background p-4'>
                <p className='font-body text-body-sm text-text'>
                  Serat:{' '}
                  <span className='font-semibold'>
                    {selectedFood.fiber ?? '—'} g
                  </span>
                </p>
              </div>

              <button
                type='button'
                onClick={() => setSelectedFood(null)}
                className='mt-6 w-full rounded-lg bg-accent py-3 font-body text-body-sm font-semibold text-white transition hover:brightness-95'
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MODAL DETAIL LATIHAN
          ===================================================== */}

      {selectedWorkout && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5 py-8'
          onClick={() => setSelectedWorkout(null)}
        >
          <div
            role='dialog'
            aria-modal='true'
            className='max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-surface shadow-xl'
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={selectedWorkout.image}
              alt={selectedWorkout.name}
              className='h-52 w-full object-cover'
            />

            <div className='p-6'>
              <div className='flex items-start justify-between gap-4'>
                <div>
                  <p className='font-body text-body-sm font-semibold text-primary'>
                    {selectedWorkout.level}
                  </p>

                  <h2 className='mt-2 font-heading text-heading-lg font-bold text-text'>
                    {selectedWorkout.name}
                  </h2>
                </div>

                <button
                  type='button'
                  onClick={() => setSelectedWorkout(null)}
                  aria-label='Tutup detail latihan'
                  className='flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl text-text transition hover:bg-background'
                >
                  ×
                </button>
              </div>

              <div className='mt-5 space-y-2 font-body text-body-sm text-text'>
                <p>
                  Program:{' '}
                  <span className='font-semibold'>
                    {selectedWorkout.title || '—'}
                  </span>
                </p>

                <p>
                  Fokus otot:{' '}
                  <span className='font-semibold'>
                    {selectedWorkout.focusMuscle || '—'}
                  </span>
                </p>

                <p>
                  Durasi:{' '}
                  <span className='font-semibold'>
                    {selectedWorkout.durationMinutes != null
                      ? `${selectedWorkout.durationMinutes} menit`
                      : '—'}
                  </span>
                </p>
              </div>

              <div className='mt-6 grid grid-cols-3 gap-3'>
                {/* Set */}
                <div className='rounded-lg bg-primary px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>Set</p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedWorkout.sets ?? '—'}
                  </p>
                </div>

                {/* Repetisi */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>
                    Repetisi
                  </p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedWorkout.reps ?? '—'}
                  </p>
                </div>

                {/* Istirahat */}
                <div className='rounded-lg bg-accent px-3 py-3 text-white'>
                  <p className='font-body text-body-sm font-semibold'>
                    Istirahat
                  </p>

                  <p className='mt-1 font-body text-body-sm'>
                    {selectedWorkout.rest != null
                      ? `${selectedWorkout.rest} detik`
                      : '—'}
                  </p>
                </div>
              </div>

              {selectedWorkout.aiNotes && (
                <div className='mt-6 rounded-lg bg-background p-4'>
                  <p className='font-body text-body-sm leading-relaxed text-text'>
                    {selectedWorkout.aiNotes}
                  </p>
                </div>
              )}

              <button
                type='button'
                onClick={() => setSelectedWorkout(null)}
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
