import React from "react";

type IconProps = React.SVGProps<SVGSVGElement>;

const defaults = {
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function ArrowRight(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M5 11l6-6M6 5h5v5" />
    </svg>
  );
}

export function ArrowLeft(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M13 8H3M7 4L3 8l4 4" />
    </svg>
  );
}

export function ArrowUp(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M8 13V3M4 7l4-4 4 4" />
    </svg>
  );
}

export function Sparkle(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M8 2.5v3M8 10.5v3M2.5 8h3M10.5 8h3M4.1 4.1l1.4 1.4M10.5 10.5l1.4 1.4M4.1 11.9l1.4-1.4M10.5 5.5l1.4-1.4" />
    </svg>
  );
}

export function Star(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M8 2.2l1.75 3.55 3.92.57-2.84 2.76.67 3.9L8 11.14l-3.5 1.84.67-3.9-2.84-2.76 3.92-.57L8 2.2z" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}

export function Copy(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
      <path d="M10.5 5.5V4a1.5 1.5 0 00-1.5-1.5H4A1.5 1.5 0 002.5 4v5A1.5 1.5 0 004 10.5h1.5" />
    </svg>
  );
}

export function Menu(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M2.5 5.5h11M2.5 10.5h11" />
    </svg>
  );
}

export function Close(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M4 4l8 8M12 4l-8 8" />
    </svg>
  );
}

export function Mail(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="M2.5 4.5l5.5 4.5 5.5-4.5" />
    </svg>
  );
}

export function Sun(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <circle cx="8" cy="8" r="2.75" />
      <path d="M8 1.5v1.25M8 13.25v1.25M1.5 8h1.25M13.25 8h1.25M3.4 3.4l.9.9M11.7 11.7l.9.9M3.4 12.6l.9-.9M11.7 4.3l.9-.9" />
    </svg>
  );
}

export function Moon(props: IconProps) {
  return (
    <svg {...defaults} {...props}>
      <path d="M13.5 9.6A5.75 5.75 0 016.4 2.5a5.75 5.75 0 107.1 7.1z" />
    </svg>
  );
}
