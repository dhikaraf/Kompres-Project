import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import { updateProfile } from '../../services/api';

import OnboardingLayout from '../../layouts/OnboardingLayout';

import Goal from './Goal';
import FitnessLevel from './FitnessLevel';
import AgeGender from './AgeGender';
import WeightHeight from './WeightHeight';

export default function Wizard() {
  const navigate = useNavigate();

  const { user, updateUser } = useUser();

  const [currentStep, setCurrentStep] = useState(0);

  const [selectedGoal, setSelectedGoal] = useState(user?.goal || '');

  const [fitnessLevel, setFitnessLevel] = useState(user?.fitness_level || '');

  const [gender, setGender] = useState(user?.gender || '');

  const [age, setAge] = useState(user?.age || 23);

  const [height, setHeight] = useState(user?.height || 150);

  const [weight, setWeight] = useState(user?.weight || 23);

  const steps = [
    {
      id: 'goal',
      title: 'Tujuan',
    },
    {
      id: 'fitness-level',
      title: 'Tingkat Kesulitan',
    },
    {
      id: 'age-gender',
      title: 'Usia & Jenis Kelamin',
    },
    {
      id: 'weight-height',
      title: 'Berat & Tinggi',
    },
  ];

  /* =========================
     GOAL
     ========================= */

  const handleSelectGoal = (goalId) => {
    setSelectedGoal(goalId);
  };

  /* =========================
     FITNESS LEVEL
     ========================= */

  const handleSelectFitnessLevel = (level) => {
    setFitnessLevel(level);
  };

  /* =========================
     NAVIGATION
     ========================= */

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/register');
      return;
    }

    setCurrentStep((current) => current - 1);
  };

  const handleNext = async () => {
    /* =========================
     STEP 1 - GOAL
     ========================= */

    if (currentStep === 0) {
      if (!selectedGoal) {
        return;
      }

      setCurrentStep((current) => current + 1);

      return;
    }

    /* =========================
     STEP 2 - FITNESS LEVEL
     ========================= */

    if (currentStep === 1) {
      if (!fitnessLevel) {
        return;
      }

      setCurrentStep((current) => current + 1);

      return;
    }

    /* =========================
     STEP 3 - AGE & GENDER
     ========================= */

    if (currentStep === 2) {
      if (!gender || !age) {
        return;
      }

      setCurrentStep((current) => current + 1);

      return;
    }

    /* =========================
     STEP 4 - WEIGHT & HEIGHT
     ========================= */

    if (currentStep === 3) {
      if (!height || !weight) {
        return;
      }

      /*
       * Mapping nilai goal frontend
       * ke nilai yang digunakan backend.
       */
      const goalMapping = {
        'lose-weight': 'lose',
        'gain-weight': 'gain',
        'stay-healthy': 'healthy',
      };

      const profileData = {
        gender,
        age,
        weight,
        height,
        fitness_level: fitnessLevel,
        fitness_goal: goalMapping[selectedGoal],
      };

      try {
        /*
         * Kirim seluruh data onboarding
         * ke backend.
         */
        await updateProfile(profileData);

        /*
         * Tetap simpan data di state frontend
         * agar halaman yang sedang aktif
         * langsung mengenali data terbaru.
         */
        updateUser({
          goal: selectedGoal,
          fitness_level: fitnessLevel,
          gender,
          age,
          weight,
          height,
        });

        navigate('/dashboard');
      } catch (error) {
        console.error('Gagal menyimpan profile:', error);

        alert(
          error.response?.data?.message ||
            'Profil gagal disimpan. Silakan coba lagi.',
        );
      }
    }
  };

  /* =========================
     RENDER STEP
     ========================= */

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Goal selectedGoal={selectedGoal} onSelectGoal={handleSelectGoal} />
        );

      case 1:
        return (
          <FitnessLevel
            selectedLevel={fitnessLevel}
            onSelectLevel={handleSelectFitnessLevel}
          />
        );

      case 2:
        return (
          <AgeGender
            gender={gender}
            age={age}
            onGenderChange={setGender}
            onAgeChange={setAge}
          />
        );

      case 3:
        return (
          <WeightHeight
            height={height}
            weight={weight}
            onHeightChange={setHeight}
            onWeightChange={setWeight}
          />
        );

      default:
        return null;
    }
  };

  /* =========================
     NEXT BUTTON STATE
     ========================= */

  const isNextDisabled =
    (currentStep === 0 && !selectedGoal) ||
    (currentStep === 1 && !fitnessLevel) ||
    (currentStep === 2 && (!gender || !age)) ||
    (currentStep === 3 && (!height || !weight));

  return (
    <OnboardingLayout
      onBack={handleBack}
      onNext={handleNext}
      nextDisabled={isNextDisabled}
    >
      {/* Indikator langkah */}
      <div className='mb-6'>
        <div className='flex items-center justify-center gap-2'>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div key={step.id} className='flex items-center gap-2'>
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full font-body text-body-sm font-semibold ${
                    isActive || isCompleted
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-8 rounded-full ${
                      isCompleted ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>

        <p className='mt-3 text-center font-body text-body-sm text-text'>
          Langkah {currentStep + 1} dari {steps.length}:{' '}
          {steps[currentStep].title}
        </p>
      </div>

      {/* Isi step */}
      <div className='mx-auto w-full max-w-[800px] rounded-lg bg-surface px-6 py-10 shadow-md sm:px-10 lg:px-12'>
        {renderCurrentStep()}
      </div>
    </OnboardingLayout>
  );
}
