import Link from "next/link";
import { requireAdminSession } from "@/lib/admin/auth";
import { getNewSubmissionsCount } from "@/lib/admin/messages";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "./LogoutButton";

const navItems = [
  { label: "Propiedades", href: "/admin/propiedades" },
  { label: "Mensajes", href: "/admin/mensajes" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdminSession();
  const newMessagesCount = await getNewSubmissionsCount();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 px-6 py-5 md:px-10">
          <div className="flex shrink-0 items-center gap-10">
            <Link href="/admin/propiedades">
              <Logo className="h-6" />
            </Link>
            <nav className="hidden items-center gap-7 md:flex">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative flex items-center gap-2 whitespace-nowrap text-[0.74rem] font-medium uppercase tracking-[0.14em] text-ink-soft transition-colors duration-300 hover:text-ink"
                >
                  {item.label}
                  {item.href === "/admin/mensajes" && newMessagesCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.62rem] font-semibold text-paper">
                      {newMessagesCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-6">
            <span className="hidden whitespace-nowrap text-[0.78rem] text-stone lg:inline">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
        <nav className="flex items-center gap-6 border-t border-line px-6 py-3 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.14em] text-ink-soft"
            >
              {item.label}
              {item.href === "/admin/mensajes" && newMessagesCount > 0 && (
                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[0.62rem] font-semibold text-paper">
                  {newMessagesCount}
                </span>
              )}
            </Link>
          ))}
        </nav>
      </header>
      <main className="px-6 py-10 md:px-10 md:py-14">{children}</main>
    </div>
  );
}
