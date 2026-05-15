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
import Search from './pages/(public)/Search';
import Booking from './pages/(public)/Booking';
import Payment from './pages/(public)/Payment';
import Profile from './pages/(public)/Profile';

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
        <Route path="/search" element={<Search />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
      </Route>
    </Routes>
  );
}

export default App;
