import { useEffect, useState } from 'react';
import './ProgressBar.css';

const clamp = (v, a = 0, b = 100) => Math.max(a, Math.min(b, v));

export default function ProgressBar({ label, solved = 0, total = 0, color = 'green' }) {
  const percent = total ? Math.round((solved / total) * 100) : 0;
  const [animated, setAnimated] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let rafId;
    let start;
    const duration = 800;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const t = clamp(elapsed / duration, 0, 1);
      // smooth ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(Math.round(percent * eased));
      setCount(Math.round(solved * eased));
      if (t < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [percent, solved]);

  return (
    <div className="pb-wrapper">
      <div className="pb-header">
        <div className="pb-label">{label}</div>
        <div className="pb-meta">
          <div className={`pb-count ${color}`}>{count}/{total}</div>
          <div className="pb-percent">{animated}%</div>
        </div>
      </div>

      <div className="pb-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
        <div className={`pb-fill ${color}`} style={{ width: `${animated}%` }} />
        <div className="pb-gloss" style={{ width: `${animated}%` }} />
      </div>
    </div>
  );
}
