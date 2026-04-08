import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface AppShellProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function AppShell({
  title,
  subtitle,
  rightSlot,
  children,
  className
}: AppShellProps) {
  return (
    <main className={cn("mx-auto w-full max-w-6xl px-4 pb-12 pt-6", className)}>
      <header className="mb-5 rounded-2xl border border-border/50 bg-white/80 p-4 backdrop-blur sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
            {subtitle ? (
              <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
        </div>
      </header>
      {children}
    </main>
  );
}
