import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../../context/UserContext';
import OnboardingLayout from '../../layouts/OnboardingLayout';

import Goal from './Goal';
import AgeGender from './AgeGender';
import WeightHeight from './WeightHeight';

export default function Wizard() {
  const navigate = useNavigate();
  const { user, updateUser } = useUser();

  const [currentStep, setCurrentStep] = useState(0);

  /* =========================
     STEP 1 - GOAL
     ========================= */

  const [selectedGoal, setSelectedGoal] = useState(user?.goal || '');

  /* =========================
     STEP 2 - AGE & GENDER
     ========================= */

  const [gender, setGender] = useState(user?.gender || '');

  const [age, setAge] = useState(user?.age || 23);

  /* =========================
     STEP 3 - HEIGHT & WEIGHT
     ========================= */

  const [height, setHeight] = useState(user?.height || 150);

  const [weight, setWeight] = useState(user?.weight || 23);

  const steps = [
    {
      id: 'goal',
      title: 'Tujuan',
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
     NAVIGATION
     ========================= */

  const handleBack = () => {
    if (currentStep === 0) {
      navigate('/register');
      return;
    }

    setCurrentStep((current) => current - 1);
  };

  const handleNext = () => {
    /* =========================
       STEP 1
       ========================= */

    if (currentStep === 0) {
      if (!selectedGoal) {
        return;
      }

      updateUser({
        goal: selectedGoal,
      });

      setCurrentStep((current) => current + 1);

      return;
    }

    /* =========================
       STEP 2
       ========================= */

    if (currentStep === 1) {
      if (!gender || !age) {
        return;
      }

      updateUser({
        gender,
        age,
      });

      setCurrentStep((current) => current + 1);

      return;
    }

    /* =========================
       STEP 3
       ========================= */

    if (currentStep === 2) {
      if (!height || !weight) {
        return;
      }

      updateUser({
        height,
        weight,
      });

      navigate('/dashboard');
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
          <AgeGender
            gender={gender}
            age={age}
            onGenderChange={setGender}
            onAgeChange={setAge}
          />
        );

      case 2:
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
    (currentStep === 1 && !gender) ||
    (currentStep === 2 && (!height || !weight));

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
