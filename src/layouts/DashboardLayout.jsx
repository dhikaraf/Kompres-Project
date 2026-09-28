import Navbar from '../components/layout/Navbar';

export default function DashboardLayout({ children }) {
  return (
    <main className='min-h-screen bg-background'>
      <Navbar variant='dashboard' />

      <section>{children}</section>
    </main>
  );
}
