import { Outlet } from 'react-router-dom';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

export default function UserLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1"><Outlet /></main>
      <Footer />
    </div>
  );
}
