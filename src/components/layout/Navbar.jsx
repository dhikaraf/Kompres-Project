import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

function scrollToSection(id, closeMenu) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  if (closeMenu) {
    closeMenu();
  }
}

export default function Navbar({ variant = 'landing' }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  /*
   * ============================
   * NAVBAR DASHBOARD
   * ============================
   */
  if (variant === 'dashboard') {
    return (
      <header className='px-4 pt-4 sm:px-6 lg:px-7'>
        <nav className='mx-auto max-w-7xl rounded-xl bg-surface px-5 py-3 shadow-md sm:px-6'>
          <div className='flex items-center justify-between'>
            {/* Tombol hamburger mobile */}
            <button
              type='button'
              onClick={() => setMenuOpen(!menuOpen)}
              className='flex h-10 w-10 items-center justify-center rounded-lg text-primary transition hover:bg-background md:hidden'
              aria-label='Buka menu navigasi'
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18 18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>

            {/* Navigasi desktop */}
            <div className='hidden items-center gap-3 md:flex lg:gap-5'>
              <Link
                to='/dashboard'
                className={`rounded-lg px-3 py-2 font-body text-sm font-semibold transition ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-background'
                }`}
              >
                Beranda
              </Link>

              <Link
                to='/history'
                className={`rounded-lg px-3 py-2 font-body text-sm font-medium transition ${
                  location.pathname === '/history'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-background'
                }`}
              >
                Riwayat
              </Link>

              <Link
                to='/profile'
                className={`rounded-lg px-3 py-2 font-body text-sm font-medium transition ${
                  location.pathname === '/profile'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-background'
                }`}
              >
                Profil
              </Link>
            </div>

            {/* Mobile menu button area */}
            <div className='hidden md:block' />
          </div>

          {/* Mobile menu */}
          <div
            className={`overflow-hidden transition-all duration-300 md:hidden ${
              menuOpen
                ? 'max-h-60 border-t border-gray-100 pt-3 opacity-100'
                : 'max-h-0 opacity-0'
            }`}
          >
            <div className='flex flex-col gap-2'>
              <Link
                to='/dashboard'
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 font-body text-sm font-semibold ${
                  location.pathname === '/dashboard'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-background'
                }`}
              >
                Beranda
              </Link>

              <Link
                to='/history'
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 font-body text-sm font-medium ${
                  location.pathname === '/history'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-background'
                }`}
              >
                Riwayat
              </Link>

              <Link
                to='/profile'
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 font-body text-sm font-medium ${
                  location.pathname === '/profile'
                    ? 'bg-primary text-white'
                    : 'text-primary hover:bg-background'
                }`}
              >
                Profil
              </Link>
            </div>
          </div>
        </nav>
      </header>
    );
  }

  /*
   * ============================
   * NAVBAR LANDING PAGE
   * ============================
   */
  return (
    <header className='px-4 pt-4 sm:px-6 lg:px-8'>
      <nav className='mx-auto max-w-7xl rounded-xl bg-surface shadow-md'>
        <div className='flex items-center justify-between px-5 py-3 sm:px-6'>
          {/* Navigasi kiri */}
          <div className='flex items-center gap-3'>
            {/* Hamburger */}
            <button
              type='button'
              onClick={() => setMenuOpen(!menuOpen)}
              className='flex h-10 w-10 items-center justify-center rounded-lg text-primary transition hover:bg-background md:hidden'
              aria-label='Buka menu navigasi'
              aria-expanded={menuOpen}
            >
              {menuOpen ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M6 18 18 6M6 6l12 12'
                  />
                </svg>
              ) : (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='2'
                  stroke='currentColor'
                  className='h-6 w-6'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M4 6h16M4 12h16M4 18h16'
                  />
                </svg>
              )}
            </button>

            {/* Desktop */}
            <div className='hidden items-center gap-3 md:flex lg:gap-5'>
              <button
                type='button'
                onClick={() => scrollToSection('home')}
                className='rounded-lg bg-primary px-3 py-2 font-body text-sm font-semibold text-white'
              >
                Beranda
              </button>

              <button
                type='button'
                onClick={() => scrollToSection('features')}
                className='font-body text-sm font-medium text-primary hover:text-text'
              >
                Fitur
              </button>

              <button
                type='button'
                onClick={() => scrollToSection('how-it-works')}
                className='font-body text-sm font-medium text-primary hover:text-text'
              >
                Cara Kerja
              </button>

              <button
                type='button'
                onClick={() => scrollToSection('teams')}
                className='font-body text-sm font-medium text-primary hover:text-text'
              >
                Tim Kami
              </button>
            </div>
          </div>

          {/* Navigasi kanan */}
          <div className='flex items-center gap-3 sm:gap-5'>
            <Link
              to='/login'
              className='font-body text-sm font-medium text-primary hover:text-text'
            >
              Masuk
            </Link>

            <Link
              to='/register'
              className='rounded-lg bg-accent px-4 py-2 font-body text-sm font-semibold text-white hover:brightness-95'
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen
              ? 'max-h-96 border-t border-gray-100 opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className='flex flex-col gap-2 px-5 py-4'>
            <button
              type='button'
              onClick={() => scrollToSection('home', closeMenu)}
              className='rounded-lg bg-primary px-4 py-3 text-left font-body text-sm font-semibold text-white'
            >
              Beranda
            </button>

            <button
              type='button'
              onClick={() => scrollToSection('features', closeMenu)}
              className='rounded-lg px-4 py-3 text-left font-body text-sm font-medium text-primary hover:bg-background'
            >
              Fitur
            </button>

            <button
              type='button'
              onClick={() => scrollToSection('how-it-works', closeMenu)}
              className='rounded-lg px-4 py-3 text-left font-body text-sm font-medium text-primary hover:bg-background'
            >
              Cara Kerja
            </button>

            <button
              type='button'
              onClick={() => scrollToSection('teams', closeMenu)}
              className='rounded-lg px-4 py-3 text-left font-body text-sm font-medium text-primary hover:bg-background'
            >
              Tim Kami
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
