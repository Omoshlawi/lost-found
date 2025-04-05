import APITest from '@/lib/api/APITest';
import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';

export function HomePage() {
  return (
    <>
      <Welcome />
      <APITest />
      <ColorSchemeToggle />
    </>
  );
}
