import Navbar from '../components/Navbar';
import Loading from '../components/Loading';
import ErrorView from '../components/ErrorView';
import { Outlet } from 'react-router-dom';

export default function MainLayout({ loading, error }) {
  return (
    <div>
      <Navbar />

      <main style={{ padding: '16px' }}>
        {loading && <Loading />}
        {error && <ErrorView message={error} />}

        {!loading && !error && <Outlet />}
      </main>
    </div>
  );
}