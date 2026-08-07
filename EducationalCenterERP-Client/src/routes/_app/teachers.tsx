import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { api, Teacher } from "@/lib/data";
import { useDb } from "@/lib/use-db";
import { Plus, GraduationCap, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/_app/teachers")({
  head: () => ({
    meta: [
      // { title: "المدرسون والمواد | منصّة السنتر" },
      { title: "المدرسون | منصّة السنتر" },
      {
        fullName: "description",
        // content: "إدارة المدرسين ومتابعة موادهم وطلابهم في السنتر.",
        content: "إدارة بيانات المدرسين داخل السنتر.",
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
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    salary: 0,
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.fullName.trim()) {
      toast.error("يرجى إدخال اسم المدرس");
      return;
    }

    setSaving(true);

    try {
      await api.addTeacher({
        ...form,
      });

      setForm({
        fullName: "",
        phone: "",
        email: "",
        salary: 0,
      });

      toast.success("تم إضافة المدرس بنجاح");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editForm, setEditForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    salary: 0,
  });

  const [updating, setUpdating] = useState(false);
  const openEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);

    setEditForm({
      fullName: teacher.fullName,
      phone: teacher.phone ?? "",
      email: teacher.email ?? "",
      salary: teacher.salary ?? 0,
    });
  };
  const updateTeacher = async () => {
    if (!editingTeacher) return;

    setUpdating(true);

    try {
      await api.updateTeacher(editingTeacher.id, {
        ...editForm,
      });

      toast.success("تم تعديل بيانات المدرس");

      setEditingTeacher(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUpdating(false);
    }
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
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5"
      >
        {/* الاسم */}
        <div className="space-y-2">
          <Label htmlFor="fullName">اسم المدرس</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="مثال: أحمد محمد"
            required
          />
        </div>

        {/* البريد الإلكتروني */}
        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="teacher@example.com"
          />
        </div>

        {/* الهاتف */}
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
          />
        </div>

        {/* الراتب */}
        <div className="space-y-2">
          <Label htmlFor="salary">الراتب الشهري</Label>
          <Input
            id="salary"
            type="number"
            min={0}
            step={100}
            value={form.salary}
            onChange={(e) =>
              setForm({
                ...form,
                salary: Number(e.target.value),
              })
            }
            placeholder="5000"
          />
        </div>

        {/* زر الإضافة */}
        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg" disabled={saving}>
            <Plus className="mr-2 h-4 w-4" />
            {saving ? "جارٍ الإضافة..." : "إضافة مدرس"}
          </Button>
        </div>
      </form>

      <div className="grid gap-4 lg:grid-cols-2">
        {db.teachers.map((teacher) => (
          <div
            key={teacher.id}
            className="surface-card rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {/* بيانات المدرس */}
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold">{teacher.fullName}</h3>

                    <Badge variant="secondary">مدرس</Badge>
                  </div>

                  <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                    <div>📞 {teacher.phone || "--"}</div>

                    <div>📧 {teacher.email || "--"}</div>

                    <div>💰 {teacher.salary?.toLocaleString()} ج.م</div>
                  </div>
                </div>
              </div>

              {/* الأزرار */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => openEditTeacher(teacher)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  تعديل
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>حذف المدرس</AlertDialogTitle>

                      <AlertDialogDescription>
                        هل تريد حذف
                        <strong> {teacher.fullName} </strong>
                        ؟
                        <br />
                        لا يمكن التراجع عن هذه العملية.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>إلغاء</AlertDialogCancel>

                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            await api.removeTeacher(teacher.id);
                            toast.success("تم حذف المدرس");
                          } catch (err) {
                            toast.error((err as Error).message);
                          }
                        }}
                      >
                        حذف
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog
        open={!!editingTeacher}
        onOpenChange={(open) => !open && setEditingTeacher(null)}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>تعديل بيانات المدرس</DialogTitle>
            <DialogDescription>
              قم بتعديل البيانات ثم اضغط حفظ.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>اسم المدرس</Label>

              <Input
                value={editForm.fullName}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    fullName: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>البريد الإلكتروني</Label>

              <Input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    email: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>رقم الهاتف</Label>

              <Input
                value={editForm.phone}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>الراتب</Label>

              <Input
                type="number"
                value={editForm.salary}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    salary: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingTeacher(null)}>
              إلغاء
            </Button>

            <Button onClick={() => void updateTeacher()} disabled={updating}>
              {updating ? "جارٍ الحفظ..." : "حفظ التعديلات"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
