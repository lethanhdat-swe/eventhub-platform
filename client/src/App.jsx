import { Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/(public)/Home';
import Events from '@/pages/(public)/Events';
import AuthLayout from '@/layouts/AuthLayout';
import Login from '@/pages/(auth)/Login';
import Register from '@/pages/(auth)/Register';
import Blog from './pages/(public)/Blog';
import BlogDetail from './pages/(public)/Blog/BlogDetail';
import EventDetail from './pages/(public)/Events/EventDetail';
import Contact from './pages/(public)/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:id" element={<EventDetail />} />
        <Route path="blogs" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
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
