import { Link } from 'react-router-dom';

import Navbar from '../../components/layout/Navbar';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const features = [
  {
    title: 'Latihan yang Adaptif',
    description:
      'Rekomendasi latihan harian berbasis AI yang disesuaikan dengan kondisi tubuh dan tingkat kebugaran Anda.',
    image:
      'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Tujuan yang Dipersonalisasi',
    description:
      'Sesuaikan profil tubuh dan tujuan kebugaran Anda untuk mendapatkan rekomendasi latihan dan nutrisi yang lebih tepat.',
    image:
      'https://images.unsplash.com/photo-1517840901100-8179e982acb7?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Makanan Bernutrisi Tinggi',
    description:
      'Dapatkan rekomendasi makanan bernutrisi yang dirancang untuk membantu menjaga energi dan mendukung pemulihan tubuh.',
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  },
];

const steps = [
  {
    number: '01',
    title: 'Personalisasikan Profil Anda',
    description:
      'Masukkan data tubuh dan tujuan kebugaran Anda hanya dalam beberapa langkah.',
  },
  {
    number: '02',
    title: 'Dapatkan Panduan Cerdas',
    description:
      'Terima rekomendasi nutrisi dan latihan harian yang disesuaikan dengan kondisi dan tujuan Anda.',
    highlighted: true,
  },
  {
    number: '03',
    title: 'Berkembang Secara Konsisten',
    description:
      'Pantau perkembangan Anda dan capai target kebugaran secara lebih terarah dan konsisten.',
  },
];

const teamMembers = [
  {
    name: 'Adam Kevin',
    role: 'Peran Brok',
  },
  {
    name: 'Daffa Azra',
    role: 'Peran Brok',
  },
  {
    name: 'Danendra',
    role: 'Peran Brok',
  },
  {
    name: 'Rafly Andhika',
    role: 'Peran Brok',
  },
];

function scrollToSection(id) {
  const element = document.getElementById(id);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

function SectionHeading({ title, description }) {
  return (
    <div className='mx-auto max-w-3xl text-center'>
      <h2 className='font-heading text-heading-lg font-bold text-text'>
        {title}
      </h2>

      <p className='mt-3 font-body text-body-sm leading-relaxed text-text sm:text-body'>
        {description}
      </p>
    </div>
  );
}

function FeatureIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      className='h-5 w-5'
    >
      <path d='M6 6v12' />
      <path d='M18 6v12' />
      <path d='M3 9v6' />
      <path d='M21 9v6' />
      <path d='M6 12h12' />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <main className='min-h-screen bg-background text-text'>
      <Navbar />

      {/* Hero */}
      <section
        id='home'
        className='mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14 lg:px-12 lg:py-24'
      >
        <div>
          <span className='inline-flex rounded-full bg-primary px-4 py-2 font-body text-sm font-semibold text-white'>
            Rekomendasi Makanan dan Latihan Berbasis AI
          </span>

          <h1 className='mt-5 max-w-3xl font-heading text-heading-xl font-bold leading-tight text-text'>
            Kebugaran Cerdas dan Nutrisi AI yang Disesuaikan dengan Tubuh Anda
          </h1>

          <p className='mt-4 max-w-2xl font-body text-body leading-relaxed text-text'>
            Tingkatkan performa harian Anda dengan rekomendasi makanan dan
            latihan berbasis AI yang dirancang sesuai kondisi tubuh dan tujuan
            kebugaran Anda.
          </p>

          <Button
            variant='accent'
            className='mt-6'
            onClick={() => scrollToSection('features')}
          >
            Mulai Sekarang
          </Button>
        </div>

        <div className='flex justify-center lg:justify-end'>
          <img
            src='https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=80'
            alt='Latihan di gym'
            className='h-[320px] w-full max-w-[400px] rounded-lg object-cover sm:h-[380px] lg:h-[330px] lg:max-w-[340px]'
          />
        </div>
      </section>

      {/* Fitur */}
      <section
        id='features'
        className='scroll-mt-8 mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12'
      >
        <SectionHeading
          title='Dibangun untuk Kebugaran yang Lebih Cerdas'
          description='Dapatkan rekomendasi latihan dan nutrisi yang dirancang secara khusus untuk membantu mencapai tujuan kebugaran Anda.'
        />

        <div className='mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature) => (
            <Card key={feature.title} className='overflow-hidden'>
              <div className='p-5'>
                <div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary text-white'>
                  <FeatureIcon />
                </div>

                <h3 className='mt-4 font-heading text-heading-lg font-semibold text-text'>
                  {feature.title}
                </h3>

                <p className='mt-3 min-h-[72px] font-body text-body-sm leading-relaxed text-text'>
                  {feature.description}
                </p>
              </div>

              <img
                src={feature.image}
                alt={feature.title}
                className='h-48 w-full object-cover'
              />
            </Card>
          ))}
        </div>
      </section>

      {/* Cara Kerja */}
      <section
        id='how-it-works'
        className='scroll-mt-8 mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20 lg:px-12'
      >
        <SectionHeading
          title='Bagaimana Smart Gym Mengoptimalkan Performa Harian Anda'
          description='Mulai dari pengaturan profil hingga mendapatkan rekomendasi melalui tiga langkah sederhana yang didukung AI.'
        />

        <div className='mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3'>
          {steps.map((step) => (
            <Card key={step.number} className='p-5'>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-md font-body text-sm font-semibold text-white ${
                  step.highlighted ? 'bg-accent' : 'bg-primary'
                }`}
              >
                {step.number}
              </div>

              <h3 className='mt-4 font-heading text-heading-lg font-semibold text-text'>
                {step.title}
              </h3>

              <p className='mt-3 font-body text-body-sm leading-relaxed text-text'>
                {step.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Tim */}
      <section
        id='teams'
        className='scroll-mt-8 mx-auto max-w-7xl px-6 py-14 pb-20 sm:px-8 sm:py-20 lg:px-12'
      >
        <SectionHeading
          title='Orang-Orang di Balik Smart Gym'
          description='Dibangun oleh tim yang menggabungkan AI, nutrisi, dan kebugaran untuk menciptakan pengalaman yang lebih personal.'
        />

        <div className='mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4'>
          {teamMembers.map((member, index) => (
            <Card key={index} className='overflow-hidden'>
              <div className='h-52 bg-gray-300 sm:h-56 lg:h-44' />

              <div className='p-4'>
                <h3 className='font-heading text-heading-lg font-semibold text-text'>
                  {member.name}
                </h3>

                <p className='mt-1 font-body text-body-sm text-text'>
                  {member.role}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
