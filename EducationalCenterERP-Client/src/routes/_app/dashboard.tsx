import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  BookOpen,
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
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

const PAGE_SIZE = 5;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-5 flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
      >
        <ChevronRight className="size-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
      >
        <ChevronLeft className="size-4" />
      </Button>
    </div>
  );
}

function DashboardPage() {
  const db = useDb();

  const [occupancyPage, setOccupancyPage] = useState(1);
  const [classesPage, setClassesPage] = useState(1);
  const [attendancePage, setAttendancePage] = useState(1);
  const [paymentsPage, setPaymentsPage] = useState(1);

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
      title: "المجموعات",
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

  // -----------------------------
  // Pagination - المجموعات
  // -----------------------------

  const occupancyTotalPages = Math.ceil(db.courseClasses.length / PAGE_SIZE);

  const paginatedOccupancyClasses = db.courseClasses.slice(
    (occupancyPage - 1) * PAGE_SIZE,
    occupancyPage * PAGE_SIZE,
  );

  const classesTotalPages = Math.ceil(db.courseClasses.length / PAGE_SIZE);

  const paginatedClasses = db.courseClasses.slice(
    (classesPage - 1) * PAGE_SIZE,
    classesPage * PAGE_SIZE,
  );

  // -----------------------------
  // Pagination - الحضور
  // -----------------------------

  const sortedAttendance = [...db.attendance].sort(
    (a, b) =>
      new Date(b.attendanceDate).getTime() -
      new Date(a.attendanceDate).getTime(),
  );

  const attendanceTotalPages = Math.ceil(sortedAttendance.length / PAGE_SIZE);

  const paginatedAttendance = sortedAttendance.slice(
    (attendancePage - 1) * PAGE_SIZE,
    attendancePage * PAGE_SIZE,
  );

  // -----------------------------
  // Pagination - المدفوعات
  // -----------------------------

  const sortedPayments = [...db.payments].sort(
    (a, b) =>
      new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
  );

  const paymentsTotalPages = Math.ceil(sortedPayments.length / PAGE_SIZE);

  const paginatedPayments = sortedPayments.slice(
    (paymentsPage - 1) * PAGE_SIZE,
    paymentsPage * PAGE_SIZE,
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            متابعة الطلاب والحضور والإيرادات والمجموعات.
          </p>
        </div>

        <Button asChild size="lg">
          <Link to="/scan">
            <ScanLine className="size-4" />
            بدء السكان
          </Link>
        </Button>
      </header>

      {/* الإحصائيات */}
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

      {/* المجموعات */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* إحصائيات المجموعات */}
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">نسبة إشغال المجموعات</h2>

              <p className="text-sm text-muted-foreground">
                عدد الطلاب الحالي مقارنة بالحد الأقصى.
              </p>
            </div>

            <Badge variant="secondary">{db.courseClasses.length} مجموعة</Badge>
          </div>

          <div className="space-y-5">
            {db.courseClasses.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                لا توجد مجموعات حتى الآن.
              </div>
            )}

            {paginatedOccupancyClasses.map((course) => {
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

          <Pagination
            currentPage={occupancyPage}
            totalPages={occupancyTotalPages}
            onPageChange={setOccupancyPage}
          />
        </div>

        {/* المجموعات الحالية */}
        <div className="surface-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">المجموعات الحالية</h2>

              <p className="text-sm text-muted-foreground">
                نظرة سريعة على الجدول.
              </p>
            </div>

            <Badge variant="outline">{db.courseClasses.length}</Badge>
          </div>

          <div className="space-y-4">
            {db.courseClasses.length === 0 && (
              <div className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
                لا توجد مجموعات.
              </div>
            )}

            {paginatedClasses.map((course) => (
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

          <Pagination
            currentPage={classesPage}
            totalPages={classesTotalPages}
            onPageChange={setClassesPage}
          />
        </div>
      </section>

      {/* الحضور والمدفوعات */}
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

            {paginatedAttendance.map((attendance) => (
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

          <Pagination
            currentPage={attendancePage}
            totalPages={attendanceTotalPages}
            onPageChange={setAttendancePage}
          />
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

            {paginatedPayments.map((payment) => {
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
                      {new Date(payment.paymentDate).toLocaleString("ar-EG")}
                    </p>
                  </div>

                  <Badge className="text-base">{payment.amount} ج.م</Badge>
                </div>
              );
            })}
          </div>

          <Pagination
            currentPage={paymentsPage}
            totalPages={paymentsTotalPages}
            onPageChange={setPaymentsPage}
          />
        </div>
      </section>

      {/* الإجراءات السريعة وملخص النظام */}
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
                إنشاء مجموعة
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
