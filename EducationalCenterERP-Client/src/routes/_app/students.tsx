import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Plus, QrCode, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, type Student } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/students")({
  head: () => ({
    meta: [
      { title: "تسجيل الطلاب و QR Code | منصّة السنتر" },
      {
        fullName: "description",
        content: "سجّل طالب جديد، أنشئ له QR Code، وحدد المواد المشترك بها.",
      },
      { property: "og:title", content: "تسجيل الطلاب و QR Code" },
      {
        property: "og:description",
        content: "إدارة بيانات الطلاب وأكواد QR والاشتراك في المواد.",
      },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const db = useDb();
  const [form, setForm] = useState({ fullName: "", phone: "", grade: "" });
  const [qrStudent, setQrStudent] = useState<Student | null>(null);

  const [saving, setSaving] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim()) return;
    setSaving(true);
    try {
      const student = await api.addStudent({ ...form });
      setForm({ fullName: "", phone: "", grade: "" });
      setQrStudent(student);
      toast.success(`تم تسجيل ${student.fullName} وإنشاء كود ${student.code}`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const downloadQr = () => {
    const canvas =
      document.querySelector<HTMLCanvasElement>("#student-qr canvas");
    if (!canvas || !qrStudent) return;
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${qrStudent.code}.png`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">تسجيل الطلاب</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          كل طالب جديد يحصل تلقائيًا على كود QR خاص به للحضور والدفع.
        </p>
      </header>

      <form
        onSubmit={(e) => void submit(e)}
        className="surface-card grid gap-4 p-5 md:grid-cols-4"
      >
        <div className="space-y-2">
          <Label htmlFor="fullName">اسم الطالب</Label>
          <Input
            id="fullName"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            placeholder="مثال: أحمد كريم"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">الصف الدراسي</Label>
          <Input
            id="grade"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
            placeholder="الثالث الثانوي"
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" className="w-full" size="lg" disabled={saving}>
            <Plus className="size-4" />{" "}
            {saving ? "جاري الحفظ..." : "إضافة الطالب"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {db.students.map((student) => {
          const subjects = db.subjects;

          const studentEnrollments = db.enrollments.filter(
            (e) => e.studentId === student.id,
          );

          const enrolledIds = studentEnrollments.map((e) => e.courseClassId);

          return (
            <div key={student.id} className="surface-card space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold">{student.fullName}</p>

                  <p className="text-sm text-muted-foreground">
                    {student.grade || "بدون صف"} · {student.phone || "بدون رقم"}
                  </p>

                  <Badge variant="secondary" className="mt-2 font-mono">
                    {student.code}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setQrStudent(student)}
                  >
                    <QrCode className="size-4" />
                    عرض QR
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="حذف"
                    onClick={() => {
                      api
                        .removeStudent(student.id)
                        .then(() => toast.success("تم حذف الطالب"))
                        .catch((err: Error) => toast.error(err.message));
                    }}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold">المواد المشترك بها</p>

                <div className="flex flex-wrap gap-4">
                  {subjects.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      أضف مواد أولًا من صفحة المواد.
                    </p>
                  )}

                  {subjects.map((subject) => {
                    const enrollment = studentEnrollments.find(
                      (e) => e.courseClassId === subject.id,
                    );

                    return (
                      <label
                        key={subject.id}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={enrolledIds.includes(subject.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              void api.enroll(student.id, subject.id);
                            } else if (enrollment) {
                              void api.unenroll(enrollment.id);
                            }
                          }}
                        />

                        {subject.name}

                        <span className="text-muted-foreground">
                          ({subject.description})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={!!qrStudent} onOpenChange={(o) => !o && setQrStudent(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>كود QR للطالب</DialogTitle>
            <DialogDescription>
              {qrStudent?.fullName} — استخدم هذا الكود في صفحة السكان للحضور أو
              الدفع.
            </DialogDescription>
          </DialogHeader>
          <div
            id="student-qr"
            className="flex flex-col items-center gap-4 py-2"
          >
            {qrStudent && (
              <div className="rounded-xl bg-card p-4 shadow-card">
                <QRCodeCanvas
                  value={qrStudent.code}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>
            )}
            <Badge variant="secondary" className="font-mono">
              {qrStudent?.code}
            </Badge>
            <Button onClick={downloadQr} className="w-full">
              <Download className="size-4" /> تحميل الكود
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
