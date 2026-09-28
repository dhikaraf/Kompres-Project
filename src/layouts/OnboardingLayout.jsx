import { Link } from 'react-router-dom';

import Button from '../components/common/Button';

export default function OnboardingLayout({
  children,
  onBack,
  onNext,
  nextDisabled = false,
}) {
  return (
    <main className='min-h-screen bg-background'>
      <div className='mx-auto max-w-4xl px-6 py-8 sm:px-8 lg:px-10'>
        {/* Tombol navigasi */}
        <div className='flex items-center justify-between'>
          <Button
            variant='secondary'
            onClick={onBack}
            className='inline-flex items-center gap-3 px-4 py-3'
          >
            <span className='text-lg leading-none'>←</span>
            <span>Kembali</span>
          </Button>

          <Button
            variant='secondary'
            onClick={onNext}
            disabled={nextDisabled}
            className='inline-flex items-center gap-3 px-4 py-3'
          >
            <span>Lanjut</span>
            <span className='text-lg leading-none'>→</span>
          </Button>
        </div>

        {/* Isi halaman */}
        <section className='mt-8'>{children}</section>
      </div>
    </main>
  );
}
