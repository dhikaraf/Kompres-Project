import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

import Card from '../../components/common/Card';

import InputField from '../../components/common/InputField';

import Button from '../../components/common/Button';

import { useUser } from '../../context/UserContext';

export default function Login() {
  const navigate = useNavigate();

  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: '',
  });

  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: '',
      general: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: '',
    };

    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi.';
    }

    setErrors(newErrors);

    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    const result = await login({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (!result.success) {
      setErrors((current) => ({
        ...current,
        general: result.message,
      }));

      setLoading(false);
      return;
    }

    setLoading(false);

    navigate('/dashboard');
  };

  return (
    <AuthLayout>
      <Card className='w-full max-w-[400px] px-8 py-10 sm:px-10'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='font-heading text-heading-lg font-bold text-text'>
            Selamat Datang Kembali
          </h1>

          <p className='mx-auto mt-4 max-w-[300px] font-body text-body leading-snug text-text'>
            Masukkan kredensial Anda untuk melanjutkan perjalanan kebugaran Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='mt-9'>
          {/* Email */}
          <InputField
            id='email'
            label='Email'
            type='email'
            value={formData.email}
            onChange={handleChange}
            autoComplete='email'
            placeholder='Masukkan email'
            required
            error={errors.email}
            disabled={loading}
          />

          {/* Kata Sandi */}
          <div className='mt-8'>
            <InputField
              id='password'
              label='Kata Sandi'
              type='password'
              value={formData.password}
              onChange={handleChange}
              autoComplete='current-password'
              placeholder='Masukkan kata sandi'
              required
              error={errors.password}
              disabled={loading}
            />
          </div>

          {/* Ingat Saya + Lupa Kata Sandi */}
          <div className='mt-8 flex items-center justify-between gap-4'>
            <label
              className={`flex items-center gap-2 ${
                loading ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
              }`}
            >
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
                disabled={loading}
                className='h-4 w-4 cursor-pointer accent-primary'
              />

              <span className='font-body text-body-sm text-text'>
                Ingat Saya
              </span>
            </label>

            <button
              type='button'
              disabled={loading}
              className='font-body text-body-sm font-semibold text-text transition hover:text-primary disabled:cursor-not-allowed disabled:opacity-60'
            >
              Lupa Kata Sandi?
            </button>
          </div>

          {/* Error Login */}
          {errors.general && (
            <div role='alert' className='mt-4 rounded-lg bg-red-50 px-3 py-2'>
              <p className='font-body text-body-sm text-red-600'>
                {errors.general}
              </p>
            </div>
          )}

          {/* Tombol Masuk */}
          <Button
            type='submit'
            variant='accent'
            className='mt-8 h-11 w-full'
            disabled={loading}
          >
            {loading ? 'Memeriksa...' : 'Masuk'}
          </Button>
        </form>

        {/* Daftar */}
        <p className='mt-7 text-center font-body text-body-sm text-text'>
          Belum memiliki akun?{' '}
          <Link
            to='/register'
            className='font-semibold text-text transition hover:text-primary'
          >
            Daftar di sini
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
