import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/subjects")({
  head: () => ({
    // meta: [
    //   { title: "المواد الدراسية | منصّة السنتر" },
    //   { name: "description", content: "أضف المواد الدراسية وحدد سعر المصاريف والمدرس المسؤول." },
    //   { property: "og:title", content: "المواد الدراسية" },
    //   { property: "og:description", content: "إدارة المواد والأسعار وربطها بالمدرسين." },
    // ],
    meta: [
      { title: "المواد الدراسية | منصّة السنتر" },
      {
        name: "description",
        content: "إدارة المواد الدراسية داخل السنتر.",
      },
      { property: "og:title", content: "المواد الدراسية" },
      {
        property: "og:description",
        content: "إضافة وتعديل وحذف المواد الدراسية.",
      },
    ],
  }),
  component: SubjectsPage,
});

function SubjectsPage() {
  const db = useDb();
  const [form, setForm] = useState({ name: "", description: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("اكتب اسم المادة");
      return;
    }
    api
      .addSubject({ name: form.name, description: form.description })
      .then(() => {
        setForm({ name: "", description: "" });
        toast.success("تم إضافة المادة");
      })
      .catch((err: Error) => toast.error(err.message));
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">المواد الدراسية</h1>
        {/* <p className="mt-1 text-sm text-muted-foreground">
          حدد سعر المصاريف لكل مادة والمدرس المسؤول عنها.
        </p> */}
        <p className="mt-1 text-sm text-muted-foreground">
          إدارة المواد الدراسية وإضافة أو حذف المواد.
        </p>
      </header>

      <form
        onSubmit={submit}
        className="surface-card grid gap-4 p-5 md:grid-cols-3"
      >
        <div className="space-y-2">
          <Label htmlFor="sname">اسم المادة</Label>
          <Input
            id="sname"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="الرياضيات"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sdesc">وصف المادة</Label>
          <Input
            id="sdesc"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="الرياضيات"
            required
          />
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="sprice">المصاريف الشهرية</Label>
          <Input
            id="sprice"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="300"
          />
        </div>
        <div className="space-y-2">
          <Label>المدرس</Label>
          <Select
            value={form.teacherId}
            onValueChange={(teacherId) => setForm({ ...form, teacherId })}
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
        </div> */}
        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg">
            <Plus className="size-4" /> إضافة المادة
          </Button>
        </div>
      </form>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {db.subjects.map((s) => {
          const count = db.enrollments.filter((e) => e.courseClassId === s.id).length;
          return (
            <div key={s.id} className="surface-card space-y-3 p-5">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-accent-gradient text-accent-foreground">
                  <BookOpen className="size-5" />
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="حذف"
                  onClick={() => {
                    api
                      .removeSubject(s.id)
                      .then(() => toast.success("تم حذف المادة"))
                      .catch((err: Error) => toast.error(err.message));
                  }}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
              <div>
                <p className="text-lg font-bold">{s.name}</p>
                <p className="text-sm text-muted-foreground">
                  {s.description || "لا يوجد وصف"}
                </p>
              </div>
              {/* <div>
                <p className="text-lg font-bold">{s.name}</p>
                <p className="text-sm text-muted-foreground">{teacher?.fullName ?? "بدون مدرس"}</p>
              </div> */}
              <div className="flex items-center gap-2">
                {/* <Badge variant="secondary">{s.price} ج.م / شهر</Badge> */}
                <Badge>{count} طالب</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
