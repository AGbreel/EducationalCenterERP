import { createFileRoute, Link } from "@tanstack/react-router";

import { BookOpen, CalendarCheck, CreditCard, ScanLine, UserRound, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      { title: "لوحة التحكم | منصّة السنتر" },
      { name: "description", content: "نظرة شاملة على الطلاب والمدرسين والحضور والإيرادات." },
      { property: "og:title", content: "لوحة التحكم | منصّة السنتر" },
      { property: "og:description", content: "إحصائيات الطلاب والحضور والإيرادات لحظة بلحظة." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const db = useDb();
  const today = new Date().toDateString();
  const todayAttendance = db.attendance.filter((a) => new Date(a.date).toDateString() === today);
  const income = db.payments.reduce((sum, p) => sum + p.amount, 0);

  const stats = [
    { label: "إجمالي الطلاب", value: db.students.length, icon: Users },
    { label: "المدرسون", value: db.teachers.length, icon: UserRound },
    { label: "المواد", value: db.subjects.length, icon: BookOpen },
    { label: "حضور اليوم", value: todayAttendance.length, icon: CalendarCheck },
  ];

  const chartData = db.subjects.map((s) => ({
    name: s.name,
    حضور: db.attendance.filter((a) => a.subjectId === s.id).length,
    طلاب: db.enrollments.filter((e) => e.subjectId === s.id).length,
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            متابعة كاملة لنشاط السنتر: الطلاب، الحضور، والمصاريف.
          </p>
        </div>
        <Button asChild size="lg">
          <Link to="/scan">
            <ScanLine className="size-4" /> ابدأ السكان
          </Link>
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="surface-card flex items-center gap-4 p-5">
            <span className="grid size-12 place-items-center rounded-xl bg-secondary text-secondary-foreground">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="surface-card p-5 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold">الحضور والاشتراكات حسب المادة</h2>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-sm bg-primary" /> طلاب
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-3 rounded-sm bg-accent" /> حضور
              </span>
            </div>
          </div>
          <div className="space-y-4">
            {chartData.length === 0 && (
              <p className="text-sm text-muted-foreground">أضف مواد لعرض الإحصائيات.</p>
            )}
            {chartData.map((row) => {
              const max = Math.max(1, ...chartData.map((r) => Math.max(r.طلاب, r.حضور)));
              return (
                <div key={row.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{row.name}</span>
                    <span className="text-muted-foreground">
                      {row.طلاب} طالب · {row.حضور} حضور
                    </span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${(row.طلاب / max) * 100}%` }}
                    />
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(row.حضور / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        <div className="surface-card space-y-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
              <CreditCard className="size-5" />
            </span>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المصاريف المحصّلة</p>
              <p className="text-2xl font-bold">{income.toLocaleString("ar-EG")} ج.م</p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold">آخر العمليات</h3>
            {db.payments.length === 0 && db.attendance.length === 0 && (
              <p className="text-sm text-muted-foreground">لا توجد عمليات بعد — ابدأ بمسح QR طالب.</p>
            )}
            {db.payments.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                <span>{db.students.find((s) => s.id === p.studentId)?.name ?? "طالب"}</span>
                <Badge variant="secondary">{p.amount} ج.م</Badge>
              </div>
            ))}
            {db.attendance.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2 text-sm">
                <span>{db.students.find((s) => s.id === a.studentId)?.name ?? "طالب"}</span>
                <Badge>{db.subjects.find((s) => s.id === a.subjectId)?.name ?? "حضور"}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
