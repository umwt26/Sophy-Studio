import React from "react";

interface PageHeaderProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc?: string;
  /** Small label next to the title */
  badge?: string;
  /** Buttons on the right */
  actions?: React.ReactNode;
}

/** Shared title row for every tool page: icon, title, one-line description, actions. */
export const PageHeader: React.FC<PageHeaderProps> = ({ Icon, title, desc, badge, actions }) => (
  <div className="page-header shrink-0">
    <div className="flex items-center gap-3.5 min-w-0 flex-1">
      <span className="icon-tile">
        <Icon />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h1 className="page-title !text-[1.25rem] truncate">{title}</h1>
          {badge && <span className="chip chip-accent font-mono">{badge}</span>}
        </div>
        {desc && <p className="page-desc !mt-0.5 truncate">{desc}</p>}
      </div>
    </div>
    {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
  </div>
);
