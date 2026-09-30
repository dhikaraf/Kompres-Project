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

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const result = await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (!result?.success) {
        setErrors((current) => ({
          ...current,
          general:
            result?.message ||
            'Email atau kata sandi yang Anda masukkan salah.',
        }));

        return;
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Gagal login:', error);

      setErrors((current) => ({
        ...current,
        general:
          error.response?.data?.message || 'Login gagal. Silakan coba lagi.',
      }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card className='w-full max-w-[400px] px-8 py-10 sm:px-10'>
        <div className='text-center'>
          <h1 className='font-heading text-heading-lg font-bold text-text'>
            Selamat Datang Kembali
          </h1>

          <p className='mx-auto mt-4 max-w-[300px] font-body text-body leading-snug text-text'>
            Masukkan kredensial Anda untuk melanjutkan perjalanan kebugaran
            Anda.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='mt-9'>
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

          {errors.general && (
            <div
              role='alert'
              className='mt-5 rounded-lg bg-accent/10 px-4 py-3'
            >
              <p className='font-body text-body-sm text-accent'>
                {errors.general}
              </p>
            </div>
          )}

          <Button
            type='submit'
            variant='accent'
            className='mt-8 h-11 w-full'
            disabled={loading}
          >
            {loading ? 'Memeriksa...' : 'Masuk'}
          </Button>
        </form>

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
