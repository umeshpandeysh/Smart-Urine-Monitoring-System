import Link from 'next/link';
import { requireAdmin } from '@/lib/auth/guards';

const adminNav = [
  { href: '/admin/dashboard', icon: '⊞', label: 'Overview' },
  { href: '/admin/users', icon: '👥', label: 'Users' },
  { href: '/admin/devices', icon: '📡', label: 'Devices' },
  { href: '/admin/reports', icon: '📄', label: 'Reports' },
  { href: '/admin/compliance', icon: '🛡️', label: 'Compliance' },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/50 fixed inset-y-0 left-0 z-20">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-display font-bold text-sm">U</span>
          </div>
          <div>
            <span className="font-display font-bold text-base text-foreground">UroSense</span>
            <span className="block text-xs text-muted-foreground">Admin Console</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {adminNav.map((item) => (
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
          <Link href="/patient-portal" className="block px-3 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors">
            ← User Portal
          </Link>
        </div>
      </aside>
      <main className="flex-1 md:ml-64 p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
