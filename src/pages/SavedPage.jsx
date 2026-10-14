import SavedList from '../components/saved/SavedList';

/**
 * 저장 목록 화면.
 * TODO(12주): fetchMyFavorites 로 목록 로드(useFavorites 훅 분리 권장), 위치 기반 재생 제한
 */
export default function SavedPage() {
  return (
    <section className="page">
      <h2>저장한 발자국</h2>
      <SavedList items={[]} />
    </section>
  );
}
