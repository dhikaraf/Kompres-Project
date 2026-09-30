import { Navigate, Outlet } from 'react-router-dom';

import { useUser } from '../context/UserContext';

export default function ProtectedRoute() {
  const { user, authLoading } = useUser();

  /*
   * Tunggu proses pengecekan session
   * dari UserContext selesai.
   */
  if (authLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-background'>
        <p className='font-body text-body text-text'>
          Memeriksa sesi pengguna...
        </p>
      </div>
    );
  }

  /*
   * Token menjadi bukti bahwa session login
   * masih tersedia.
   */
  const token = localStorage.getItem('smartgym_token');

  /*
   * Jika tidak ada user dan tidak ada token,
   * pengguna dianggap belum login.
   */
  if (!user && !token) {
    return <Navigate to='/login' replace />;
  }

  return <Outlet />;
}
