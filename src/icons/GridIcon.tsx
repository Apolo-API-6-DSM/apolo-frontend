import React from "react";
export default function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} fill="none" {...props}>
      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
    </svg>
  );
}
