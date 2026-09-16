import {
  Link,
  Outlet,
  createFileRoute,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanLine,
  UserRound,
  Users,
  School,
  ClipboardCheck,
  UserPlus,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/data";
import { cn } from "@/lib/utils";
export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

const nav = [
  {
    to: "/dashboard",
    label: "لوحة التحكم",
    icon: LayoutDashboard,
  },
  {
    to: "/students",
    label: "الطلاب",
    icon: Users,
  },
  {
    to: "/teachers",
    label: "المدرسون",
    icon: UserRound,
  },
  {
    to: "/subjects",
    label: "المواد",
    icon: BookOpen,
  },
  {
    to: "/classes",
    label: "المجموعات",
    icon: School,
  },
  {
    to: "/student-enrollment",
    label: "تسجيل الطلاب",
    icon: UserPlus,
  },
  {
    to: "/attendance",
    label: "الحضور",
    icon: ClipboardCheck,
  },
  {
    to: "/payments",
    label: "المدفوعات",
    icon: CreditCard,
  },
  {
    to: "/scan",
    label: "QR Scanner",
    icon: ScanLine,
  },
  {
    to: "/expenses",
    label: "المصروفات",
    icon: CreditCard,
  },
] as const;

function AppLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!auth.current()) navigate({ to: "/", replace: true });
  }, [navigate]);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background lg:flex lg:h-screen lg:overflow-hidden">
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-72 shrink-0 overflow-y-auto bg-sidebar p-5 text-sidebar-foreground transition-transform lg:static lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-8 flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
            <GraduationCap className="size-5" />
          </span>
          <div>
            <p className="font-bold leading-tight">منصّة السنتر</p>
            <p className="text-xs text-sidebar-foreground/60">لوحة الإدارة</p>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === to
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => {
            auth.logout();
            navigate({ to: "/", replace: true });
          }}
          className="mt-8 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="size-4" />
          تسجيل الخروج
        </button>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-foreground/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col lg:overflow-hidden">
        <header className="flex items-center justify-between border-b border-border bg-card px-5 py-3 lg:hidden">
          <span className="font-bold">منصّة السنتر</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </Button>
        </header>
        <main className="flex-1 p-5 lg:overflow-y-auto lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
