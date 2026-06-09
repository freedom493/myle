import Link from "next/link";
import type { ComponentType } from "react";

interface CardProps {
  title: string;
  description: string;
  href: string;
  Icon: ComponentType<{ className?: string }>;
}

import { ArrowRight } from "lucide-react";

export function Card({ title, description, href, Icon }: CardProps) {
  return (
    <Link href={href} className="glass-panel group block overflow-hidden rounded-[24px] p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-lime/40 hover:shadow-md hover:shadow-brand-indigo/5">
      <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-indigo/5 text-brand-indigo ring-1 ring-brand-indigo/5 transition-all duration-300 group-hover:bg-brand-indigo group-hover:text-brand-lime group-hover:scale-105">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-bold text-brand-indigo tracking-tight">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-brand-muted">{description}</p>
      <div className="mt-6 flex items-center gap-1.5 text-sm font-bold text-brand-indigo">
        <span>Explore</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
