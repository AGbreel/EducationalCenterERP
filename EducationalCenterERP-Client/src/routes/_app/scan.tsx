import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  CalendarCheck,
  CameraOff,
  CreditCard,
  ScanLine,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api, type Student } from "@/lib/data";
import { useDb } from "@/lib/use-db";

export const Route = createFileRoute("/_app/scan")({
  head: () => ({
    meta: [
      { title: "سكان QR للحضور والمصاريف | منصّة السنتر" },
      {
        name: "description",
        content:
          "امسح كود الطالب ثم اختر المادة لتسجيل الحضور أو تسجيل دفعة الرسوم الخاصة بها.",
      },
      { property: "og:title", content: "سكان QR للحضور والمصاريف" },
      {
        property: "og:description",
        content: "مسح سريع لكود الطالب لتسجيل الحضور أو الدفع.",
      },
    ],
  }),
  component: ScanPage,
});

function ScanPage() {
  const db = useDb();
  const [student, setStudent] = useState<Student | null>(null);
  const [manual, setManual] = useState("");
  const [scanning, setScanning] = useState(false);
  const [camError, setCamError] = useState<string | null>(null);
  const scannerRef = useRef<{
    stop: () => Promise<void>;
    clear: () => void;
  } | null>(null);

  const resolve = async (text: string) => {
    let student = await api.findByQrValue(text);

    if (!student) student = await api.findByStudentCode(text);

    if (!student) student = await api.findByStudentID(text);

    if (student) {
      setStudent(student);
      toast.success(`تم التعرف على ${student.fullName}`);
    } else {
      toast.error("لا يوجد طالب بهذا الكود");
    }
  };

  useEffect(() => {
    if (!scanning) return;
    let active = true;
    (async () => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner as unknown as {
          stop: () => Promise<void>;
          clear: () => void;
        };
        await scanner.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: { width: 240, height: 240 } },
          (decoded) => {
            if (!active) return;
            active = false;
            void resolve(decoded);
            setScanning(false);
          },
          () => {},
        );
      } catch {
        setCamError("لا يمكن الوصول إلى الكاميرا — استخدم إدخال الكود يدويًا.");
        setScanning(false);
      }
    })();
    return () => {
      active = false;
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s)
        s.stop()
          .then(() => s.clear())
          .catch(() => {});
    };
  }, [scanning]);

  const studentEnrollments = student
    ? db.enrollments
        .filter((e) => e.studentId === student.id)
        .map((e) => ({
          enrollmentId: e.id,
          courseClassId: e.courseClassId,
          monthlyFee: e.monthlyFee,
          subject: db.subjects.find((s) => s.id === e.courseClassId),
        }))
        .filter((x) => x.subject)
    : [];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">سكان QR Code</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          امسح كود الطالب ثم اختر: تسجيل حضور في مادة، أو دفع مصاريف مادة واحدة
          أو كل المواد.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card space-y-4 p-5">
          <h2 className="text-lg font-bold">المسح</h2>
          <div
            id="qr-reader"
            className="grid min-h-64 place-items-center overflow-hidden rounded-xl bg-muted [&_video]:w-full"
          >
            {!scanning && (
              <div className="p-6 text-center text-sm text-muted-foreground">
                {camError ? (
                  <span className="flex flex-col items-center gap-2">
                    <CameraOff className="size-6" /> {camError}
                  </span>
                ) : (
                  "اضغط بدء المسح لتشغيل الكاميرا"
                )}
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1"
              size="lg"
              onClick={() => setScanning((v) => !v)}
            >
              <ScanLine className="size-4" />{" "}
              {scanning ? "إيقاف المسح" : "بدء المسح"}
            </Button>
          </div>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void resolve(manual);
              setManual("");
            }}
          >
            <Input
              value={manual}
              onChange={(e) => setManual(e.target.value)}
              placeholder="أو أدخل كود الطالب يدويًا: STD-1001"
              className="font-mono"
            />
            <Button type="submit" variant="outline" aria-label="بحث">
              <Search className="size-4" />
            </Button>
          </form>
        </div>

        <div className="surface-card space-y-5 p-5">
          {!student ? (
            <div className="grid h-full min-h-64 place-items-center text-center text-sm text-muted-foreground">
              لم يتم مسح أي كود بعد — بيانات الطالب والخيارات ستظهر هنا.
            </div>
          ) : (
            <>
              <div>
                <p className="text-xl font-bold">{student.fullName}</p>
                <p className="text-sm text-muted-foreground">
                  {student.grade || "بدون صف"} · {student.phone || "بدون رقم"}
                </p>
                <Badge variant="secondary" className="mt-2 font-mono">
                  {student.code}
                </Badge>
              </div>

              <Tabs defaultValue="attendance">
                <TabsList className="w-full">
                  <TabsTrigger value="attendance" className="flex-1">
                    <CalendarCheck className="size-4" /> تسجيل حضور
                  </TabsTrigger>
                  <TabsTrigger value="payment" className="flex-1">
                    <CreditCard className="size-4" /> دفع مصاريف
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="attendance" className="space-y-2 pt-4">
                  <p className="text-sm text-muted-foreground">
                    اختر المادة لتسجيل الحضور:
                  </p>

                  {studentEnrollments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      الطالب غير مشترك في أي مادة.
                    </p>
                  )}

                  {studentEnrollments.map(({ courseClassId, subject }) => (
                    <Button
                      key={courseClassId}
                      variant="outline"
                      className="w-full justify-between"
                      onClick={() => {
                        api
                          .markAttendance(student!.id, courseClassId)
                          .then(() =>
                            toast.success(
                              `تم تسجيل حضور ${student!.fullName} في ${subject!.name}`,
                            ),
                          )
                          .catch((err: Error) => toast.error(err.message));
                      }}
                    >
                      <span>{subject!.name}</span>

                      <span className="text-muted-foreground">
                        {
                          db.attendance.filter(
                            (a) =>
                              a.studentId === student!.id &&
                              a.courseClassId === courseClassId,
                          ).length
                        }{" "}
                        حضور
                      </span>
                    </Button>
                  ))}
                </TabsContent>

                <TabsContent value="payment" className="space-y-2 pt-4">
                  <p className="text-sm text-muted-foreground">
                    اختر المادة التي سيتم دفع رسومها.
                  </p>

                  {studentEnrollments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      الطالب غير مشترك في أي مادة.
                    </p>
                  )}

                  {studentEnrollments.map(
                    ({ enrollmentId, monthlyFee, subject }) => (
                      <Button
                        key={enrollmentId}
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => {
                          const amount = Number(
                            prompt(
                              `قيمة الرسوم الافتراضية ${monthlyFee}\nأدخل المبلغ المطلوب`,
                              monthlyFee.toString(),
                            ),
                          );

                          if (!amount || amount <= 0) return;

                          api
                            .addPayment(
                              student!.id,
                              enrollmentId,
                              amount,
                              "Cash",
                              "",
                            )
                            .then(() =>
                              toast.success(`تم تسجيل دفعة ${subject!.name}`),
                            )
                            .catch((err: Error) => toast.error(err.message));
                        }}
                      >
                        <span>{subject!.name}</span>

                        <span className="text-muted-foreground">
                          {monthlyFee} ج.م
                        </span>
                      </Button>
                    ),
                  )}
                </TabsContent>
              </Tabs>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setStudent(null)}
              >
                مسح طالب آخر
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
