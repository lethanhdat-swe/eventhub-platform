import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/(public)/Home';
import Events from '@/pages/(public)/Events';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/(auth)/Login';
import Register from '@/pages/(auth)/Register';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
``;
