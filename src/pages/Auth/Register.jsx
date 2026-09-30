import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import AuthLayout from '../../layouts/AuthLayout';

import Card from '../../components/common/Card';

import InputField from '../../components/common/InputField';

import Button from '../../components/common/Button';

import { useUser } from '../../context/UserContext';

export default function Register() {
  const navigate = useNavigate();

  const { register, login } = useUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      general: '',
    };

    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name) {
      newErrors.name = 'Nama pengguna wajib diisi.';
    } else if (name.length < 3) {
      newErrors.name = 'Nama pengguna minimal terdiri dari 3 karakter.';
    }

    if (!email) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Format email tidak valid.';
    }

    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi.';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Kata sandi minimal terdiri dari 8 karakter.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi wajib diisi.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak sesuai.';
    }

    setErrors(newErrors);

    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setLoading(true);

    /*
     * 1. Register ke backend
     */
    const registerResult = await register({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (!registerResult.success) {
      setErrors((current) => ({
        ...current,
        general: registerResult.message,
      }));

      setLoading(false);
      return;
    }

    /*
     * 2. Login otomatis setelah register berhasil.
     *
     * Tujuannya agar JWT sudah tersedia
     * sebelum user masuk ke onboarding.
     */
    const loginResult = await login({
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    });

    if (!loginResult.success) {
      setErrors((current) => ({
        ...current,
        general:
          'Registrasi berhasil, tetapi login otomatis gagal. Silakan masuk melalui halaman login.',
      }));

      setLoading(false);
      return;
    }

    setLoading(false);

    /*
     * 3. Masuk ke onboarding
     */
    navigate('/onboarding');
  };

  return (
    <AuthLayout>
      <Card className='w-full max-w-[520px] px-8 py-10 sm:px-10'>
        {/* Header */}
        <div className='text-center'>
          <h1 className='font-heading text-heading-lg font-bold text-text'>
            Buat Akun
          </h1>

          <p className='mx-auto mt-4 max-w-[330px] font-body text-body leading-snug text-text'>
            Mulai capai tujuan kebugaran dan nutrisi Anda hari ini
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className='mt-9'>
          {/* Nama Pengguna */}
          <InputField
            id='name'
            label='Nama Pengguna'
            value={formData.name}
            onChange={handleChange}
            autoComplete='name'
            placeholder='Masukkan nama pengguna'
            required
            error={errors.name}
            disabled={loading}
          />

          {/* Email */}
          <div className='mt-8'>
            <InputField
              id='email'
              label='Email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              autoComplete='email'
              placeholder='Masukkan alamat email'
              required
              error={errors.email}
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div className='mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <InputField
              id='password'
              label='Kata Sandi'
              type='password'
              value={formData.password}
              onChange={handleChange}
              autoComplete='new-password'
              placeholder='Minimal 8 karakter'
              required
              error={errors.password}
              disabled={loading}
            />

            {/* Konfirmasi Password */}
            <InputField
              id='confirmPassword'
              label='Konfirmasi Kata Sandi'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete='new-password'
              placeholder='Ulangi kata sandi'
              required
              error={errors.confirmPassword}
              disabled={loading}
            />
          </div>

          {/* Error umum */}
          {errors.general && (
            <div role='alert' className='mt-4 rounded-lg bg-red-50 px-3 py-2'>
              <p className='font-body text-body-sm text-red-600'>
                {errors.general}
              </p>
            </div>
          )}

          {/* Tombol Daftar */}
          <Button
            type='submit'
            variant='accent'
            className='mt-8 h-11 w-full'
            disabled={loading}
          >
            {loading ? 'Mendaftarkan...' : 'Daftar'}
          </Button>
        </form>

        {/* Login */}
        <p className='mt-7 text-center font-body text-body-sm text-text'>
          Sudah memiliki akun?{' '}
          <Link
            to='/login'
            className='font-semibold text-text transition hover:text-primary'
          >
            Masuk di sini
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
}
