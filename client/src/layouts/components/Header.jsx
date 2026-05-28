import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faCompass,
  faCalendarDays,
  faBell,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../../assets/koloseum-logo.svg";

import useAuth from "../../hooks/useAuth";
import { getNotifications } from "../../api/notifications";

const navigations = [
  { to: "/", label: "Home", icon: faHouse },
  { to: "/explore", label: "Explore", icon: faCompass },
  { to: "/events", label: "Events", icon: faCalendarDays },
];

export default function Header() {
  const { user } = useAuth();

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadNotifications = async () => {
      try {
        const response = await getNotifications({
          unread: true,
          page: 1,
          limit: 10,
        });

        setUnreadCount(response.data.meta.total || 0);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    if (user) {
      fetchUnreadNotifications();
    }
  }, [user]);

  const initials = useMemo(() => {
    if (!user?.fullName) return "?";

    return user.fullName
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }, [user]);

  return (
    <header className="group/header bg-surface/95 border-border rounded-card fixed bottom-4 left-1/2 z-50 flex h-16 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-center border px-3 backdrop-blur-md md:top-1/2 md:bottom-auto md:left-6 md:h-auto md:w-16 md:max-w-none md:translate-x-0 md:-translate-y-1/2 md:flex-col md:justify-start md:gap-2 md:px-2 md:py-3 md:transition-all md:duration-300 md:hover:w-56">
      {/* Logo */}
      <div className="rounded-base hidden h-12 w-full shrink-0 items-center overflow-hidden md:flex">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center">
          <img src={Logo} alt="Koloseum" className="h-8 w-8 object-contain" />
        </div>

        <span className="font-heading text-text pr-3 text-lg font-semibold tracking-wide whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover/header:opacity-100">
          Koloseum
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex w-full items-center justify-around gap-2 md:flex-col md:justify-start">
        {navigations.map((item) => (
          <NavItem key={item.to} {...item} />
        ))}

        <NavItem
          to="/notifications"
          label="Notifications"
          icon={faBell}
          notificationCount={unreadCount}
        />

        <ProfileNavItem user={user} initials={initials} />
      </nav>
    </header>
  );
}

function NavItem({ to, icon, label, notificationCount = 0 }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        clsx(
          "relative flex items-center",
          notificationCount > 0 ? "overflow-visible" : "overflow-hidden",

          "rounded-base transition-all duration-300",
          "h-11 w-11 justify-center",
          "md:w-full md:justify-start",

          isActive ? "bg-brand text-white" : "text-text hover:bg-brand/10",
        )
      }
    >
      {/* Icon */}
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center text-base">
        <FontAwesomeIcon icon={icon} />

        {notificationCount > 0 && (
          <span className="absolute top-2 right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] leading-none font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </div>

      {/* Label */}
      <span className="font-body hidden pr-5 text-sm font-medium whitespace-nowrap md:block md:opacity-0 md:transition-opacity md:duration-200 md:group-hover/header:opacity-100">
        {label}
      </span>
    </NavLink>
  );
}

function ProfileNavItem({ user, initials }) {
  const isLoggedIn = !!user;

  return (
    <NavLink
      to={isLoggedIn ? "/profile" : "/login"}
      className={({ isActive }) =>
        clsx(
          "relative flex items-center overflow-hidden",
          "rounded-base transition-all duration-300",
          "h-11 w-11 justify-center",
          "md:w-full md:justify-start",
          isActive
            ? "bg-brand text-white shadow-sm"
            : "text-text hover:bg-brand/10",
        )
      }
    >
      {({ isActive }) => (
        <>
          {/* Avatar / Login Icon */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center">
            {isLoggedIn ? (
              user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className={clsx(
                    "h-8 w-8 rounded-full object-cover",
                    isActive && "ring-2 ring-white/60",
                  )}
                />
              ) : (
                <div
                  className={clsx(
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold",
                    isActive ? "text-brand bg-white" : "bg-brand text-white",
                  )}
                >
                  {initials}
                </div>
              )
            ) : (
              <div
                className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  !isActive && "bg-brand/10 text-brand",
                )}
              >
                <FontAwesomeIcon icon={faRightToBracket} />
              </div>
            )}
          </div>

          {/* Label */}
          <span className="font-body hidden pr-5 text-sm font-medium whitespace-nowrap md:block md:opacity-0 md:transition-opacity md:duration-200 md:group-hover/header:opacity-100">
            {isLoggedIn ? "Profile" : "Sign in"}
          </span>
        </>
      )}
    </NavLink>
  );
}
