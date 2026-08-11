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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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
          studentClassId: e.id,
          courseClassId: e.courseClassId,
          monthlyFee: e.monthlyFee,
          courseClass: db.courseClasses.find((c) => c.id === e.courseClassId),
        }))
        .filter((x) => x.courseClass)
    : [];

  const [openPayment, setOpenPayment] = useState(false);

  const [selectedEnrollment, setSelectedEnrollment] = useState<{
    studentClassId: string;
    monthlyFee: number;
    courseClass: any;
  } | null>(null);

  const [paymentType, setPaymentType] = useState<"Monthly" | "Session">(
    "Monthly",
  );
  const [amount, setAmount] = useState("");
  const [sessions, setSessions] = useState(1);
  const [notes, setNotes] = useState("");
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthlyPaid =
    selectedEnrollment != null &&
    db.payments.some(
      (p) =>
        p.studentClassId === selectedEnrollment.studentClassId &&
        p.paymentType === "Monthly" &&
        p.month === currentMonth &&
        p.year === currentYear,
    );
  const studentPayments = student
    ? db.payments.filter((p) => p.studentId === student.id)
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

                <TabsContent value="attendance" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    اختر الكلاس لتسجيل الحضور.
                  </p>

                  {studentEnrollments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      الطالب غير مشترك في أي كلاس.
                    </p>
                  )}

                  {studentEnrollments.map(
                    ({ studentClassId, courseClassId, courseClass }) => (
                      <Button
                        key={studentClassId}
                        variant="outline"
                        className="h-auto w-full justify-between py-4"
                        onClick={async () => {
                          try {
                            await api.markAttendance(
                              student!.id,
                              courseClassId,
                            );

                            toast.success(
                              `تم تسجيل حضور ${student!.fullName} في ${courseClass!.name}`,
                            );
                          } catch (err) {
                            toast.error((err as Error).message);
                          }
                        }}
                      >
                        <div className="text-right">
                          <p className="font-semibold">{courseClass!.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {courseClass!.day} • {courseClass!.startTime} -{" "}
                            {courseClass!.endTime}
                          </p>
                        </div>

                        <Badge variant="secondary">
                          {
                            db.attendance.filter(
                              (a) =>
                                a.studentId === student!.id &&
                                a.courseClassId === courseClassId,
                            ).length
                          }{" "}
                          حضور
                        </Badge>
                      </Button>
                    ),
                  )}
                </TabsContent>

                <TabsContent value="payment" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    اختر الكلاس لتسجيل دفعة جديدة.
                  </p>

                  {studentEnrollments.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      الطالب غير مشترك في أي كلاس.
                    </p>
                  )}

                  {studentEnrollments.map(
                    ({ studentClassId, monthlyFee, courseClass }) => (
                      <Button
                        key={studentClassId}
                        variant="outline"
                        className="h-auto w-full justify-between py-4"
                        onClick={() => {
                          setSelectedEnrollment({
                            studentClassId,
                            monthlyFee,
                            courseClass,
                          });

                          setPaymentType("Monthly");
                          setAmount(monthlyFee.toString());
                          setSessions(1);
                          setNotes("");

                          setOpenPayment(true);
                        }}
                      >
                        <div className="text-right">
                          <p className="font-semibold">{courseClass!.name}</p>

                          <p className="text-xs text-muted-foreground">
                            {courseClass!.day} • {courseClass!.startTime}
                          </p>
                        </div>

                        <Badge>{monthlyFee} ج.م</Badge>
                      </Button>
                    ),
                  )}
                </TabsContent>
              </Tabs>

              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setStudent(null);
                  setSelectedEnrollment(null);
                }}
              >
                مسح طالب آخر
              </Button>
            </>
          )}
        </div>
      </div>
      <Dialog open={openPayment} onOpenChange={setOpenPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* الكلاس */}
            <div>
              <Label>الكلاس</Label>

              <Input
                value={selectedEnrollment?.courseClass?.name ?? ""}
                disabled
              />
            </div>

            {/* حالة الشهر */}
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">حالة اشتراك هذا الشهر</span>

                {monthlyPaid ? (
                  <Badge className="bg-green-600">مدفوع</Badge>
                ) : (
                  <Badge variant="destructive">غير مدفوع</Badge>
                )}
              </div>
            </div>

            {/* نوع الدفع */}
            <div>
              <Label>نوع الدفع</Label>

              <Select
                value={paymentType}
                onValueChange={(v) =>
                  setPaymentType(v as "Monthly" | "Session")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Monthly">اشتراك شهرى</SelectItem>

                  <SelectItem value="Session">بالحصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* عدد الحصص */}
            {paymentType === "Session" && (
              <div>
                <Label>عدد الحصص</Label>

                <Input
                  type="number"
                  value={sessions}
                  onChange={(e) => setSessions(Number(e.target.value))}
                />
              </div>
            )}

            {/* المبلغ */}
            <div>
              <Label>المبلغ</Label>

              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* الملاحظات */}
            <div>
              <Label>ملاحظات</Label>

              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            {/* آخر المدفوعات */}
            <div className="space-y-2">
              <Label>آخر المدفوعات</Label>

              {studentPayments
                .filter(
                  (p) =>
                    p.studentClassId === selectedEnrollment?.studentClassId,
                )
                .sort(
                  (a, b) =>
                    new Date(b.paymentDate).getTime() -
                    new Date(a.paymentDate).getTime(),
                )
                .slice(0, 5)
                .map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between rounded-lg border p-2"
                  >
                    <div>
                      <p className="font-medium">
                        {payment.paymentType === "Monthly"
                          ? "اشتراك شهرى"
                          : "بالحصة"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {payment.month}/{payment.year}
                      </p>
                    </div>

                    <Badge>{payment.amount} ج.م</Badge>
                  </div>
                ))}

              {studentPayments.filter(
                (p) => p.studentClassId === selectedEnrollment?.studentClassId,
              ).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  لا توجد مدفوعات حتى الآن.
                </p>
              )}
            </div>

            {/* زر التسجيل */}
            <Button
              className="w-full"
              disabled={paymentType === "Monthly" && monthlyPaid}
              onClick={async () => {
                if (!selectedEnrollment || !student) return;

                try {
                  const dto: Parameters<typeof api.addPayment>[0] = {
                    studentId: student.id,
                    studentClassId: selectedEnrollment.studentClassId,
                    amount: Number(amount),
                    month: currentMonth,
                    year: currentYear,
                    paymentType,
                    paymentMethod: "Cash",
                    notes,
                  };

                  if (paymentType === "Session") {
                    dto.sessionsCount = sessions;
                  }
                  await api.addPayment(dto);
                  toast.success("تم تسجيل الدفع");
                  setAmount(selectedEnrollment.monthlyFee.toString());
                  await db.refresh();
                  setAmount("");
                  setNotes("");
                  setSessions(1);
                  setSelectedEnrollment(null);
                  setOpenPayment(false);
                } catch (err) {
                  toast.error((err as Error).message);
                }
              }}
            >
              تسجيل الدفع
            </Button>
          </div>
          {selectedEnrollment &&
            (() => {
              return (
                <div className="rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">حالة اشتراك هذا الشهر</span>

                    {monthlyPaid ? (
                      <Badge className="bg-green-600">مدفوع</Badge>
                    ) : (
                      <Badge variant="destructive">غير مدفوع</Badge>
                    )}
                  </div>
                </div>
              );
            })()}
          <div className="space-y-2">
            <Label>آخر المدفوعات</Label>

            {studentPayments
              .filter(
                (p) => p.studentClassId === selectedEnrollment?.studentClassId,
              )
              .sort(
                (a, b) =>
                  new Date(b.paymentDate).getTime() -
                  new Date(a.paymentDate).getTime(),
              )
              .slice(0, 5)
              .map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between rounded-lg border p-2"
                >
                  <div>
                    <p className="font-medium">
                      {payment.paymentType === "Monthly"
                        ? "اشتراك شهرى"
                        : "بالحصة"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {payment.month}/{payment.year}
                    </p>
                  </div>

                  <Badge>{payment.amount} ج.م</Badge>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
