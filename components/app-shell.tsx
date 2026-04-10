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
    <div className="flex min-h-screen flex-col">
      <main className={cn("mx-auto w-full max-w-6xl flex-1 px-4 pb-12 pt-6 transition-all duration-500 animate-in fade-in zoom-in-95 duration-700", className)}>
        <header className="glass mb-8 rounded-3xl p-6 md:p-10">
          <div className="flex flex-col items-center text-center gap-6">
            <img src="/logo.png" alt="XMS Logo" className="h-24 w-auto object-contain" />
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="mx-auto max-w-2xl text-base text-slate-500 font-medium leading-relaxed">
                  {subtitle}
                </p>
              ) : null}
            </div>

            {rightSlot ? (
              <div className="flex shrink-0 items-center justify-center gap-2 pt-2">
                {rightSlot}
              </div>
            ) : null}
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150 fill-mode-both">
          {children}
        </div>
      </main>

      <footer className="w-full border-t border-slate-200/50 bg-white/30 backdrop-blur-sm py-8 text-center">
        <div className="mx-auto max-w-6xl px-4">
          <p className="text-xs text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} SEM Planning · All rights reserved.
          </p>
          <p className="mt-2 text-[11px] text-slate-400">
            Made with professional care by{" "}
            <a 
              href="https://xperienceaimarketing.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-primary hover:underline transition-all"
            >
              Xperience Ai Marketing Solutions
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
