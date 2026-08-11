import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Trash2, Plus } from "lucide-react";

import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/student-enrollment")({
  head: () => ({
    meta: [
      {
        title: "تسجيل الطلاب داخل الكلاسات | منصة السنتر",
      },
      {
        name: "description",
        content: "ربط الطلاب بالكلاسات وتحديد قيمة الاشتراك الشهري.",
      },
    ],
  }),
  component: StudentEnrollmentPage,
});
function StudentEnrollmentPage() {
  const db = useDb();

  const [form, setForm] = useState({
    studentId: "",
    courseClassId: "",
    monthlyFee: "",
  });

  const [saving, setSaving] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.studentId || !form.courseClassId || !form.monthlyFee) {
      toast.error("أكمل جميع البيانات");
      return;
    }

    try {
      setSaving(true);

      await api.enrollStudent(form.studentId, form.courseClassId, Number(form.monthlyFee));
      toast.success("تم تسجيل الطالب داخل الكلاس");

      setForm({
        studentId: "",
        courseClassId: "",
        monthlyFee: "",
      });
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">تسجيل الطلاب داخل الكلاسات</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          اربط الطالب بالكلاس وحدد قيمة الاشتراك الشهري.
        </p>
      </header>

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-4"
      >
        <div className="space-y-2">
          <Label>الطالب</Label>

          <select
            className="h-10 w-full rounded-md border bg-background px-3"
            value={form.studentId}
            onChange={(e) =>
              setForm({
                ...form,
                studentId: e.target.value,
              })
            }
          >
            <option value="">اختر الطالب</option>

            {db.students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.fullName}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>الكلاس</Label>

          <select
            className="h-10 w-full rounded-md border bg-background px-3"
            value={form.courseClassId}
            onChange={(e) =>
              setForm({
                ...form,
                courseClassId: e.target.value,
              })
            }
          >
            <option value="">اختر الكلاس</option>

            {db.courseClasses.map((courseClass) => (
              <option key={courseClass.id} value={courseClass.id}>
                {courseClass.name} - {courseClass.teacher}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>الاشتراك الشهري</Label>

          <Input
            type="number"
            placeholder="300"
            value={form.monthlyFee}
            onChange={(e) =>
              setForm({
                ...form,
                monthlyFee: e.target.value,
              })
            }
          />
        </div>

        <div className="flex items-end">
          <Button className="w-full" size="lg" type="submit" disabled={saving}>
            <Plus className="size-4" />

            {saving ? "جاري التسجيل..." : "تسجيل الطالب"}
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        {db.enrollments.length === 0 && (
          <div className="surface-card p-6 text-center text-muted-foreground">
            لا يوجد أي طالب مسجل داخل الكلاسات حتى الآن.
          </div>
        )}

        {db.enrollments.map((enrollment) => {
          const student = db.students.find(
            (s) => s.id === enrollment.studentId,
          );

          const courseClass = db.courseClasses.find(
            (c) => c.id === enrollment.courseClassId,
          );

          return (
            <div key={enrollment.id} className="surface-card space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">
                    {student?.fullName ?? "طالب غير موجود"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {courseClass?.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {courseClass?.subject}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge>{courseClass?.teacher}</Badge>

                    <Badge variant="secondary">{courseClass?.day}</Badge>

                    <Badge variant="outline">
                      {courseClass?.startTime} - {courseClass?.endTime}
                    </Badge>

                    <Badge variant="outline">{courseClass?.hall}</Badge>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <Badge className="text-base">
                    {enrollment.monthlyFee} ج.م
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف"
                    onClick={() => {
                      api
                        .unenroll(enrollment.id)
                        .then(() => toast.success("تم إلغاء تسجيل الطالب"))
                        .catch((err: Error) => toast.error(err.message));
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
