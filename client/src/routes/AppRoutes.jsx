import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireGuest from "../components/auth/RequireGuest";
import RequireAccess from "../components/auth/RequireAccess";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Privacy from "../pages/Privacy";
import Terms from "../pages/Terms";
import Explore from "../pages/Explore";
import Onboarding from "../pages/Onboarding";
import Notifications from "../pages/Notifications";

import ProfileIndex from "../pages/profile/ProfileIndex";
import EditProfile from "../pages/profile/EditProfile";
import UserProfile from "../pages/profile/UserProfile";

import EventsIndex from "../pages/events/EventsIndex";
import EventDetail from "../pages/events/EventDetail";
import CreateEvent from "../pages/events/CreateEvent";
import EditEvent from "../pages/events/EditEvent";
import EventInvitation from "../pages/events/EventInvitation";

import PostsIndex from "../pages/posts/PostsIndex";
import PostDetail from "../pages/posts/PostDetail";
import CreatePost from "../pages/posts/CreatePost";
import EditPost from "../pages/posts/EditPost";

import Dashboard from "../pages/Dashboard";

import Register from "../pages/Register";
import Login from "../pages/Login";
import VerifyEmail from "../pages/VerifyEmail";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";

import Demo from "../pages/Demo";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="explore" element={<Explore />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="demo" element={<Demo />} />
          <Route element={<RequireAccess />}>
            <Route path="notifications" element={<Notifications />} />

            <Route path="profile">
              <Route index element={<ProfileIndex />} />
              <Route path="edit" element={<EditProfile />} />
            </Route>
            <Route path="users">
              <Route path=":userId" element={<UserProfile />} />
            </Route>
          </Route>

          <Route path="events">
            <Route index element={<EventsIndex />} />
            <Route path=":eventId" element={<EventDetail />} />
            <Route element={<RequireAccess roles={["ADMIN", "ORGANIZER"]} />}>
              <Route path="create" element={<CreateEvent />} />
              <Route path=":eventId/edit" element={<EditEvent />} />
              <Route path=":eventId/invitation" element={<EventInvitation />} />
            </Route>
          </Route>

          <Route path="posts">
            <Route index element={<PostsIndex />} />
            <Route path=":eventId/:postId" element={<PostDetail />} />
            <Route element={<RequireAccess roles={["ADMIN", "ORGANIZER"]} />}>
              <Route path="create" element={<CreatePost />} />
              <Route path=":eventId/:postId/edit" element={<EditPost />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireGuest />}>
          <Route element={<AuthLayout />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="verify-email" element={<VerifyEmail />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
          </Route>
        </Route>

        <Route element={<RequireAccess roles={["403"]} />}>
          <Route path="dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="403" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
