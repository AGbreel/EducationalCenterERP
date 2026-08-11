import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, DollarSign, Wallet, Receipt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Trash2 } from "lucide-react";
import { useDb } from "@/lib/use-db";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { api } from "@/lib/data";

export const Route = createFileRoute("/_app/payments")({
  head: () => ({
    meta: [
      {
        title: "إدارة المدفوعات | منصة السنتر",
      },
      {
        name: "description",
        content: "تسجيل وإدارة جميع مدفوعات الطلاب داخل السنتر.",
      },
    ],
  }),
  component: PaymentsPage,
});
function PaymentsPage() {
  const db = useDb();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const totalIncome = useMemo(() => {
    return db.payments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [db.payments]);

  const monthIncome = useMemo(() => {
    return db.payments
      .filter(
        (payment) =>
          payment.month === currentMonth && payment.year === currentYear,
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [db.payments]);

  const sessionPayments = useMemo(() => {
    return db.payments.filter((payment) => payment.paymentType === "Session")
      .length;
  }, [db.payments]);

  const monthlyPayments = useMemo(() => {
    return db.payments.filter((payment) => payment.paymentType === "Monthly")
      .length;
  }, [db.payments]);
  const [studentFilter, setStudentFilter] = useState("all");

  const [classFilter, setClassFilter] = useState("all");

  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");

  const [monthFilter, setMonthFilter] = useState(currentMonth.toString());

  const [yearFilter, setYearFilter] = useState(currentYear.toString());
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const filteredPayments = useMemo(() => {
    return db.payments.filter((payment) => {
      if (studentFilter !== "all" && payment.studentId !== studentFilter)
        return false;

      if (classFilter !== "all" && payment.courseClassId !== classFilter)
        return false;

      if (
        paymentTypeFilter !== "all" &&
        payment.paymentType !== paymentTypeFilter
      )
        return false;

      if (payment.month.toString() !== monthFilter) return false;

      if (payment.year.toString() !== yearFilter) return false;

      return true;
    });
  }, [
    db.payments,
    studentFilter,
    classFilter,
    paymentTypeFilter,
    monthFilter,
    yearFilter,
  ]);
  const filteredIncome = filteredPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  const monthlyCount = filteredPayments.filter(
    (x) => x.paymentType === "Monthly",
  ).length;

  const sessionCount = filteredPayments.filter(
    (x) => x.paymentType === "Session",
  ).length;
  const [open, setOpen] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    studentId: "",
    studentClassId: "",
    paymentType: "Monthly" as "Monthly" | "Session",
    amount: "",
    month: currentMonth,
    year: currentYear,
    sessionsCount: 1,
    paymentMethod: "Cash",
    notes: "",
  });
  const studentClasses = useMemo(() => {
    if (!paymentForm.studentId) return [];

    return db.enrollments.filter((x) => x.studentId === paymentForm.studentId);
  }, [paymentForm.studentId, db.enrollments]);

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">إدارة المدفوعات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تسجيل ومتابعة جميع مدفوعات الطلاب داخل السنتر.
          </p>
        </div>

        <Button size="lg">
          <Plus className="size-4" />
          إضافة دفعة
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>

              <p className="mt-2 text-3xl font-bold">
                {totalIncome.toLocaleString("ar-EG")} ج.م
              </p>
            </div>

            <DollarSign className="size-9 text-primary" />
          </div>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">إيرادات هذا الشهر</p>

              <p className="mt-2 text-3xl font-bold">
                {monthIncome.toLocaleString("ar-EG")} ج.م
              </p>
            </div>

            <Wallet className="size-9 text-primary" />
          </div>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                الاشتراكات الشهرية
              </p>

              <p className="mt-2 text-3xl font-bold">{monthlyPayments}</p>
            </div>

            <CreditCard className="size-9 text-primary" />
          </div>
        </div>
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">مدفوعات الحصص</p>

              <p className="mt-2 text-3xl font-bold">{sessionPayments}</p>
            </div>

            <Receipt className="size-9 text-primary" />
          </div>
        </div>
      </div>
      <div className="surface-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold">البحث والفلترة</h2>

          <p className="text-sm text-muted-foreground">
            اعرض المدفوعات حسب الطالب أو الكلاس أو نوع الدفع.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-2">
            <Label>الطالب</Label>

            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">جميع الطلاب</SelectItem>

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

            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">جميع الكلاسات</SelectItem>

                {db.courseClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>نوع الدفع</Label>

            <Select
              value={paymentTypeFilter}
              onValueChange={setPaymentTypeFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>

                <SelectItem value="Monthly">اشتراك شهرى</SelectItem>

                <SelectItem value="Session">بالحصة</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>الشهر</Label>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>السنة</Label>

            <Input
              type="number"
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">إجمالي المبلغ</p>

          <h2 className="mt-2 text-3xl font-bold">
            {filteredIncome.toLocaleString("ar-EG")} ج.م
          </h2>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            عدد الاشتراكات الشهرية
          </p>

          <h2 className="mt-2 text-3xl font-bold">{monthlyCount}</h2>
        </div>
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">عدد دفعات الحصص</p>

          <h2 className="mt-2 text-3xl font-bold">{sessionCount}</h2>
        </div>
      </div>
      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <Button onClick={() => setOpen(true)}>
            <Plus className="size-4" />
            تسجيل دفعة
          </Button>
          <div>
            <h2 className="text-lg font-bold">سجل المدفوعات</h2>

            <p className="text-sm text-muted-foreground">
              جميع عمليات الدفع التى تمت.
            </p>
          </div>

          <Badge variant="secondary">{filteredPayments.length} عملية</Badge>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الطالب</TableHead>

              <TableHead>المادة</TableHead>

              <TableHead>الكلاس</TableHead>

              <TableHead>النوع</TableHead>

              <TableHead>الشهر</TableHead>

              <TableHead>المبلغ</TableHead>

              <TableHead>الطريقة</TableHead>

              <TableHead>التاريخ</TableHead>

              <TableHead className="text-center">حذف</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="py-12 text-center text-muted-foreground"
                >
                  لا توجد عمليات دفع.
                </TableCell>
              </TableRow>
            )}
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="font-medium">
                  {payment.studentName}
                </TableCell>
                <TableCell>{payment.subjectName}</TableCell>
                <TableCell>{payment.className}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      payment.paymentType === "Monthly"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {payment.paymentType === "Monthly" ? "شهرى" : "بالحصة"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {months[payment.month - 1]}

                  {payment.year}
                </TableCell>
                <TableCell>
                  {payment.amount.toLocaleString("ar-EG")}
                  ج.م
                </TableCell>
                <TableCell>{payment.paymentMethod}</TableCell>
                <TableCell>
                  {new Date(payment.paymentDate).toLocaleDateString("ar-EG")}
                </TableCell>
                <TableCell className="text-center">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>حذف عملية الدفع؟</AlertDialogTitle>

                        <AlertDialogDescription>
                          لن تستطيع استرجاع هذه العملية بعد حذفها.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>

                        <AlertDialogAction
                          onClick={() => {
                            api
                              .removePayment(payment.id)
                              .then(() => toast.success("تم حذف العملية"))
                              .catch((err: Error) => toast.error(err.message));
                          }}
                        >
                          حذف
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>الطالب</Label>

                <Select
                  value={paymentForm.studentId}
                  onValueChange={(v) =>
                    setPaymentForm({
                      ...paymentForm,
                      studentId: v,
                      studentClassId: "",
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
                <Label>المادة</Label>

                <Select
                  value={paymentForm.studentClassId}
                  onValueChange={(v) =>
                    setPaymentForm({
                      ...paymentForm,
                      studentClassId: v,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر المادة" />
                  </SelectTrigger>

                  <SelectContent>
                    {studentClasses.map((enrollment) => (
                      <SelectItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>نوع الدفع</Label>

                <Select
                  value={paymentForm.paymentType}
                  onValueChange={(v) =>
                    setPaymentForm({
                      ...paymentForm,
                      paymentType: v as any,
                    })
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
              <div className="space-y-2">
                <Label>المبلغ</Label>

                <Input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      amount: e.target.value,
                    })
                  }
                />
              </div>
              {paymentForm.paymentType === "Session" && (
                <div className="space-y-2">
                  <Label>عدد الحصص</Label>

                  <Input
                    type="number"
                    value={paymentForm.sessionsCount}
                    onChange={(e) =>
                      setPaymentForm({
                        ...paymentForm,
                        sessionsCount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label>الشهر</Label>

                <Select
                  value={paymentForm.month.toString()}
                  onValueChange={(v) =>
                    setPaymentForm({
                      ...paymentForm,
                      month: Number(v),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {months.map((m, index) => (
                      <SelectItem key={index} value={(index + 1).toString()}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>السنة</Label>

                <Input
                  type="number"
                  value={paymentForm.year}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      year: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>ملاحظات</Label>

                <Input
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm({
                      ...paymentForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  إلغاء
                </Button>

                <Button
                  onClick={async () => {
                    try {
                      const dto: Parameters<typeof api.addPayment>[0] = {
                        studentId: paymentForm.studentId,
                        studentClassId: paymentForm.studentClassId,
                        amount: Number(paymentForm.amount),
                        month: paymentForm.month,
                        year: paymentForm.year,
                        paymentType: paymentForm.paymentType,
                        paymentMethod: "Cash",
                        notes: paymentForm.notes,
                      };

                      if (paymentForm.paymentType === "Session") {
                        dto.sessionsCount = paymentForm.sessionsCount;
                      }
                      await api.addPayment(dto);
                      toast.success("تم تسجيل الدفع");

                      setOpen(false);
                    } catch (err) {
                      toast.error((err as Error).message);
                    }
                  }}
                >
                  حفظ
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
