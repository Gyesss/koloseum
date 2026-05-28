import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";

export default function FloatingNav() {
  const navigate = useNavigate();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-surface border-border rounded-card fixed right-6 bottom-6 z-50 hidden items-center gap-2 border px-2 py-2 shadow-sm md:flex">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="hover:bg-brand/10 rounded-base flex h-9 w-9 items-center justify-center transition"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
      </button>

      {/* Forward */}
      <button
        onClick={() => navigate(1)}
        className="hover:bg-brand/10 rounded-base flex h-9 w-9 items-center justify-center transition"
      >
        <FontAwesomeIcon icon={faArrowRight} />
      </button>

      {/* Scroll to top */}
      <button
        onClick={scrollToTop}
        className="hover:bg-brand/10 rounded-base flex h-9 w-9 items-center justify-center transition"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  );
}
