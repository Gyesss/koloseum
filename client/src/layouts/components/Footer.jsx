import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faXTwitter,
  faTiktok,
} from "@fortawesome/free-brands-svg-icons";

import Logo from "../../assets/koloseum-logo.svg";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/events", label: "Events" },
];

const socials = [
  {
    href: "https://instagram.com",
    icon: faInstagram,
    label: "Instagram",
  },
  {
    href: "https://x.com",
    icon: faXTwitter,
    label: "X",
  },
  {
    href: "https://tiktok.com",
    icon: faTiktok,
    label: "TikTok",
  },
];

export default function Footer() {
  return (
    <footer className="bg-surface border-border border-t px-6 py-10 md:px-12">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 md:flex-row md:items-start md:justify-between">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Koloseum" className="h-8 w-8 object-contain" />

            <span className="font-heading text-text text-2xl font-semibold tracking-wide">
              Koloseum
            </span>
          </div>

          <p className="font-body text-text-soft max-w-50 text-center text-sm md:text-left">
            Carpe diem et vince | Veni, vidi, vici | Ad aspera per astra
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-3 md:items-start">
          <span className="font-heading text-text text-base font-semibold">
            Navigation
          </span>

          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "font-body text-sm transition-colors duration-200",
                  isActive
                    ? "text-brand font-medium"
                    : "text-text-soft hover:text-brand",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Socials */}
        <div className="flex flex-col items-center gap-3 md:items-start">
          <span className="font-heading text-text text-base font-semibold">
            Follow Us
          </span>

          <div className="flex items-center gap-4">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="border-border text-text-soft hover:border-brand hover:text-brand hover:bg-brand/10 rounded-base flex h-9 w-9 items-center justify-center border transition-all duration-200"
              >
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-border mx-auto mt-8 flex max-w-4xl flex-col items-center gap-1 border-t pt-6 md:flex-row md:justify-between">
        <p className="font-body text-text-soft text-xs">
          © {new Date().getFullYear()} Koloseum. All rights reserved.
        </p>

        <div className="flex gap-4">
          <a
            href="/privacy"
            className="font-body text-text-soft hover:text-brand text-xs transition-colors duration-200"
          >
            Privacy Policy
          </a>

          <a
            href="/terms"
            className="font-body text-text-soft hover:text-brand text-xs transition-colors duration-200"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
