import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Users, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_app/enrollments")({
  head: () => ({
    meta: [
      {
        title: "تسجيل الطلاب داخل الكلاسات | منصة السنتر",
      },
      {
        name: "description",
        content: "تسجيل الطلاب داخل الكلاسات وإدارة الاشتراكات الشهرية.",
      },
      {
        property: "og:title",
        content: "Student Enrollments",
      },
    ],
  }),
  component: EnrollmentsPage,
});

function EnrollmentsPage() {
  const db = useDb();

  const [form, setForm] = useState({
    studentId: "",
    classId: "",
    monthlyFee: "",
  });

  const [saving, setSaving] = useState(false);

  const selectedStudent = useMemo(
    () => db.students.find((x) => x.id === form.studentId),
    [db.students, form.studentId],
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.studentId) {
      toast.error("اختر الطالب");
      return;
    }

    if (!form.classId) {
      toast.error("اختر الكلاس");
      return;
    }

    if (!form.monthlyFee) {
      toast.error("ادخل المصروف الشهري");
      return;
    }

    setSaving(true);

    try {
      await api.enrollStudent(form.studentId, form.classId, Number(form.monthlyFee));

      toast.success("تم تسجيل الطالب داخل الكلاس");

      setForm({
        studentId: "",
        classId: "",
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
          اختر الطالب ثم اختر الكلاس وحدد قيمة الاشتراك الشهري.
        </p>
      </header>

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-4"
      >
        <div className="space-y-2">
          <Label>الطالب</Label>

          <Select
            value={form.studentId}
            onValueChange={(v) =>
              setForm({
                ...form,
                studentId: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الطالب" />
            </SelectTrigger>

            <SelectContent>
              {db.students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>الكلاس</Label>

          <Select
            value={form.classId}
            onValueChange={(v) =>
              setForm({
                ...form,
                classId: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر الكلاس" />
            </SelectTrigger>

            <SelectContent>
              {db.courseClasses.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>المصروف الشهري</Label>

          <Input
            type="number"
            placeholder="500"
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
          <Button className="w-full" size="lg" disabled={saving} type="submit">
            <Plus className="size-4" />

            {saving ? "جاري التسجيل..." : "تسجيل الطالب"}
          </Button>
        </div>
      </form>
      <div className="space-y-4">
        {db.students.map((student) => {
          const enrollments = db.enrollments.filter(
            (e) => e.studentId === student.id,
          );

          return (
            <div key={student.id} className="surface-card space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{student.fullName}</p>

                  <p className="text-sm text-muted-foreground">
                    {student.grade || "بدون صف"}
                  </p>
                </div>

                <Badge>
                  <Users className="mr-1 size-4" />
                  {enrollments.length} كلاس
                </Badge>
              </div>

              {enrollments.length === 0 ? (
                <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
                  الطالب غير مسجل في أي كلاس.
                </div>
              ) : (
                <div className="space-y-3">
                  {enrollments.map((enrollment) => {
                    const courseClass = db.courseClasses.find(
                      (c) => c.id === enrollment.courseClassId,
                    );

                    return (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between rounded-xl border p-4"
                      >
                        <div className="space-y-1">
                          <p className="font-semibold">{courseClass?.name}</p>

                          <p className="text-sm text-muted-foreground">
                            {courseClass?.teacher}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <Badge variant="secondary">
                              {courseClass?.day}
                            </Badge>

                            <Badge variant="outline">
                              {courseClass?.startTime}
                              {" - "}
                              {courseClass?.endTime}
                            </Badge>

                            <Badge variant="outline">{courseClass?.hall}</Badge>

                            <Badge>{enrollment.monthlyFee} ج.م</Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            api
                              .unenroll(enrollment.id)
                              .then(() =>
                                toast.success("تم حذف الطالب من الكلاس"),
                              )
                              .catch((err: Error) => toast.error(err.message));
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
