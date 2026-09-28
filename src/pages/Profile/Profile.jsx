import { useUser } from '../../context/UserContext';

import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';

const goalLabels = {
  'lose-weight': 'Menurunkan Berat Badan',
  'gain-weight': 'Menambah Berat Badan',
  'stay-healthy': 'Menjaga Kesehatan',
};

const genderLabels = {
  male: 'Laki-laki',
  female: 'Perempuan',
};

export default function Profile() {
  const { user } = useUser();

  const username = user?.username || 'Pengguna';
  const email = user?.email || '-';

  const goal = goalLabels[user?.goal] || 'Belum ditentukan';

  const gender = genderLabels[user?.gender] || 'Belum ditentukan';

  const age =
    user?.age !== null && user?.age !== undefined
      ? `${user.age} tahun`
      : 'Belum diisi';

  const weight =
    user?.weight !== null && user?.weight !== undefined
      ? `${user.weight} kg`
      : 'Belum diisi';

  const height =
    user?.height !== null && user?.height !== undefined
      ? `${user.height} cm`
      : 'Belum diisi';

  /*
   * Untuk sementara foto menggunakan inisial.
   * Nanti bisa diganti dengan user.profileImage
   * ketika fitur foto profil sudah tersedia.
   */
  const initial = username.charAt(0).toUpperCase();

  return (
    <DashboardLayout>
      <div className='mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-7'>
        {/* =========================================
            PROFILE SUMMARY
            ========================================= */}
        <Card className='px-6 py-7 sm:px-8 sm:py-8'>
          <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-center'>
            {/* Foto / Avatar */}
            <div className='flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary sm:h-36 sm:w-36'>
              <span className='font-heading text-5xl font-bold text-white'>
                {initial}
              </span>
            </div>

            {/* Informasi utama */}
            <div className='flex flex-col items-center text-center sm:items-start sm:text-left'>
              <div className='flex flex-col items-center gap-3 sm:flex-row'>
                <h1 className='font-heading text-heading-xl font-bold text-text'>
                  {username}
                </h1>

                <span className='rounded-full bg-gray-100 px-3 py-1 font-body text-body-sm font-medium text-text'>
                  Level: Mudah
                </span>
              </div>

              <p className='mt-3 font-body text-body-sm text-text sm:text-body'>
                {email}
              </p>

              <p className='mt-3 font-body text-body-sm font-semibold text-text sm:text-body'>
                Tujuan: {goal}
              </p>
            </div>
          </div>
        </Card>

        {/* =========================================
            INFORMASI PRIBADI
            ========================================= */}
        <Card className='mt-8 px-6 py-7 sm:px-8 sm:py-8'>
          <h2 className='font-heading text-heading-lg font-bold text-text'>
            Informasi Pribadi
          </h2>

          <div className='mt-8 grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2'>
            {/* Nama Pengguna */}
            <div>
              <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                Nama Pengguna
              </p>

              <p className='mt-1 font-body text-body-sm text-text'>
                {username}
              </p>
            </div>

            {/* Email */}
            <div>
              <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                Email
              </p>

              <p className='mt-1 font-body text-body-sm text-text'>{email}</p>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                Jenis Kelamin
              </p>

              <p className='mt-1 font-body text-body-sm text-text'>{gender}</p>
            </div>

            {/* Usia */}
            <div>
              <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                Usia
              </p>

              <p className='mt-1 font-body text-body-sm text-text'>{age}</p>
            </div>

            {/* Berat */}
            <div>
              <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                Berat Saat Ini
              </p>

              <p className='mt-1 font-body text-body-sm text-text'>{weight}</p>
            </div>

            {/* Tinggi */}
            <div>
              <p className='font-body text-body-sm font-semibold text-text sm:text-body'>
                Tinggi Saat Ini
              </p>

              <p className='mt-1 font-body text-body-sm text-text'>{height}</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
