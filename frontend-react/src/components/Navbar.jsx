import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ marginBottom: '16px' }}>
      <Link to="/">Tasks</Link> |{' '}
      <Link to="/stats">Stats</Link> |{' '}
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
