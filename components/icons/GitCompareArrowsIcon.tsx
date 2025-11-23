
import React from 'react';

export const GitCompareArrowsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="5" cy="6" r="3" />
    <path d="M5 9v12" />
    <circle cx="19" cy="18" r="3" />
    <path d="M19 9v6" />
    <path d="m15 9-3-3 3-3" />
    <path d="m9 21 3 3-3 3" />
  </svg>
);
