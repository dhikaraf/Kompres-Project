import api from './api';

const unwrap = (response) => response?.data ?? response;

export const getStreak = async () => unwrap(await api.get('/streaks'));

export const checkInStreak = async () =>
  unwrap(await api.post('/streaks/check-in'));

export const getSchedules = async ({ startDate, endDate }) =>
  unwrap(
    await api.get('/schedules', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    }),
  );

export const createSchedule = async (data) =>
  unwrap(await api.post('/schedules', data));

export const updateScheduleStatus = async (scheduleId, status) =>
  unwrap(await api.patch(`/schedules/${scheduleId}`, { status }));

export const deleteSchedule = async (scheduleId) =>
  unwrap(await api.delete(`/schedules/${scheduleId}`));

export const getWorkoutHistories = async ({ page = 1, limit = 10 } = {}) =>
  unwrap(
    await api.get('/workouts/histories', {
      params: { page, limit },
    }),
  );

export const recordWorkoutCompleted = async (data) =>
  unwrap(await api.post('/workouts/histories', data));

export const getMealPlans = async (date) =>
  unwrap(
    await api.get('/meals', {
      params: { date },
    }),
  );

export const createMealPlan = async (data) =>
  unwrap(await api.post('/meals', data));

export const addMealFood = async (mealPlanId, data) =>
  unwrap(await api.post(`/meals/${mealPlanId}/details`, data));

export const searchFoods = async ({ search = '', category = '' } = {}) =>
  unwrap(
    await api.get('/foods', {
      params: {
        ...(search ? { search } : {}),
        ...(category ? { category } : {}),
      },
    }),
  );

export const getFoodById = async (foodId) =>
  unwrap(await api.get(`/foods/${foodId}`));

export const recommendWorkout = async (data) =>
  unwrap(await api.post('/ai/recommend-workout', data));

export const generateWorkoutPlan = async (data) =>
  unwrap(await api.post('/ai/generate-workout-plan', data));
