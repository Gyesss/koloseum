import { BrowserRouter, Routes, Route } from "react-router-dom";

import RequireGuest from "../components/auth/RequireGuest";
import RequireAccess from "../components/auth/RequireAccess";
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";

import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Notifications from "../pages/notifications";
import Profile from "../pages/Profile";

import EventsIndex from "../pages/events/EventsIndex";
import EventDetail from "../pages/events/EventDetail";
import CreateEvent from "../pages/events/CreateEvent";
import EditEvent from "../pages/events/EditEvent";

import PostsIndex from "../pages/posts/PostsIndex";
import PostDetail from "../pages/posts/PostDetail";
import CreatePost from "../pages/posts/CreatePost";
import EditPost from "../pages/posts/EditPost";

import Dashboard from "../pages/Dashboard";

import Register from "../pages/Register";
import Login from "../pages/Login";
import Forbidden from "../pages/Forbidden";
import NotFound from "../pages/NotFound";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<Explore />} />
          <Route element={<RequireAccess />}>
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>

          <Route path="events">
            <Route index element={<EventsIndex />} />
            <Route path=":eventId" element={<EventDetail />} />
            <Route element={<RequireAccess roles={["ADMIN", "ORGANIZER"]} />}>
              <Route path="create" element={<CreateEvent />} />
              <Route path=":eventId/edit" element={<EditEvent />} />
            </Route>
          </Route>

          <Route path="posts">
            <Route index element={<PostsIndex />} />
            <Route path=":postId" element={<PostDetail />} />
            <Route element={<RequireAccess roles={["ADMIN", "ORGANIZER"]} />}>
              <Route path="create" element={<CreatePost />} />
              <Route path=":postId/edit" element={<EditPost />} />
            </Route>
          </Route>
        </Route>

        <Route element={<RequireGuest />}>
          <Route element={<AuthLayout />}>
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Route>

        <Route element={<RequireAccess roles={["ADMIN", "ORGANIZER"]} />}>
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
