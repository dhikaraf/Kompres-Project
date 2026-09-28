import { useState } from 'react';
import { useUser } from '../../context/UserContext';

import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import FoodCard from '../../components/dashboard/FoodCard';
import WorkoutCard from '../../components/dashboard/WorkoutCard';

const nutritionPlan = {
  level: 'Mudah',
  calories: 2400,
  protein: 90,
  carbs: 120,
  fat: 80,
};

const foodRecommendations = [
  {
    id: 1,
    category: 'Tinggi Protein',
    name: 'Salmon Panggang & Sayuran',
    protein: 45,
    carbs: 72,
    fat: 20,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    category: 'Seimbang',
    name: 'Ayam Panggang & Salad',
    protein: 42,
    carbs: 55,
    fat: 16,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    category: 'Tinggi Protein',
    name: 'Bowl Ayam & Alpukat',
    protein: 48,
    carbs: 64,
    fat: 22,
    image:
      'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    category: 'Sehat',
    name: 'Bowl Sayuran & Telur',
    protein: 28,
    carbs: 58,
    fat: 18,
    image:
      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    category: 'Tinggi Protein',
    name: 'Tuna Panggang & Sayuran',
    protein: 46,
    carbs: 48,
    fat: 14,
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    category: 'Seimbang',
    name: 'Nasi Ayam & Sayuran',
    protein: 38,
    carbs: 76,
    fat: 15,
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  },
];

const workoutRecommendations = [
  {
    id: 1,
    level: 'Mudah',
    name: 'Bench Press',
    sets: 3,
    reps: 8,
    rest: 90,
    recommendedWeight: 10,
    image:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    level: 'Mudah',
    name: 'Squat',
    sets: 3,
    reps: 10,
    rest: 90,
    recommendedWeight: 15,
    image:
      'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    level: 'Sedang',
    name: 'Shoulder Press',
    sets: 3,
    reps: 10,
    rest: 60,
    recommendedWeight: 8,
    image:
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    level: 'Sedang',
    name: 'Lat Pulldown',
    sets: 3,
    reps: 12,
    rest: 60,
    recommendedWeight: 20,
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    level: 'Mudah',
    name: 'Bicep Curl',
    sets: 3,
    reps: 12,
    rest: 60,
    recommendedWeight: 6,
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    level: 'Sedang',
    name: 'Leg Press',
    sets: 4,
    reps: 10,
    rest: 90,
    recommendedWeight: 40,
    image:
      'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
  },
];

const goalLabels = {
  'lose-weight': 'menurunkan berat badan',
  'gain-weight': 'menambah berat badan',
  'stay-healthy': 'menjaga kesehatan',
};

export default function Dashboard() {
  const { user } = useUser();

  const [showAllFoods, setShowAllFoods] = useState(false);
  const [showAllWorkouts, setShowAllWorkouts] = useState(false);

  const username = user?.username || 'Pengguna';

  const goal = goalLabels[user?.goal] || 'mencapai tujuan kebugaran';

  const handleMoreFood = (food) => {
    console.log('Makanan yang dipilih:', food);
  };

  const handleMoreWorkout = (workout) => {
    console.log('Latihan yang dipilih:', workout);
  };

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

          {/* AI Nutrition Plan */}
          <Card className='p-5 sm:p-6'>
            <div className='flex flex-wrap items-center gap-3'>
              <h2 className='font-heading text-heading-lg font-bold text-text'>
                Rencana Nutrisi AI
              </h2>

              <span className='rounded-full bg-gray-100 px-3 py-1 font-body text-body-sm font-medium text-text'>
                Level: {nutritionPlan.level}
              </span>
            </div>

            <p className='mt-2 font-body text-body-sm leading-relaxed text-text sm:text-body'>
              Pembagian kebutuhan nutrisi berdasarkan aktivitas dan beban
              latihan Anda.
            </p>

            <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4'>
              {/* Kalori */}
              <div className='col-span-2 flex items-center rounded-lg bg-primary px-4 py-4 sm:col-span-1 sm:flex-col sm:items-start sm:justify-center'>
                <span className='font-heading text-3xl font-bold text-white'>
                  {nutritionPlan.calories.toLocaleString('id-ID')}
                </span>

                <span className='ml-2 font-body text-body-sm text-white sm:ml-0 sm:mt-1'>
                  Kkal / Hari
                </span>
              </div>

              {/* Protein */}
              <div className='rounded-lg bg-accent px-4 py-3 text-white'>
                <p className='font-body text-body-sm font-semibold'>Protein</p>

                <p className='mt-1 font-body text-body-sm'>
                  {nutritionPlan.protein}g / Hari
                </p>
              </div>

              {/* Karbohidrat */}
              <div className='rounded-lg bg-accent px-4 py-3 text-white'>
                <p className='font-body text-body-sm font-semibold'>
                  Karbohidrat
                </p>

                <p className='mt-1 font-body text-body-sm'>
                  {nutritionPlan.carbs}g / Hari
                </p>
              </div>

              {/* Lemak */}
              <div className='rounded-lg bg-accent px-4 py-3 text-white'>
                <p className='font-body text-body-sm font-semibold'>Lemak</p>

                <p className='mt-1 font-body text-body-sm'>
                  {nutritionPlan.fat}g / Hari
                </p>
              </div>
            </div>
          </Card>
        </section>

        {/* =====================================================
            SECTION 2
            AI FOOD RECOMMENDATION
            ===================================================== */}
        <section className='mt-16'>
          {/* Judul */}
          <div>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Rekomendasi Makanan AI
            </h2>

            <p className='mt-2 max-w-3xl font-body text-body-sm leading-relaxed text-text sm:text-body'>
              Semua rekomendasi makanan yang sesuai dengan profil dan tujuan
              Anda.
            </p>
          </div>

          {/* Tombol Lihat Semua */}
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

          {/* Card makanan */}
          {!showAllFoods ? (
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
            SECTION 3
            AI WORKOUT RECOMMENDATION
            ===================================================== */}
        <section className='mt-16'>
          {/* Judul */}
          <div>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Rekomendasi Latihan AI
            </h2>

            <p className='mt-2 max-w-3xl font-body text-body-sm leading-relaxed text-text sm:text-body'>
              Semua rekomendasi latihan yang disesuaikan dengan profil dan
              tujuan kebugaran Anda.
            </p>
          </div>

          {/* Tombol Lihat Semua */}
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

          {/* Card workout */}
          {!showAllWorkouts ? (
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
    </DashboardLayout>
  );
}
