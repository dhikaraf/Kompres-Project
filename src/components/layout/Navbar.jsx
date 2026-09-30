import { useState } from 'react';
import { Link } from 'react-router-dom';

import { useUser } from '../../context/UserContext';

export default function Navbar({ variant = 'landing' }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { logout } = useUser();

  const isDashboard = variant === 'dashboard';

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    window.location.replace('/');
  };

  const handleMenuClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className='bg-surface shadow-sm'>
      <div className='mx-auto max-w-7xl px-5 sm:px-8 lg:px-12'>
        <div className='flex h-20 items-center justify-between'>
          {/* Logo */}
          <Link
            to={isDashboard ? '/dashboard' : '/'}
            onClick={handleMenuClick}
            className='font-heading text-heading-lg font-bold text-primary'
          >
            Smart Gym
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden items-center gap-6 md:flex'>
            {isDashboard ? (
              <>
                <Link
                  to='/dashboard'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Beranda
                </Link>

                <Link
                  to='/schedule'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Jadwal
                </Link>

                <Link
                  to='/nutrition'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Nutrisi
                </Link>

                <Link
                  to='/workout-plan'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Workout Plan
                </Link>

                <Link
                  to='/history'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Riwayat
                </Link>

                <Link
                  to='/profile'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Profil
                </Link>

                <button
                  type='button'
                  onClick={handleLogout}
                  className='font-body text-body-sm font-semibold text-text transition hover:text-primary'
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <a
                  href='#home'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Beranda
                </a>

                <a
                  href='#features'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Fitur
                </a>

                <a
                  href='#how-it-works'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Cara Kerja
                </a>

                <a
                  href='#teams'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-medium text-text transition hover:text-primary'
                >
                  Tim Kami
                </a>

                <Link
                  to='/login'
                  onClick={handleMenuClick}
                  className='font-body text-body-sm font-semibold text-text transition hover:text-primary'
                >
                  Masuk
                </Link>

                <Link
                  to='/register'
                  onClick={handleMenuClick}
                  className='rounded-lg bg-accent px-4 py-2 font-body text-body-sm font-semibold text-white transition hover:brightness-95'
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type='button'
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            onClick={() => setIsMenuOpen((current) => !current)}
            className='flex h-10 w-10 items-center justify-center rounded-lg text-text transition hover:bg-background md:hidden'
          >
            <span className='text-2xl leading-none'>
              {isMenuOpen ? '×' : '☰'}
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMenuOpen ? 'max-h-[600px] pb-5 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='flex flex-col gap-3 border-t border-gray-100 pt-4'>
            {isDashboard ? (
              <>
                <Link
                  to='/dashboard'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Beranda
                </Link>

                <Link
                  to='/schedule'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Jadwal
                </Link>

                <Link
                  to='/nutrition'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Nutrisi
                </Link>

                <Link
                  to='/workout-plan'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Workout Plan
                </Link>

                <Link
                  to='/history'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Riwayat
                </Link>

                <Link
                  to='/profile'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Profil
                </Link>

                <button
                  type='button'
                  onClick={handleLogout}
                  className='w-full rounded-lg px-3 py-2 text-left font-body text-body-sm font-semibold text-text transition hover:bg-background hover:text-primary'
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <a
                  href='#home'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Beranda
                </a>

                <a
                  href='#features'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Fitur
                </a>

                <a
                  href='#how-it-works'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Cara Kerja
                </a>

                <a
                  href='#teams'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-medium text-text transition hover:bg-background hover:text-primary'
                >
                  Tim Kami
                </a>

                <Link
                  to='/login'
                  onClick={handleMenuClick}
                  className='rounded-lg px-3 py-2 font-body text-body-sm font-semibold text-text transition hover:bg-background hover:text-primary'
                >
                  Masuk
                </Link>

                <Link
                  to='/register'
                  onClick={handleMenuClick}
                  className='rounded-lg bg-accent px-3 py-2 font-body text-body-sm font-semibold text-white transition hover:brightness-95'
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
