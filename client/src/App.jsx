import { Navigate, Route, Routes } from 'react-router-dom';
import PublicLayout from '@/layouts/PublicLayout';
import Home from '@/pages/(public)/Home';
import Events from '@/pages/(public)/Events';
import AuthLayout from '@/layouts/AuthLayout';
import LoginPage from '@/pages/(auth)/Login/LoginPage';
import RegisterPage from '@/pages/(auth)/Register/RegisterPage';
import VerifyEmailPage from '@/pages/(auth)/VerifyEmail/VerifyEmailPage';
import ForgotPasswordPage from '@/pages/(auth)/ForgotPassword/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/(auth)/ResetPassword/ResetPasswordPage';
import Blog from './pages/(public)/Blog';
import BlogDetail from './pages/(public)/Blog/BlogDetail';
import EventDetail from './pages/(public)/Events/EventDetail';
import Contact from './pages/(public)/Contact';
import Search from './pages/(public)/Search';
import Booking from './pages/(public)/Booking';
import Payment from './pages/(public)/Payment';
import PaymentFailedPage from './pages/(public)/PaymentFailed';
import PaymentQrPage from './pages/(public)/PaymentQr';
import PaymentSuccessPage from './pages/(public)/PaymentSuccess';
import Profile from './pages/(public)/Profile';
import AdminLayout from '@/layouts/AdminLayout';
import AuthGuestRoute from '@/routes/AuthGuestRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import Dashboard from '@/pages/(admin)/Dashboard';
import AdminEvents from '@/pages/(admin)/Events';
import CreateEvent from '@/pages/(admin)/Events/CreateEvent';
import AdminEventDetail from '@/pages/(admin)/Events/EventDetail';
import EditEvent from '@/pages/(admin)/Events/EditEvent';
import EventCategories from '@/pages/(admin)/EventCategories';
import Artists from '@/pages/(admin)/Artists';
import DefaultSeats from '@/pages/(admin)/DefaultSeats';
import TicketTypes from '@/pages/(admin)/TicketTypes';
import Orders from '@/pages/(admin)/Orders';
import PaymentTransactions from '@/pages/(admin)/PaymentTransactions';
import Tickets from '@/pages/(admin)/Tickets';
import Coupons from '@/pages/(admin)/Coupons';
import Blogs from '@/pages/(admin)/Blogs';
import CreateBlog from '@/pages/(admin)/Blogs/CreateBlog';
import EditBlog from '@/pages/(admin)/Blogs/EditBlog';
import BlogCategories from '@/pages/(admin)/BlogCategories';
import CheckIn from '@/pages/(admin)/CheckIn';
import CheckInLogs from '@/pages/(admin)/CheckInLogs';
import Users from '@/pages/(admin)/Users';
import Settings from '@/pages/(admin)/Settings';
import PaymentStatus from './pages/(public)/PaymentStatus';
import EventCheckInPage from './pages/(public)/EventCheckInPage';
import ContactPage from './pages/(admin)/Contact';
import AIBlogConfig from './pages/(admin)/AIBlogConfig/AIBlogConfig';
import MyTickets from './pages/(public)/MyTickets/MyTickets';

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="events" element={<Events />} />
        <Route path="events/:slug" element={<EventDetail />} />
        <Route path="blogs" element={<Blog />} />
        <Route path="blog/:id" element={<BlogDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="/search" element={<Search />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment/qr/:orderId" element={<PaymentQrPage />} />
        <Route
          path="/payment-success/:orderId"
          element={<PaymentSuccessPage />}
        />
        <Route
          path="/payment-failed/:orderId"
          element={<PaymentFailedPage />}
        />
        <Route path="/payment-status" element={<PaymentStatus />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-tickets" element={<MyTickets />} />
        <Route path="/event-checkin/:id" element={<EventCheckInPage />} />
      </Route>

      <Route path="/auth" element={<Navigate replace to="/login" />} />
      <Route
        path="/auth/register"
        element={<Navigate replace to="/register" />}
      />

      <Route element={<AuthGuestRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="events/create" element={<CreateEvent />} />
          <Route path="events/:id/edit" element={<EditEvent />} />
          <Route path="events/:id" element={<AdminEventDetail />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="event-categories" element={<EventCategories />} />
          <Route path="artists" element={<Artists />} />
          <Route path="default-seats" element={<DefaultSeats />} />
          <Route path="ticket-types" element={<TicketTypes />} />
          <Route path="orders" element={<Orders />} />
          <Route
            path="payment-transactions"
            element={<PaymentTransactions />}
          />
          <Route path="tickets" element={<Tickets />} />
          <Route path="coupons" element={<Coupons />} />
          <Route path="blogs/create" element={<CreateBlog />} />
          <Route path="blogs/:id/edit" element={<EditBlog />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog-categories" element={<BlogCategories />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="check-in-logs" element={<CheckInLogs />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<Settings />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="ai-blog-config" element={<AIBlogConfig />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
