import { useEffect, useState } from 'react';

import DashboardLayout from '../../layouts/DashboardLayout';

import Card from '../../components/common/Card';

import InputField from '../../components/common/InputField';

import Counter from '../../components/common/Counter';

import { useUser } from '../../context/UserContext';

import { getProfile, updateProfile } from '../../services/api';

const goalLabels = {
  lose: 'Menurunkan Berat Badan',
  gain: 'Menambah Berat Badan',
  healthy: 'Menjaga Kesehatan',
};

const genderLabels = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

const fitnessLevelLabels = {
  easy: 'Mudah',
  medium: 'Sedang',
  intermediate: 'Menengah',
};

const goalOptions = [
  {
    value: 'lose',
    label: 'Menurunkan Berat Badan',
  },
  {
    value: 'gain',
    label: 'Menambah Berat Badan',
  },
  {
    value: 'healthy',
    label: 'Menjaga Kesehatan',
  },
];

const fitnessLevelOptions = [
  {
    value: 'easy',
    label: 'Mudah',
  },
  {
    value: 'medium',
    label: 'Sedang',
  },
  {
    value: 'intermediate',
    label: 'Menengah',
  },
];

const genderOptions = [
  {
    value: 'male',
    label: 'Laki-laki',
  },
  {
    value: 'female',
    label: 'Perempuan',
  },
];

export default function Profile() {
  const { user, updateUser } = useUser();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState('');

  const [successMessage, setSuccessMessage] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fitnessGoal: '',
    fitnessLevel: '',
    gender: '',
    age: 23,
    weight: 50,
    height: 150,
  });

  /*
   * Mengambil data profile dari backend
   */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await getProfile();

        const profileData =
          response?.data?.profile ||
          response?.data ||
          response?.profile ||
          null;

        setProfile(profileData);

        if (profileData) {
          setFormData({
            fitnessGoal: profileData.fitnessGoal || '',
            fitnessLevel: profileData.fitnessLevel || '',
            gender: profileData.gender || '',
            age: Number(profileData.age) || 23,
            weight: Number(profileData.weight) || 50,
            height: Number(profileData.height) || 150,
          });
        }
      } catch (requestError) {
        console.error('Gagal mengambil profile:', requestError);

        setError(
          requestError.response?.data?.message || 'Data profile gagal dimuat.',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  /*
   * Nilai tampilan
   */
  const username = user?.name || user?.username || 'Pengguna';

  const email = user?.email || '-';

  const goal = goalLabels[profile?.fitnessGoal] || 'Belum ditentukan';

  const fitnessLevel =
    fitnessLevelLabels[profile?.fitnessLevel] || 'Belum ditentukan';

  const gender = genderLabels[profile?.gender] || 'Belum ditentukan';

  const age =
    profile?.age !== null && profile?.age !== undefined
      ? `${profile.age} tahun`
      : 'Belum diisi';

  const weight =
    profile?.weight !== null && profile?.weight !== undefined
      ? `${profile.weight} kg`
      : 'Belum diisi';

  const height =
    profile?.height !== null && profile?.height !== undefined
      ? `${profile.height} cm`
      : 'Belum diisi';

  const initial = username.charAt(0).toUpperCase();

  /*
   * Perubahan form
   */
  const handleGoalChange = (value) => {
    setFormData((current) => ({
      ...current,
      fitnessGoal: value,
    }));
  };

  const handleFitnessLevelChange = (value) => {
    setFormData((current) => ({
      ...current,
      fitnessLevel: value,
    }));
  };

  const handleGenderChange = (value) => {
    setFormData((current) => ({
      ...current,
      gender: value,
    }));
  };

  /*
   * Simpan profile
   */
  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');

      const data = {
        gender: formData.gender,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        fitness_level: formData.fitnessLevel,
        fitness_goal: formData.fitnessGoal,
      };

      await updateProfile(data);

      /*
       * Update tampilan profile
       */
      const updatedProfile = {
        ...profile,
        gender: formData.gender,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
        fitnessLevel: formData.fitnessLevel,
        fitnessGoal: formData.fitnessGoal,
      };

      setProfile(updatedProfile);

      /*
       * Sinkronkan state user frontend
       */
      updateUser({
        goal:
          formData.fitnessGoal === 'lose'
            ? 'lose-weight'
            : formData.fitnessGoal === 'gain'
              ? 'gain-weight'
              : 'stay-healthy',
        fitness_level: formData.fitnessLevel,
        gender: formData.gender,
        age: Number(formData.age),
        weight: Number(formData.weight),
        height: Number(formData.height),
      });

      setIsEditing(false);

      setSuccessMessage('Profil berhasil diperbarui.');
    } catch (requestError) {
      console.error('Gagal memperbarui profile:', requestError);

      setError(
        requestError.response?.data?.message || 'Profil gagal diperbarui.',
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * Batalkan edit
   */
  const handleCancel = () => {
    if (profile) {
      setFormData({
        fitnessGoal: profile.fitnessGoal || '',
        fitnessLevel: profile.fitnessLevel || '',
        gender: profile.gender || '',
        age: Number(profile.age) || 23,
        weight: Number(profile.weight) || 50,
        height: Number(profile.height) || 150,
      });
    }

    setError('');
    setSuccessMessage('');
    setIsEditing(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
          <Card className='flex min-h-[300px] items-center justify-center'>
            <p className='font-body text-body text-text'>Memuat profile...</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !profile) {
    return (
      <DashboardLayout>
        <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
          <Card className='px-6 py-8 text-center'>
            <h1 className='font-heading text-heading-lg font-bold text-text'>
              Profile tidak dapat dimuat
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
        {/* =========================================
            PROFILE SUMMARY
            ========================================= */}

        <Card className='px-6 py-7 sm:px-8 sm:py-8'>
          <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-center'>
            {/* Avatar */}
            <div className='flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary sm:h-36 sm:w-36'>
              <span className='font-heading text-5xl font-bold text-white'>
                {initial}
              </span>
            </div>

            {/* Informasi utama */}
            <div className='flex flex-1 flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex flex-col items-center gap-3 sm:flex-row'>
                <h1 className='font-heading text-heading-xl font-bold text-text'>
                  {username}
                </h1>

                <span className='rounded-full bg-gray-100 px-3 py-1 font-body text-body-sm font-medium text-text'>
                  Level: {fitnessLevel}
                </span>
              </div>

              <p className='mt-3 font-body text-body-sm text-text sm:text-body'>
                {email}
              </p>

              <p className='mt-3 font-body text-body-sm font-semibold text-text sm:text-body'>
                Tujuan: {goal}
              </p>
            </div>

            {/* Tombol Edit */}
            {!isEditing && (
              <button
                type='button'
                onClick={() => {
                  setSuccessMessage('');
                  setError('');
                  setIsEditing(true);
                }}
                className='rounded-lg bg-accent px-5 py-2.5 font-body text-body-sm font-semibold text-white transition hover:brightness-95'
              >
                Edit Profil
              </button>
            )}
          </div>
        </Card>

        {/* Pesan sukses */}
        {successMessage && (
          <div className='mt-5 rounded-lg bg-green-50 px-4 py-3'>
            <p className='font-body text-body-sm text-green-700'>
              {successMessage}
            </p>
          </div>
        )}

        {/* Pesan error saat save */}
        {error && profile && (
          <div className='mt-5 rounded-lg bg-red-50 px-4 py-3'>
            <p className='font-body text-body-sm text-red-600'>{error}</p>
          </div>
        )}

        {/* =========================================
            INFORMASI PROFIL
            ========================================= */}

        {!isEditing ? (
          <Card className='mt-8 px-6 py-7 sm:px-8 sm:py-8'>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Informasi Pribadi
            </h2>

            <div className='mt-8 grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2'>
              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Nama Pengguna
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {username}
                </p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Email
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>{email}</p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Tujuan Kebugaran
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>{goal}</p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Tingkat Kesulitan
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {fitnessLevel}
                </p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Jenis Kelamin
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {gender}
                </p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Usia
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>{age}</p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Berat Saat Ini
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {weight}
                </p>
              </div>

              <div>
                <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                  Tinggi Saat Ini
                </p>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {height}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className='mt-8 px-6 py-7 sm:px-8 sm:py-8'>
            <h2 className='font-heading text-heading-lg font-bold text-text'>
              Edit Informasi Profil
            </h2>

            {/* Tujuan */}
            <div className='mt-8'>
              <p className='font-body text-body-sm font-semibold text-text'>
                Tujuan Kebugaran
              </p>

              <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-3'>
                {goalOptions.map((option) => {
                  const selected = formData.fitnessGoal === option.value;

                  return (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => handleGoalChange(option.value)}
                      disabled={saving}
                      className={`rounded-lg px-4 py-3 font-body text-body-sm font-semibold transition ${
                        selected
                          ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                          : 'bg-accent text-white hover:brightness-95'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fitness Level */}
            <div className='mt-8'>
              <p className='font-body text-body-sm font-semibold text-text'>
                Tingkat Kesulitan
              </p>

              <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-3'>
                {fitnessLevelOptions.map((option) => {
                  const selected = formData.fitnessLevel === option.value;

                  return (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => handleFitnessLevelChange(option.value)}
                      disabled={saving}
                      className={`rounded-lg px-4 py-3 font-body text-body-sm font-semibold transition ${
                        selected
                          ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                          : 'bg-accent text-white hover:brightness-95'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender */}
            <div className='mt-8'>
              <p className='font-body text-body-sm font-semibold text-text'>
                Jenis Kelamin
              </p>

              <div className='mt-3 grid grid-cols-1 gap-3 md:grid-cols-2'>
                {genderOptions.map((option) => {
                  const selected = formData.gender === option.value;

                  return (
                    <button
                      key={option.value}
                      type='button'
                      onClick={() => handleGenderChange(option.value)}
                      disabled={saving}
                      className={`rounded-lg px-4 py-3 font-body text-body-sm font-semibold transition ${
                        selected
                          ? 'bg-primary text-white shadow-md ring-2 ring-primary ring-offset-2'
                          : 'bg-accent text-white hover:brightness-95'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Usia */}
            <div className='mt-8'>
              <p className='font-body text-body-sm font-semibold text-text'>
                Usia
              </p>

              <div className='mt-3'>
                <Counter
                  value={formData.age}
                  unit='tahun'
                  min={1}
                  max={120}
                  onIncrease={() =>
                    setFormData((current) => ({
                      ...current,
                      age: Math.min(current.age + 1, 120),
                    }))
                  }
                  onDecrease={() =>
                    setFormData((current) => ({
                      ...current,
                      age: Math.max(current.age - 1, 1),
                    }))
                  }
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      age: Number(value),
                    }))
                  }
                  disabled={saving}
                />
              </div>
            </div>

            {/* Berat */}
            <div className='mt-8'>
              <p className='font-body text-body-sm font-semibold text-text'>
                Berat Saat Ini
              </p>

              <div className='mt-3'>
                <Counter
                  value={formData.weight}
                  unit='kg'
                  min={20}
                  max={300}
                  onIncrease={() =>
                    setFormData((current) => ({
                      ...current,
                      weight: Math.min(current.weight + 1, 300),
                    }))
                  }
                  onDecrease={() =>
                    setFormData((current) => ({
                      ...current,
                      weight: Math.max(current.weight - 1, 20),
                    }))
                  }
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      weight: Number(value),
                    }))
                  }
                  disabled={saving}
                />
              </div>
            </div>

            {/* Tinggi */}
            <div className='mt-8'>
              <p className='font-body text-body-sm font-semibold text-text'>
                Tinggi Saat Ini
              </p>

              <div className='mt-3'>
                <Counter
                  value={formData.height}
                  unit='cm'
                  min={100}
                  max={250}
                  direction='vertical'
                  onIncrease={() =>
                    setFormData((current) => ({
                      ...current,
                      height: Math.min(current.height + 1, 250),
                    }))
                  }
                  onDecrease={() =>
                    setFormData((current) => ({
                      ...current,
                      height: Math.max(current.height - 1, 100),
                    }))
                  }
                  onChange={(value) =>
                    setFormData((current) => ({
                      ...current,
                      height: Number(value),
                    }))
                  }
                  disabled={saving}
                />
              </div>
            </div>

            {/* Tombol */}
            <div className='mt-10 flex flex-col gap-3 sm:flex-row sm:justify-end'>
              <button
                type='button'
                onClick={handleCancel}
                disabled={saving}
                className='rounded-lg bg-surface px-5 py-2.5 font-body text-body-sm font-semibold text-text shadow-sm transition hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60'
              >
                Batal
              </button>

              <button
                type='button'
                onClick={handleSave}
                disabled={saving}
                className='rounded-lg bg-accent px-5 py-2.5 font-body text-body-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60'
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
