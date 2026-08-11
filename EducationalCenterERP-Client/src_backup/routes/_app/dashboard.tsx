import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CalendarCheck,
  CreditCard,
  GraduationCap,
  ScanLine,
  UserRound,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [
      {
        title: "لوحة التحكم | Educational Center ERP",
      },
      {
        name: "description",
        content: "لوحة تحكم شاملة لإدارة السنتر.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const db = useDb();

  const today = new Date().toDateString();

  const todayAttendance = db.attendance.filter(
    (x) =>
      new Date(x.attendanceDate).toDateString() === today &&
      x.status === "Present",
  );

  const income = db.payments.reduce((sum, payment) => sum + payment.amount, 0);

  const stats = [
    {
      title: "إجمالي الطلاب",
      value: db.students.length,
      icon: Users,
    },
    {
      title: "المدرسين",
      value: db.teachers.length,
      icon: UserRound,
    },
    {
      title: "الكلاسات",
      value: db.courseClasses.length,
      icon: GraduationCap,
    },
    {
      title: "المواد",
      value: db.subjects.length,
      icon: BookOpen,
    },
    {
      title: "حضور اليوم",
      value: todayAttendance.length,
      icon: CalendarCheck,
    },
    {
      title: "إجمالي الإيرادات",
      value: `${income.toLocaleString()} ج.م`,
      icon: CreditCard,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            متابعة الطلاب والحضور والإيرادات والكلاسات.
          </p>
        </div>

        <Button asChild size="lg">
          <Link to="/scan">
            <ScanLine className="size-4" />
            بدء السكان
          </Link>
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="surface-card flex items-center justify-between p-5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div>
                <p className="text-sm text-muted-foreground">{item.title}</p>

                <h2 className="mt-2 text-3xl font-bold">{item.value}</h2>
              </div>

              <div className="rounded-2xl bg-primary/10 p-4">
                <Icon className="size-7 text-primary" />
              </div>
            </div>
          );
        })}
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {/* إحصائيات الكلاسات */}
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">نسبة إشغال الكلاسات</h2>

              <p className="text-sm text-muted-foreground">
                عدد الطلاب الحالي مقارنة بالحد الأقصى.
              </p>
            </div>

            <Badge variant="secondary">{db.courseClasses.length} كلاس</Badge>
          </div>

          <div className="space-y-5">
            {db.courseClasses.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                لا توجد كلاسات حتى الآن.
              </div>
            )}

            {db.courseClasses.map((course) => {
              const percent =
                course.maxStudents === 0
                  ? 0
                  : Math.min(
                      100,
                      Math.round(
                        (course.currentStudents / course.maxStudents) * 100,
                      ),
                    );

              return (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{course.name}</h3>

                      <p className="text-xs text-muted-foreground">
                        {course.subject} • {course.teacher}
                      </p>
                    </div>

                    <Badge>
                      {course.currentStudents} / {course.maxStudents}
                    </Badge>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{course.hall}</span>

                    <span>{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* آخر الكلاسات */}
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">الكلاسات الحالية</h2>

              <p className="text-sm text-muted-foreground">
                نظرة سريعة على الجدول.
              </p>
            </div>

            <Badge variant="outline">{db.courseClasses.length}</Badge>
          </div>

          <div className="space-y-4">
            {db.courseClasses.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                لا توجد كلاسات.
              </div>
            )}

            {db.courseClasses.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
              >
                <div>
                  <h3 className="font-semibold">{course.name}</h3>

                  <p className="text-sm text-muted-foreground">
                    {course.subject}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.day} • {course.startTime} - {course.endTime}
                  </p>
                </div>

                <div className="text-end">
                  <Badge>{course.teacher}</Badge>

                  <p className="mt-2 text-xs text-muted-foreground">
                    {course.hall}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        {/* آخر عمليات الحضور */}
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">آخر عمليات الحضور</h2>

              <p className="text-sm text-muted-foreground">
                أحدث عمليات تسجيل الحضور.
              </p>
            </div>

            <Badge variant="secondary">{db.attendance.length}</Badge>
          </div>

          <div className="space-y-3">
            {db.attendance.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                لا يوجد حضور مسجل.
              </div>
            )}

            {db.attendance.slice(0, 8).map((attendance) => (
              <div
                key={attendance.id}
                className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
              >
                <div>
                  <h3 className="font-semibold">{attendance.studentName}</h3>

                  <p className="text-sm text-muted-foreground">
                    {attendance.className}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(attendance.attendanceDate).toLocaleString(
                      "ar-EG",
                    )}
                  </p>
                </div>

                <Badge>{attendance.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* آخر المدفوعات */}
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">آخر المدفوعات</h2>

              <p className="text-sm text-muted-foreground">
                أحدث عمليات الدفع.
              </p>
            </div>

            <Badge variant="secondary">{db.payments.length}</Badge>
          </div>

          <div className="space-y-3">
            {db.payments.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                لا توجد مدفوعات حتى الآن.
              </div>
            )}

            {db.payments.slice(0, 8).map((payment) => {
              const student = db.students.find(
                (x) => x.id === payment.studentId,
              );

              return (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
                >
                  <div>
                    <h3 className="font-semibold">
                      {student?.fullName ?? "طالب"}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {payment.month}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(payment.date).toLocaleString("ar-EG")}
                    </p>
                  </div>

                  <Badge className="text-base">{payment.amount} ج.م</Badge>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-2">
        {/* إجراءات سريعة */}
        <div className="surface-card p-6">
          <h2 className="mb-6 text-xl font-bold">إجراءات سريعة</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/students">
                <Users className="size-7" />
                إضافة طالب
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/teachers">
                <UserRound className="size-7" />
                إضافة مدرس
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/classes">
                <GraduationCap className="size-7" />
                إنشاء كلاس
              </Link>
            </Button>

            <Button asChild className="h-24 flex-col gap-2">
              <Link to="/scan">
                <ScanLine className="size-7" />
                QR Scanner
              </Link>
            </Button>
          </div>
        </div>

        {/* ملخص النظام */}
        <div className="surface-card p-6">
          <h2 className="mb-6 text-xl font-bold">ملخص النظام</h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted p-4">
              <span className="font-medium">الطلاب المسجلون</span>

              <Badge>{db.students.length}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted p-4">
              <span className="font-medium">الاشتراكات</span>

              <Badge>{db.enrollments.length}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted p-4">
              <span className="font-medium">سجلات الحضور</span>

              <Badge>{db.attendance.length}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted p-4">
              <span className="font-medium">المدفوعات</span>

              <Badge>{db.payments.length}</Badge>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-primary/10 p-4">
              <span className="font-semibold">إجمالي الإيرادات</span>

              <span className="text-xl font-bold text-primary">
                {income.toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
