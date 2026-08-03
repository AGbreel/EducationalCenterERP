import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/teachers")({
  head: () => ({
    meta: [
      // { title: "المدرسون والمواد | منصّة السنتر" },
      { title: "المدرسون | منصّة السنتر" },
      {
        fullName: "description",
        // content: "إدارة المدرسين ومتابعة موادهم وطلابهم في السنتر.",
        content: "إدارة بيانات المدرسين داخل السنتر."
      },
      { property: "og:title", content: "المدرسون والمواد" },
      {
        property: "og:description",
        // content: "سجّل المدرسين واعرف مواد وطلاب كل مدرس.",
        content: "إضافة وإدارة المدرسين داخل السنتر.",
      },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const db = useDb();
  const [form, setForm] = useState({ fullName: "", phone: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    api
      .addTeacher({ ...form })
      .then(() => {
        setForm({ fullName: "", phone: "" });
        toast.success("تم إضافة المدرس");
      })
      .catch((err: Error) => toast.error(err.message));
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">المدرسون</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          إدارة المدرسين وإضافة بياناتهم.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="surface-card grid gap-4 p-5 md:grid-cols-3"
      >
        <div className="space-y-2">
          <Label htmlFor="tname">اسم المدرس</Label>
          <Input
            id="tname"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="أ. محمد عبد الله"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tphone">رقم الهاتف</Label>
          <Input
            id="tphone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg">
            <Plus className="size-4" /> إضافة مدرس
          </Button>
        </div>
      </form>

      {/* <div className="grid gap-4 lg:grid-cols-2">
        {db.teachers.map((teacher) => {
          const subjects = db.subjects.filter((s) => s.teacherId === teacher.id);
          const subjectIds = subjects.map((s) => s.id);
          const students = db.students.filter((st) =>
            db.enrollments.some((e) => e.studentId === st.id && subjectIds.includes(e.subjectId)),
          );
          return (
            <div key={teacher.id} className="surface-card space-y-4 p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                    <UserRound className="size-5" />
                  </span>
                  <div>
                    <p className="font-bold">{teacher.fullName}</p>
                    <p className="text-sm text-muted-foreground">{teacher.phone || "بدون رقم"}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="حذف"
                  onClick={() => {
                    api
                      .removeTeacher(teacher.id)
                      .then(() => toast.success("تم حذف المدرس"))
                      .catch((err: Error) => toast.error(err.message));
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">المواد</p>
                <div className="flex flex-wrap gap-2">
                  {subjects.length ? (
                    subjects.map((s) => (
                      <Badge key={s.id} variant="secondary">
                        {s.name} · {s.description}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">لا مواد بعد</p>
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-bold">الطلاب ({students.length})</p>
                <div className="flex flex-wrap gap-2">
                  {students.length ? (
                    students.map((st) => (
                      <Badge key={st.id} className="font-normal">
                        {st.fullName}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">لا طلاب مشتركين بعد</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div> */}

      <div className="grid gap-4 lg:grid-cols-2">
        {db.teachers.map((teacher) => (
          <div key={teacher.id} className="surface-card space-y-4 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-xl bg-secondary text-secondary-foreground">
                  <UserRound className="size-5" />
                </span>

                <div>
                  <p className="font-bold">{teacher.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    {teacher.phone || "بدون رقم"}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="icon"
                aria-label="حذف"
                onClick={() => {
                  api
                    .removeTeacher(teacher.id)
                    .then(() => toast.success("تم حذف المدرس"))
                    .catch((err: Error) => toast.error(err.message));
                }}
              >
                <Trash2 className="size-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
