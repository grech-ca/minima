import { FC } from 'react';

const Spinner: FC = () => (
  <span className="animate-spin text-indigo-500 h-40 w-40">
    <svg viewBox="0 0 40 40">
      <circle cy={20} cx={20} r={5} fill="none" stroke="#ddd" />
      <circle
        cy={20}
        cx={20}
        r={5}
        fill="none"
        stroke="currentColor"
        strokeDasharray={40}
        strokeDashoffset={-20}
        strokeLinecap="round"
      />
    </svg>
  </span>
);

export default Spinner;
