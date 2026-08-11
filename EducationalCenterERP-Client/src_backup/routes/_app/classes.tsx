import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/classes")({
  head: () => ({
    meta: [
      { title: "إدارة الكلاسات | منصة السنتر" },
      {
        name: "description",
        content:
          "إنشاء وإدارة الكلاسات وربطها بالمادة والمدرس وتحديد المواعيد والقاعة.",
      },
      {
        property: "og:title",
        content: "إدارة الكلاسات",
      },
      {
        property: "og:description",
        content: "إنشاء الكلاسات وتحديد المادة والمدرس ومواعيد الدراسة.",
      },
    ],
  }),
  component: ClassesPage,
});

function ClassesPage() {
  const db = useDb();

  const [form, setForm] = useState({
    name: "",
    subjectId: "",
    teacherId: "",
    day: "Saturday",
    startTime: "",
    endTime: "",
    hall: "",
    maxStudents: 20,
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await api.addClass(form);

      toast.success("تم إنشاء الكلاس");

      setForm({
        name: "",
        subjectId: "",
        teacherId: "",
        day: "Saturday",
        startTime: "",
        endTime: "",
        hall: "",
        maxStudents: 20,
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">إدارة الكلاسات</h1>

        <p className="text-muted-foreground">إنشاء وإدارة كلاس لكل مادة.</p>
      </header>

      <form
        onSubmit={submit}
        className="surface-card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-4"
      >
        <div className="space-y-2">
          <Label>اسم الكلاس</Label>

          <Input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>المادة</Label>

          <Select
            value={form.subjectId}
            onValueChange={(v) =>
              setForm({
                ...form,
                subjectId: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المادة" />
            </SelectTrigger>

            <SelectContent>
              {db.subjects.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>المدرس</Label>

          <Select
            value={form.teacherId}
            onValueChange={(v) =>
              setForm({
                ...form,
                teacherId: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="اختر المدرس" />
            </SelectTrigger>

            <SelectContent>
              {db.teachers.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>اليوم</Label>

          <Select
            value={form.day}
            onValueChange={(v) =>
              setForm({
                ...form,
                day: v,
              })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Saturday">السبت</SelectItem>
              <SelectItem value="Sunday">الأحد</SelectItem>
              <SelectItem value="Monday">الإثنين</SelectItem>
              <SelectItem value="Tuesday">الثلاثاء</SelectItem>
              <SelectItem value="Wednesday">الأربعاء</SelectItem>
              <SelectItem value="Thursday">الخميس</SelectItem>
              <SelectItem value="Friday">الجمعة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>بداية</Label>

          <Input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              setForm({
                ...form,
                startTime: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>نهاية</Label>

          <Input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              setForm({
                ...form,
                endTime: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>القاعة</Label>

          <Input
            value={form.hall}
            onChange={(e) =>
              setForm({
                ...form,
                hall: e.target.value,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label>الحد الأقصى</Label>

          <Input
            type="number"
            value={form.maxStudents}
            onChange={(e) =>
              setForm({
                ...form,
                maxStudents: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="md:col-span-2 xl:col-span-4">
          <Button className="w-full" type="submit">
            <Plus className="mr-2 h-4 w-4" />
            إنشاء الكلاس
          </Button>
        </div>
      </form>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {db.courseClasses.map((c) => (
          <div key={c.id} className="surface-card space-y-4 p-5">
            <div className="flex items-start justify-between">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-accent-gradient text-white">
                <BookOpen className="h-5 w-5" />
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  api
                    .removeClass(c.id)
                    .then(() => toast.success("تم حذف الكلاس"))
                    .catch((err: Error) => toast.error(err.message));
                }}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-bold">{c.name}</h2>

              <p className="text-sm text-muted-foreground">{c.subject}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge>{c.teacher}</Badge>

              <Badge variant="secondary">{c.day}</Badge>

              <Badge variant="outline">
                {c.startTime} - {c.endTime}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              القاعة : {c.hall}
            </div>

            <div className="flex justify-between text-sm">
              <span>الطلاب</span>

              <span>
                {c.currentStudents} / {c.maxStudents}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
