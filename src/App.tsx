import { useState } from 'react';
import { Page } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import TrackComplaint from './pages/TrackComplaint';
import CivicMap from './pages/CivicMap';
import Statistics from './pages/Statistics';
import MunicipalDashboard from './pages/MunicipalDashboard';
import FAQ from './pages/FAQ';
import Announcements from './pages/Announcements';
import Rewards from './pages/Rewards';
import CommunityFund from './pages/CommunityFund';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});

  const navigate = (page: Page, params: Record<string, string> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo(0, 0);
  };

  const isMapPage = currentPage === 'map';

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <Header currentPage={currentPage} onNavigate={navigate} />

      <main className={`flex-1 ${isMapPage ? 'overflow-hidden' : ''}`}>
        {currentPage === 'home' && <Home onNavigate={navigate} />}
        {currentPage === 'report' && <ReportIssue onNavigate={navigate} />}
        {currentPage === 'track' && <TrackComplaint initialId={pageParams.id} />}
        {currentPage === 'map' && <CivicMap />}
        {currentPage === 'statistics' && <Statistics />}
        {currentPage === 'dashboard' && <MunicipalDashboard />}
        {currentPage === 'faq' && <FAQ />}
        {currentPage === 'announcements' && <Announcements />}
        {currentPage === 'rewards' && <Rewards />}
        {currentPage === 'fund' && <CommunityFund />}
      </main>

      {!isMapPage && <Footer onNavigate={navigate} />}
    </div>
  );
}
