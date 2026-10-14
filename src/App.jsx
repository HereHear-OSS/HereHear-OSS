import { Route, Routes } from 'react-router-dom';
import MapPage from './pages/MapPage';
import RegisterPage from './pages/RegisterPage';
import SavedPage from './pages/SavedPage';
import BottomNav from './components/common/BottomNav';
import ErrorBanner from './components/common/ErrorBanner';
import { useAnonymousSession } from './hooks/useAnonymousSession';
import { isSupabaseConfigured } from './lib/supabaseClient';

export default function App() {
  const { loading, error } = useAnonymousSession();

  return (
    <div className="app">
      {!isSupabaseConfigured && (
        <ErrorBanner message=".env 에 Supabase 설정이 없어요. (.env.example 참고)" />
      )}
      {error && <ErrorBanner message="익명 세션을 만들지 못했어요. Anonymous sign-ins 설정을 확인하세요." />}
      {loading ? (
        <p className="loading">불러오는 중…</p>
      ) : (
        <main className="app-main">
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/saved" element={<SavedPage />} />
          </Routes>
        </main>
      )}
      <BottomNav />
    </div>
  );
}
