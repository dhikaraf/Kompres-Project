import { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import {
  addMealFood,
  createMealPlan,
  getMealPlans,
  getFoodById,
  searchFoods,
} from '../../services/featureApi';

const today = new Date().toISOString().slice(0, 10);

function getList(response, keys = []) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  for (const key of keys) {
    if (Array.isArray(response?.data?.[key])) return response.data[key];
    if (Array.isArray(response?.[key])) return response[key];
  }
  return [];
}

function number(value) {
  const result = Number(value);
  return Number.isFinite(result) ? result : 0;
}

export default function Nutrition() {
  const [date, setDate] = useState(today);
  const [plans, setPlans] = useState([]);
  const [foods, setFoods] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [portion, setPortion] = useState(100);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [mealForm, setMealForm] = useState({
    meal_type: 'breakfast',
    target_calories: 500,
    is_ai_generated: false,
  });
  const [customForm, setCustomForm] = useState({
    food_name_custom: '',
    portion_g: 100,
    calculated_calories: 0,
    calculated_protein: 0,
    calculated_carbs: 0,
    calculated_fat: 0,
    calculated_sugar: 0,
    calculated_fiber: 0,
  });

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await getMealPlans(date);
      setPlans(getList(response, ['mealPlans', 'meals']));
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Data pola makan gagal dimuat.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, [date]);

  useEffect(() => {
    const loadFoods = async () => {
      try {
        const response = await searchFoods();
        setFoods(getList(response, ['foods']));
      } catch (error) {
        setMessage('Daftar makanan gagal dimuat.');
      }
    };
    loadFoods();
  }, []);

  const calculated = useMemo(() => {
    if (!selectedFood) return null;
    const serving = number(
      selectedFood.servingSizeG ?? selectedFood.serving_size_g ?? 100,
    );
    const ratio = number(portion) / (serving || 100);

    return {
      calories: number(selectedFood.calories) * ratio,
      protein: number(selectedFood.proteinG ?? selectedFood.protein_g) * ratio,
      carbs: number(selectedFood.carbsG ?? selectedFood.carbs_g) * ratio,
      fat: number(selectedFood.fatG ?? selectedFood.fat_g) * ratio,
      sugar: number(selectedFood.sugarG ?? selectedFood.sugar_g) * ratio,
      fiber: number(selectedFood.fiberG ?? selectedFood.fiber_g) * ratio,
    };
  }, [selectedFood, portion]);

  const handleCreateMealPlan = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage('');
      await createMealPlan({
        date,
        meal_type: mealForm.meal_type,
        target_calories: Number(mealForm.target_calories),
        is_ai_generated: mealForm.is_ai_generated,
      });
      setMessage('Meal plan berhasil dibuat.');
      await loadPlans();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Meal plan gagal dibuat.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFood = async (mealPlanId) => {
    if (!mealPlanId || !selectedFood || !calculated) {
      setMessage('Pilih meal plan dan makanan terlebih dahulu.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      await addMealFood(mealPlanId, {
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
      await loadPlans();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Makanan gagal ditambahkan.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustom = async (mealPlanId) => {
    if (!mealPlanId || !customForm.food_name_custom.trim()) {
      setMessage('Isi nama makanan custom dan pilih meal plan.');
      return;
    }

    try {
      setSaving(true);
      setMessage('');
      await addMealFood(mealPlanId, {
        ...customForm,
        food_name_custom: customForm.food_name_custom.trim(),
        portion_g: Number(customForm.portion_g),
        calculated_calories: Number(customForm.calculated_calories),
        calculated_protein: Number(customForm.calculated_protein),
        calculated_carbs: Number(customForm.calculated_carbs),
        calculated_fat: Number(customForm.calculated_fat),
        calculated_sugar: Number(customForm.calculated_sugar),
        calculated_fiber: Number(customForm.calculated_fiber),
      });
      setMessage('Makanan custom berhasil ditambahkan.');
      await loadPlans();
    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Makanan custom gagal ditambahkan.',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleFoodSelect = async (event) => {
    const id = event.target.value;
    if (!id) {
      setSelectedFood(null);
      return;
    }

    const localFood = foods.find((food) => food.id === id);
    setSelectedFood(localFood || null);

    try {
      const response = await getFoodById(id);
      setSelectedFood(response?.data || response || localFood);
    } catch {
      // List response is already enough for calculation if detail endpoint fails.
    }
  };

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
        <h1 className='font-heading text-heading-xl font-bold text-text'>
          Pola Makan & Kalori
        </h1>
        <p className='mt-2 font-body text-body leading-relaxed text-text'>
          Atur meal plan, tambahkan makanan, dan catat asupan berdasarkan data
          makanan yang tersedia.
        </p>

        <Card className='mt-8 p-5 sm:p-6'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between'>
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
        </Card>

        <div className='mt-6 grid gap-6 lg:grid-cols-2'>
          <Card className='p-5 sm:p-6'>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Buat Meal Plan
            </h2>
            <form onSubmit={handleCreateMealPlan} className='mt-6 space-y-4'>
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

              <label className='flex items-center gap-3 font-body text-body-sm text-text'>
                <input
                  type='checkbox'
                  checked={mealForm.is_ai_generated}
                  onChange={(event) =>
                    setMealForm((current) => ({
                      ...current,
                      is_ai_generated: event.target.checked,
                    }))
                  }
                />
                Meal plan dibuat oleh AI
              </label>

              <button
                type='submit'
                disabled={saving}
                className='rounded-lg bg-accent px-5 py-3 font-body text-body-sm font-semibold text-white disabled:opacity-60'
              >
                {saving ? 'Menyimpan...' : 'Buat Meal Plan'}
              </button>
            </form>
          </Card>

          <Card className='p-5 sm:p-6'>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Tambahkan Makanan
            </h2>
            <div className='mt-6 space-y-4'>
              <div>
                <label className='block font-body text-body-sm font-semibold text-text'>
                  Makanan
                </label>
                <select
                  value={selectedFood?.id || ''}
                  onChange={handleFoodSelect}
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
                <div className='grid grid-cols-2 gap-3 rounded-lg bg-background p-4 sm:grid-cols-3'>
                  <span className='font-body text-body-sm'>
                    {Math.round(calculated.calories)} kkal
                  </span>
                  <span className='font-body text-body-sm'>
                    P {calculated.protein.toFixed(1)}g
                  </span>
                  <span className='font-body text-body-sm'>
                    K {calculated.carbs.toFixed(1)}g
                  </span>
                  <span className='font-body text-body-sm'>
                    L {calculated.fat.toFixed(1)}g
                  </span>
                  <span className='font-body text-body-sm'>
                    G {calculated.sugar.toFixed(1)}g
                  </span>
                  <span className='font-body text-body-sm'>
                    Serat {calculated.fiber.toFixed(1)}g
                  </span>
                </div>
              )}

              <p className='font-body text-body-sm text-text'>
                Pilih meal plan di daftar bawah untuk menentukan tempat makanan
                ini disimpan.
              </p>
            </div>
          </Card>
        </div>

        <Card className='mt-6 p-5 sm:p-6'>
          <h2 className='font-heading text-heading-lg font-bold text-text'>
            Makanan Custom
          </h2>
          <p className='mt-1 font-body text-body-sm text-text'>
            Gunakan bagian ini untuk makanan yang tidak tersedia di master data.
          </p>

          <div className='mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
            {Object.entries({
              food_name_custom: 'Nama Makanan',
              portion_g: 'Porsi (gram)',
              calculated_calories: 'Kalori',
              calculated_protein: 'Protein',
              calculated_carbs: 'Karbohidrat',
              calculated_fat: 'Lemak',
              calculated_sugar: 'Gula',
              calculated_fiber: 'Serat',
            }).map(([name, label]) => (
              <div key={name}>
                <label className='block font-body text-body-sm font-semibold text-text'>
                  {label}
                </label>
                <input
                  name={name}
                  type={name === 'food_name_custom' ? 'text' : 'number'}
                  value={customForm[name]}
                  onChange={(event) =>
                    setCustomForm((current) => ({
                      ...current,
                      [name]: event.target.value,
                    }))
                  }
                  className='mt-2 w-full rounded-lg border border-primary/10 bg-surface px-4 py-3 font-body text-body text-text outline-none'
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className='mt-6 p-5 sm:p-6'>
          <h2 className='font-heading text-heading-lg font-bold text-text'>
            Meal Plan {date}
          </h2>

          {message && (
            <p className='mt-4 font-body text-body-sm text-text'>{message}</p>
          )}

          {loading ? (
            <p className='mt-6 font-body text-body text-text'>
              Memuat meal plan...
            </p>
          ) : plans.length === 0 ? (
            <div className='mt-6 rounded-lg bg-background px-4 py-6 text-center'>
              <p className='font-body text-body text-text'>
                Belum ada meal plan untuk tanggal ini.
              </p>
            </div>
          ) : (
            <div className='mt-6 space-y-4'>
              {plans.map((plan, index) => {
                const mealPlanId = plan.id || plan.mealPlanId;
                const details = Array.isArray(plan.details)
                  ? plan.details
                  : Array.isArray(plan.items)
                    ? plan.items
                    : [];

                return (
                  <div
                    key={mealPlanId || index}
                    className='rounded-lg bg-background p-4'
                  >
                    <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between'>
                      <div>
                        <p className='font-heading text-lg font-semibold text-text'>
                          {plan.mealType || plan.meal_type || 'Waktu Makan'}
                        </p>
                        <p className='mt-1 font-body text-body-sm text-text'>
                          Target:{' '}
                          {plan.targetCalories ?? plan.target_calories ?? '-'}{' '}
                          kkal
                        </p>
                      </div>

                      {mealPlanId && (
                        <div className='flex flex-wrap gap-2'>
                          <button
                            type='button'
                            onClick={() => handleAddFood(mealPlanId)}
                            disabled={saving || !selectedFood}
                            className='rounded-lg bg-primary px-4 py-2.5 font-body text-body-sm font-semibold text-white disabled:opacity-50'
                          >
                            Tambah Makanan Terpilih
                          </button>
                          <button
                            type='button'
                            onClick={() => handleAddCustom(mealPlanId)}
                            disabled={saving}
                            className='rounded-lg bg-accent px-4 py-2.5 font-body text-body-sm font-semibold text-white disabled:opacity-50'
                          >
                            Tambah Custom
                          </button>
                        </div>
                      )}
                    </div>

                    {details.length > 0 && (
                      <div className='mt-4 space-y-2'>
                        {details.map((detail, detailIndex) => (
                          <div
                            key={detail.id || detailIndex}
                            className='rounded-lg bg-surface p-3 shadow-sm'
                          >
                            <p className='font-body text-body-sm font-semibold text-text'>
                              {detail.foodName ||
                                detail.food_name_custom ||
                                detail.name ||
                                'Makanan'}
                            </p>
                            <p className='mt-1 font-body text-[13px] text-text'>
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
