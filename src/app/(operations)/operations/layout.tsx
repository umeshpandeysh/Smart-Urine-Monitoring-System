import Link from 'next/link';
import { requireOperator } from '@/lib/auth/guards';

const opsNav = [
  { href: '/operations/dashboard', icon: '⊞', label: 'Overview' },
  { href: '/operations/devices', icon: '📡', label: 'Devices' },
  { href: '/operations/alerts', icon: '🚨', label: 'Alerts' },
  { href: '/operations/maintenance', icon: '🔧', label: 'Maintenance' },
];

export default async function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireOperator();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 fixed inset-y-0 left-0 z-20">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-health-caution/80 flex items-center justify-center shrink-0">
            <span className="text-white font-display font-bold text-sm">O</span>
          </div>
          <div>
            <span className="font-display font-bold text-base text-foreground">UroSense</span>
            <span className="block text-xs text-muted-foreground">Operations Center</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {opsNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all text-sm font-medium"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-border space-y-1">
          <Link href="/dashboard" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            ← User Portal
          </Link>
          <Link href="/admin/dashboard" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            → Admin Console
          </Link>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
