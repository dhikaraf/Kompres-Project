import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import { getProfile, recommendMeal } from '../../services/api';
import {
  addMealFood,
  createMealPlan,
  getMealPlans,
  searchFoods,
} from '../../services/featureApi';

function getTodayIndonesia() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

function getList(response, keys = []) {
  if (Array.isArray(response)) return response;

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  for (const key of keys) {
    if (Array.isArray(response?.data?.[key])) {
      return response.data[key];
    }

    if (Array.isArray(response?.[key])) {
      return response[key];
    }
  }

  return [];
}

function number(value) {
  const result = Number(value);

  return Number.isFinite(result) ? result : 0;
}

export default function Nutrition() {
  const [date, setDate] = useState(getTodayIndonesia());

  const [profile, setProfile] = useState(null);
  const [nutritionData, setNutritionData] = useState(null);
  const [plans, setPlans] = useState([]);
  const [foods, setFoods] = useState([]);

  const [selectedRecommendation, setSelectedRecommendation] = useState(null);

  const [showMealForm, setShowMealForm] = useState(false);
  const [showFoodForm, setShowFoodForm] = useState(false);

  const [selectedMealPlanId, setSelectedMealPlanId] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(100);

  const [mealForm, setMealForm] = useState({
    meal_type: 'breakfast',
    target_calories: 500,
  });

  const [loading, setLoading] = useState(true);
  const [loadingNutrition, setLoadingNutrition] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /*
   * Memuat profil user dan rekomendasi nutrisi AI.
   */
  useEffect(() => {
    const loadNutrition = async () => {
      try {
        setLoadingNutrition(true);
        setError('');

        const profileResponse = await getProfile();
        const currentProfile = profileResponse?.data || profileResponse;

        setProfile(currentProfile);

        if (!currentProfile) {
          throw new Error('Profil pengguna belum tersedia.');
        }

        const mealResponse = await recommendMeal({
          weight: number(currentProfile.weight),
          height: number(currentProfile.height),
          age: number(currentProfile.age),
          gender: currentProfile.gender,
          fitness_goal: currentProfile.fitnessGoal,
          fitness_level: currentProfile.fitnessLevel,
          workout_intensity: 'high',
        });

        setNutritionData(mealResponse?.data || mealResponse);
      } catch (requestError) {
        console.error('Gagal memuat nutrisi:', requestError);

        setError(
          requestError.response?.data?.message ||
            requestError.message ||
            'Data nutrisi gagal dimuat.',
        );
      } finally {
        setLoadingNutrition(false);
      }
    };

    loadNutrition();
  }, []);

  /*
   * Memuat meal plan berdasarkan tanggal yang dipilih.
   */
  const loadPlans = async () => {
    try {
      setLoading(true);

      const response = await getMealPlans(date);

      setPlans(getList(response, ['mealPlans', 'meals']));
    } catch (requestError) {
      console.error('Gagal memuat meal plan:', requestError);

      setMessage(
        requestError.response?.data?.message || 'Data meal plan gagal dimuat.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [date]);

  /*
   * Memuat daftar makanan hanya ketika
   * fitur Tambahkan Makanan dibuka.
   */
  useEffect(() => {
    if (!showFoodForm) return;

    const loadFoods = async () => {
      try {
        const response = await searchFoods();

        setFoods(getList(response, ['foods']));
      } catch (requestError) {
        console.error('Gagal memuat makanan:', requestError);

        setMessage('Daftar makanan gagal dimuat.');
      }
    };

    loadFoods();
  }, [showFoodForm]);

  /*
   * Menghitung nilai nutrisi berdasarkan porsi.
   */
  const calculated = useMemo(() => {
    if (!selectedFood) return null;

    const servingSize = number(
      selectedFood.servingSizeG ?? selectedFood.serving_size_g ?? 100,
    );

    const ratio = number(portion) / (servingSize || 100);

    return {
      calories: number(selectedFood.calories) * ratio,
      protein: number(selectedFood.proteinG ?? selectedFood.protein_g) * ratio,
      carbs: number(selectedFood.carbsG ?? selectedFood.carbs_g) * ratio,
      fat: number(selectedFood.fatG ?? selectedFood.fat_g) * ratio,
      sugar: number(selectedFood.sugarG ?? selectedFood.sugar_g) * ratio,
      fiber: number(selectedFood.fiberG ?? selectedFood.fiber_g) * ratio,
    };
  }, [selectedFood, portion]);

  /*
   * Membuat meal plan baru.
   */
  const handleCreateMealPlan = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage('');

      await createMealPlan({
        date,
        meal_type: mealForm.meal_type,
        target_calories: Number(mealForm.target_calories),
        is_ai_generated: false,
      });

      setMessage('Meal plan berhasil dibuat.');

      setShowMealForm(false);

      await loadPlans();
    } catch (requestError) {
      console.error('Gagal membuat meal plan:', requestError);

      setMessage(
        requestError.response?.data?.message || 'Meal plan gagal dibuat.',
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Menambahkan makanan ke meal plan.
   */
  const handleAddFood = async (event) => {
    event.preventDefault();

    if (!selectedMealPlanId || !selectedFood || !calculated) {
      setMessage('Pilih meal plan dan makanan terlebih dahulu.');

      return;
    }

    try {
      setSaving(true);
      setMessage('');

      await addMealFood(selectedMealPlanId, {
        food_id: selectedFood.id,
        portion_g: Number(portion),
        calculated_calories: calculated.calories,
        calculated_protein: calculated.protein,
        calculated_carbs: calculated.carbs,
        calculated_fat: calculated.fat,
        calculated_sugar: calculated.sugar,
        calculated_fiber: calculated.fiber,
      });

      setMessage('Makanan berhasil ditambahkan ke meal plan.');

      setSelectedFood(null);
      setSelectedMealPlanId('');
      setPortion(100);

      setShowFoodForm(false);

      await loadPlans();
    } catch (requestError) {
      console.error('Gagal menambahkan makanan:', requestError);

      setMessage(
        requestError.response?.data?.message || 'Makanan gagal ditambahkan.',
      );
    } finally {
      setSaving(false);
    }
  };

  const recommendedFoods = nutritionData?.recommendedFoods || [];

  const targetCalories = number(nutritionData?.targetCalories);

  const protein = number(nutritionData?.macroDistribution?.proteinG);

  const carbs = number(nutritionData?.macroDistribution?.carbsG);

  const fat = number(nutritionData?.macroDistribution?.fatG);

  const username = profile?.name || profile?.username || 'Pengguna';

  if (loadingNutrition) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
          <Card className='flex min-h-[300px] items-center justify-center'>
            <p className='font-body text-body text-text'>
              Memuat rekomendasi nutrisi...
            </p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
          <Card className='px-6 py-8 text-center'>
            <h1 className='font-heading text-heading-lg font-bold text-text'>
              Nutrisi tidak dapat dimuat
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
        {/* HEADER */}
        <div>
          <h1 className='font-heading text-heading-xl font-bold text-text'>
            Nutrisi
          </h1>

          <p className='mt-2 max-w-3xl font-body text-body leading-relaxed text-text'>
            Pantau kebutuhan nutrisi dan atur meal plan berdasarkan profil
            kebugaran Anda.
          </p>
        </div>

        {/* RINGKASAN AI */}
        <section className='mt-8'>
          <h2 className='font-heading text-heading-lg font-bold text-text'>
            Rekomendasi Nutrisi AI
          </h2>

          <div className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            <Card className='p-5'>
              <p className='font-body text-body-sm text-text'>Target Kalori</p>

              <p className='mt-2 font-heading text-2xl font-bold text-text'>
                {targetCalories} kkal
              </p>
            </Card>

            <Card className='p-5'>
              <p className='font-body text-body-sm text-text'>Protein</p>

              <p className='mt-2 font-heading text-2xl font-bold text-text'>
                {protein} g
              </p>
            </Card>

            <Card className='p-5'>
              <p className='font-body text-body-sm text-text'>Karbohidrat</p>

              <p className='mt-2 font-heading text-2xl font-bold text-text'>
                {carbs} g
              </p>
            </Card>

            <Card className='p-5'>
              <p className='font-body text-body-sm text-text'>Lemak</p>

              <p className='mt-2 font-heading text-2xl font-bold text-text'>
                {fat} g
              </p>
            </Card>
          </div>
        </section>

        {/* REKOMENDASI MAKANAN */}
        <section className='mt-12'>
          <div>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Rekomendasi Makanan
            </h2>

            <p className='mt-2 font-body text-body-sm text-text'>
              Pilihan makanan yang direkomendasikan berdasarkan profil dan
              target kebugaran Anda.
            </p>
          </div>

          {recommendedFoods.length === 0 ? (
            <Card className='mt-5 px-6 py-8 text-center'>
              <p className='font-body text-body-sm text-text'>
                Belum ada rekomendasi makanan.
              </p>
            </Card>
          ) : (
            <div className='mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
              {recommendedFoods.map((food) => (
                <Card key={food.id} className='flex h-full flex-col p-4'>
                  <div className='flex-1'>
                    <h3 className='font-heading text-lg font-semibold leading-snug text-text'>
                      {food.name}
                    </h3>

                    <p className='mt-2 font-body text-body-sm text-text'>
                      {food.category}
                    </p>

                    <div className='mt-4 space-y-1'>
                      <p className='font-body text-body-sm text-text'>
                        {food.servingSizeG ?? food.serving_size_g ?? 0} g
                      </p>

                      <p className='font-body text-body-sm font-medium text-text'>
                        {food.calories ?? 0} kkal
                      </p>
                    </div>
                  </div>

                  <button
                    type='button'
                    onClick={() => setSelectedRecommendation(food)}
                    className='mt-5 w-full rounded-lg bg-primary px-4 py-2.5 font-body text-body-sm font-semibold text-white transition hover:opacity-90'
                  >
                    Detail
                  </button>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* MEAL PLAN */}
        <section className='mt-12'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
            <div>
              <h2 className='font-heading text-heading-lg font-bold text-text'>
                Meal Plan
              </h2>

              <p className='mt-2 font-body text-body-sm text-text'>
                Kelola pola makan Anda untuk tanggal yang dipilih.
              </p>
            </div>

            <div>
              <label className='block font-body text-body-sm font-semibold text-text'>
                Tanggal
              </label>

              <input
                type='date'
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className='mt-2 rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none focus:border-primary'
              />
            </div>
          </div>

          <div className='mt-5 flex flex-wrap gap-3'>
            <button
              type='button'
              onClick={() => {
                setShowMealForm((current) => !current);
                setShowFoodForm(false);
              }}
              className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white'
            >
              {showMealForm ? 'Tutup Form' : 'Buat Meal Plan'}
            </button>

            {plans.length > 0 && (
              <button
                type='button'
                onClick={() => {
                  setShowFoodForm((current) => !current);
                  setShowMealForm(false);
                }}
                className='rounded-lg bg-primary px-5 py-3 font-body text-body-sm font-semibold text-white'
              >
                {showFoodForm ? 'Tutup Form' : 'Tambahkan Makanan'}
              </button>
            )}
          </div>

          {message && (
            <p className='mt-4 font-body text-body-sm text-text'>{message}</p>
          )}

          {/* FORM BUAT MEAL PLAN */}
          {showMealForm && (
            <Card className='mt-5 p-5 sm:p-6'>
              <h3 className='font-heading text-heading-lg font-bold text-text'>
                Buat Meal Plan
              </h3>

              <form
                onSubmit={handleCreateMealPlan}
                className='mt-5 grid gap-4 sm:grid-cols-2'
              >
                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Waktu Makan
                  </label>

                  <select
                    value={mealForm.meal_type}
                    onChange={(event) =>
                      setMealForm((current) => ({
                        ...current,
                        meal_type: event.target.value,
                      }))
                    }
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none'
                  >
                    <option value='breakfast'>Sarapan</option>

                    <option value='lunch'>Makan Siang</option>

                    <option value='dinner'>Makan Malam</option>

                    <option value='snack'>Snack</option>
                  </select>
                </div>

                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Target Kalori
                  </label>

                  <input
                    type='number'
                    min='0'
                    value={mealForm.target_calories}
                    onChange={(event) =>
                      setMealForm((current) => ({
                        ...current,
                        target_calories: event.target.value,
                      }))
                    }
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none'
                  />
                </div>

                <div className='sm:col-span-2'>
                  <button
                    type='submit'
                    disabled={saving}
                    className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white disabled:opacity-60'
                  >
                    {saving ? 'Menyimpan...' : 'Simpan Meal Plan'}
                  </button>
                </div>
              </form>
            </Card>
          )}

          {/* FORM TAMBAH MAKANAN */}
          {showFoodForm && (
            <Card className='mt-5 p-5 sm:p-6'>
              <h3 className='font-heading text-heading-lg font-bold text-text'>
                Tambahkan Makanan
              </h3>

              <form onSubmit={handleAddFood} className='mt-5 space-y-4'>
                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Meal Plan
                  </label>

                  <select
                    value={selectedMealPlanId}
                    onChange={(event) =>
                      setSelectedMealPlanId(event.target.value)
                    }
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none'
                  >
                    <option value=''>Pilih meal plan</option>

                    {plans.map((plan) => {
                      const mealPlanId = plan.id || plan.mealPlanId;

                      const mealType =
                        plan.mealType || plan.meal_type || 'Waktu Makan';

                      return (
                        <option key={mealPlanId} value={mealPlanId}>
                          {mealType}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Makanan
                  </label>

                  <select
                    value={selectedFood?.id || ''}
                    onChange={(event) => {
                      const id = event.target.value;

                      const food =
                        foods.find((item) => String(item.id) === String(id)) ||
                        null;

                      setSelectedFood(food);
                    }}
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none'
                  >
                    <option value=''>Pilih makanan</option>

                    {foods.map((food) => (
                      <option key={food.id} value={food.id}>
                        {food.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className='block font-body text-body-sm font-semibold text-text'>
                    Porsi (gram)
                  </label>

                  <input
                    type='number'
                    min='1'
                    value={portion}
                    onChange={(event) => setPortion(event.target.value)}
                    className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none'
                  />
                </div>

                {calculated && (
                  <div className='grid gap-3 rounded-lg bg-background p-4 sm:grid-cols-3'>
                    <p className='font-body text-body-sm text-text'>
                      {Math.round(calculated.calories)} kkal
                    </p>

                    <p className='font-body text-body-sm text-text'>
                      Protein {calculated.protein.toFixed(1)} g
                    </p>

                    <p className='font-body text-body-sm text-text'>
                      Karbohidrat {calculated.carbs.toFixed(1)} g
                    </p>

                    <p className='font-body text-body-sm text-text'>
                      Lemak {calculated.fat.toFixed(1)} g
                    </p>

                    <p className='font-body text-body-sm text-text'>
                      Gula {calculated.sugar.toFixed(1)} g
                    </p>

                    <p className='font-body text-body-sm text-text'>
                      Serat {calculated.fiber.toFixed(1)} g
                    </p>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={saving || !selectedFood || !selectedMealPlanId}
                  className='rounded-lg bg-primary px-5 py-3 font-body text-body-sm font-semibold text-white disabled:opacity-50'
                >
                  {saving ? 'Menyimpan...' : 'Simpan Makanan'}
                </button>
              </form>
            </Card>
          )}

          {/* DAFTAR MEAL PLAN */}
          <div className='mt-6'>
            {loading ? (
              <Card className='p-6'>
                <p className='font-body text-body text-text'>
                  Memuat meal plan...
                </p>
              </Card>
            ) : plans.length === 0 ? (
              <Card className='p-6 text-center'>
                <p className='font-body text-body text-text'>
                  Belum ada meal plan untuk tanggal ini.
                </p>
              </Card>
            ) : (
              <div className='space-y-4'>
                {plans.map((plan, index) => {
                  const mealPlanId = plan.id || plan.mealPlanId;

                  const mealType =
                    plan.mealType || plan.meal_type || 'Waktu Makan';

                  const target =
                    plan.targetCalories ?? plan.target_calories ?? '-';

                  const details = Array.isArray(plan.details)
                    ? plan.details
                    : Array.isArray(plan.items)
                      ? plan.items
                      : [];

                  return (
                    <Card key={mealPlanId || index} className='p-5 sm:p-6'>
                      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                        <div>
                          <h3 className='font-heading text-xl font-semibold text-text'>
                            {mealType}
                          </h3>

                          <p className='mt-1 font-body text-body-sm text-text'>
                            Target {target} kkal
                          </p>
                        </div>

                        <button
                          type='button'
                          onClick={() => {
                            setSelectedMealPlanId(String(mealPlanId));

                            setShowFoodForm(true);
                            setShowMealForm(false);
                          }}
                          className='rounded-lg bg-primary px-4 py-2.5 font-body text-body-sm font-semibold text-white'
                        >
                          Tambahkan Makanan
                        </button>
                      </div>

                      {details.length === 0 ? (
                        <p className='mt-5 font-body text-body-sm text-text'>
                          Belum ada makanan pada meal plan ini.
                        </p>
                      ) : (
                        <div className='mt-5 space-y-2'>
                          {details.map((detail, detailIndex) => (
                            <div
                              key={detail.id || detailIndex}
                              className='rounded-lg bg-background p-4'
                            >
                              <p className='font-body text-body-sm font-semibold text-text'>
                                {detail.foodName ||
                                  detail.food_name_custom ||
                                  detail.name ||
                                  'Makanan'}
                              </p>

                              <p className='mt-1 font-body text-body-sm text-text'>
                                {detail.portionG ?? detail.portion_g ?? '-'} g ·{' '}
                                {detail.calculatedCalories ??
                                  detail.calculated_calories ??
                                  '-'}{' '}
                                kkal
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {selectedRecommendation && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5'>
          <Card className='w-full max-w-md p-6'>
            <div className='flex items-start justify-between gap-4'>
              <div>
                <h2 className='font-heading text-heading-lg font-bold text-text'>
                  {selectedRecommendation.name}
                </h2>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {selectedRecommendation.category}
                </p>
              </div>

              <button
                type='button'
                onClick={() => setSelectedRecommendation(null)}
                className='font-body text-xl leading-none text-text'
                aria-label='Tutup detail makanan'
              >
                ×
              </button>
            </div>

            <div className='mt-6 space-y-3'>
              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>
                  Ukuran Porsi
                </span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.servingSizeG ??
                    selectedRecommendation.serving_size_g ??
                    0}{' '}
                  g
                </span>
              </div>

              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>Kalori</span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.calories ?? 0} kkal
                </span>
              </div>

              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>
                  Protein
                </span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.proteinG ??
                    selectedRecommendation.protein_g ??
                    0}{' '}
                  g
                </span>
              </div>

              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>
                  Karbohidrat
                </span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.carbsG ??
                    selectedRecommendation.carbs_g ??
                    0}{' '}
                  g
                </span>
              </div>

              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>Lemak</span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.fatG ??
                    selectedRecommendation.fat_g ??
                    0}{' '}
                  g
                </span>
              </div>

              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>Gula</span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.sugarG ??
                    selectedRecommendation.sugar_g ??
                    0}{' '}
                  g
                </span>
              </div>

              <div className='flex items-center justify-between gap-4'>
                <span className='font-body text-body-sm text-text'>Serat</span>

                <span className='font-body text-body-sm font-semibold text-text'>
                  {selectedRecommendation.fiberG ??
                    selectedRecommendation.fiber_g ??
                    0}{' '}
                  g
                </span>
              </div>
            </div>

            <button
              type='button'
              onClick={() => setSelectedRecommendation(null)}
              className='mt-6 w-full rounded-lg bg-primary px-4 py-3 font-body text-body-sm font-semibold text-white transition hover:opacity-90'
            >
              Tutup
            </button>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
