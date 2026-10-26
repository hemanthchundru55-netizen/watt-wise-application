import type { ReactNode } from 'react';

export function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white border border-gray-100 shadow-card ${className}`}>
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          {icon}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-navy">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}
