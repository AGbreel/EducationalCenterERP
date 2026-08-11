import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Camera, CheckCircle2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { api, type Attendance, type StudentAttendanceLookup } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/attendance")({
  head: () => ({
    meta: [
      { title: "تسجيل الحضور | منصة السنتر" },
      {
        name: "description",
        content: "تسجيل حضور الطلاب بواسطة QR Code أو كود الطالب.",
      },
      { property: "og:title", content: "تسجيل الحضور" },
      {
        property: "og:description",
        content: "إدارة حضور الطلاب داخل الكلاسات.",
      },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  const db = useDb();
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [student, setStudent] = useState<StudentAttendanceLookup | null>(null);

  const [selectedClass, setSelectedClass] = useState("");

  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const loadAttendance = async () => {
    try {
      const rows = await api.getAttendance();
      setAttendance(rows);
    } catch {
      toast.error("تعذر تحميل سجل الحضور");
    }
  };

  useEffect(() => {
    void loadAttendance();
  }, []);

  const searchStudent = async () => {
    if (!search.trim()) return;

    setLoading(true);

    try {
      let result = await api.getStudentClassesByCode(search);

      if (!result) {
        result = await api.getStudentClassesByQr(search);
      }

      if (!result) {
        toast.error("لم يتم العثور على الطالب");
        setStudent(null);
        return;
      }

      setStudent(result);
      const firstClass = result.classes[0];
      if (firstClass) {
        setSelectedClass(firstClass.courseClassId);
      }
      toast.success(`تم العثور على ${result.studentName}`);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    if (!student) return;

    if (!selectedClass) {
      toast.error("اختر الكلاس أولاً");
      return;
    }

    try {
      await api.markAttendance(student.studentId, selectedClass);

      toast.success("تم تسجيل الحضور");

      await loadAttendance();

      setTimeout(() => {
        setStudent(null);
        setSearch("");
        setSelectedClass("");
      }, 1200);

      setSearch("");
      setStudent(null);
      setSelectedClass("");
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">تسجيل الحضور</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          ابحث بكود الطالب أو امسح QR ثم اختر الكلاس وسجل الحضور.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">إجمالي الحضور</p>
          <p className="mt-2 text-3xl font-bold">{attendance.length}</p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">طلاب اليوم</p>
          <p className="mt-2 text-3xl font-bold">
            {
              attendance.filter(
                (x) =>
                  new Date(x.attendanceDate).toDateString() ===
                  new Date().toDateString(),
              ).length
            }
          </p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">الكلاسات</p>
          <p className="mt-2 text-3xl font-bold">{db.courseClasses.length}</p>
        </div>

        <div className="surface-card rounded-xl p-5">
          <p className="text-sm text-muted-foreground">الطلاب</p>
          <p className="mt-2 text-3xl font-bold">{db.students.length}</p>
        </div>
      </div>

      <Card className="surface-card">
        <CardHeader>
          <CardTitle>البحث عن الطالب</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
          <div className="space-y-2">
            <Label>كود الطالب أو QR</Label>

            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ST-xxxxxxxx أو QR Value"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void searchStudent();
                }
              }}
            />
          </div>

          <div className="flex items-end">
            <Button
              className="w-full"
              onClick={() => void searchStudent()}
              disabled={loading}
            >
              <Search className="size-4" />
              {loading ? "جاري البحث..." : "بحث"}
            </Button>
          </div>

          <div className="flex items-end">
            <Button variant="outline" disabled>
              <Camera className="size-4" />
              QR Scanner
            </Button>
          </div>
        </CardContent>
      </Card>

      {student && (
        <Card className="surface-card">
          <CardHeader>
            <CardTitle>بيانات الطالب</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{student.studentName}</h2>

                <p className="mt-1 text-sm text-muted-foreground">كود الطالب</p>

                <Badge variant="secondary" className="mt-2 font-mono">
                  {student.studentCode}
                </Badge>
              </div>

              <Badge>{student.classes.length} كلاس</Badge>
            </div>

            <div className="space-y-3">
              <Label>اختر الكلاس</Label>

              <RadioGroup
                value={selectedClass}
                onValueChange={setSelectedClass}
                className="grid gap-3"
              >
                {student.classes.map((c) => (
                  <label
                    key={c.courseClassId}
                    htmlFor={c.courseClassId}
                    className="flex cursor-pointer items-center justify-between rounded-xl border p-4 transition hover:bg-muted/40"
                  >
                    <div>
                      <p className="font-bold">{c.className}</p>

                      <p className="text-sm text-muted-foreground">
                        {c.subject}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {c.teacher}
                      </p>
                    </div>

                    <RadioGroupItem
                      id={c.courseClassId}
                      value={c.courseClassId}
                    />
                  </label>
                ))}
              </RadioGroup>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => void markAttendance()}
            >
              <CheckCircle2 className="size-4" />
              تسجيل الحضور
            </Button>
          </CardContent>
        </Card>
      )}
      <Card className="surface-card">
        <CardHeader>
          <CardTitle>سجل الحضور</CardTitle>
        </CardHeader>

        <CardContent>
          {attendance.length === 0 ? (
            <div className="py-10 text-center text-muted-foreground">
              لا يوجد حضور مسجل.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-right">
                    <th className="p-3">الطالب</th>
                    <th className="p-3">الكلاس</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">الحالة</th>
                    <th className="p-3 w-20"></th>
                  </tr>
                </thead>

                <tbody>
                  {attendance.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b transition hover:bg-muted/40"
                    >
                      <td className="p-3 font-medium">
                        {db.students.find((x) => x.id === row.studentId)
                          ?.fullName ?? row.studentId}
                      </td>

                      <td className="p-3">
                        {db.courseClasses.find(
                          (x) => x.id === row.courseClassId,
                        )?.name ?? row.courseClassId}
                      </td>

                      <td className="p-3">
                        {new Date(row.attendanceDate).toLocaleString("ar-EG")}
                      </td>

                      <td className="p-3">
                        <Badge>{row.status}</Badge>
                      </td>

                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={async () => {
                            try {
                              await api.deleteAttendance(row.id);

                              toast.success("تم حذف الحضور");

                              await loadAttendance();
                            } catch (err) {
                              toast.error((err as Error).message);
                            }
                          }}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
