import { Link } from 'react-router-dom';

export default function AuthLayout({ children }) {
  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-7xl px-6 pt-8 sm:px-8 lg:px-12'>
        <Link
          to='/'
          className='inline-flex items-center gap-3 rounded-lg bg-surface px-4 py-2 font-body text-body-sm text-text shadow-sm transition hover:shadow-md'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='1.8'
            stroke='currentColor'
            className='h-5 w-5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15.75 19.5 8.25 12l7.5-7.5'
            />
          </svg>

          <span>Kembali</span>
        </Link>
      </div>

      <section className='flex min-h-[calc(100vh-100px)] items-center justify-center px-6 py-10'>
        {children}
      </section>
    </main>
  );
}
