import { NavLink } from 'react-router-dom';

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end>지도</NavLink>
      <NavLink to="/register">등록</NavLink>
      <NavLink to="/saved">저장</NavLink>
    </nav>
  );
}
