import { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      setFading(true);
      window.setTimeout(() => setVisible(false), 500);
    };

    const fallback = window.setTimeout(finish, 1400);

    if (document.fonts?.ready) {
      document.fonts.ready.then(finish).catch(finish);
    }

    return () => window.clearTimeout(fallback);
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink transition-opacity duration-500 ${
        fading ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative h-14 w-14">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-violet/20 border-t-violet" />
        <span className="absolute inset-2 animate-spin rounded-full border-2 border-sky/20 border-b-sky [animation-duration:1.4s]" />
      </div>
      <p className="mt-6 font-display text-xs uppercase tracking-[0.4em] text-mist">
        Entering the Universe
      </p>
    </div>
  );
}
