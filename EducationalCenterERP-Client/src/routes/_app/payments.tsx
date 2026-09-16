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

import {
  CreditCard,
  DollarSign,
  Wallet,
  Receipt,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
} from "lucide-react";

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

  // =========================
  // Filters
  // =========================

  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(currentMonth.toString());
  const [yearFilter, setYearFilter] = useState(currentYear.toString());

  // =========================
  // Pagination
  // =========================

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // =========================
  // Dialog
  // =========================

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

  // =========================
  // Statistics
  // =========================

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
  }, [db.payments, currentMonth, currentYear]);

  const sessionPayments = useMemo(() => {
    return db.payments.filter((payment) => payment.paymentType === "Session")
      .length;
  }, [db.payments]);

  const monthlyPayments = useMemo(() => {
    return db.payments.filter((payment) => payment.paymentType === "Monthly")
      .length;
  }, [db.payments]);

  // =========================
  // Student Classes
  // =========================
  //
  // مهم:
  // بنجيب الـ enrollment الخاص بالطالب
  // وبعدها بنجيب الـ CourseClass من db.courseClasses
  // علشان نعرض المادة والمجموعة بشكل صحيح.
  //

  const studentClasses = useMemo(() => {
    if (!paymentForm.studentId) return [];

    return db.enrollments
      .filter((enrollment) => enrollment.studentId === paymentForm.studentId)
      .map((enrollment) => {
        const courseClass = db.courseClasses.find(
          (cls) => cls.id === enrollment.courseClassId,
        );

        return {
          ...enrollment,
          className:
            enrollment.className || courseClass?.name || "مجموعة غير معروف",

          subjectName: courseClass?.subject || "مادة غير محددة",

          teacherName: courseClass?.teacher || "",
        };
      });
  }, [paymentForm.studentId, db.enrollments, db.courseClasses]);

  // =========================
  // Filter Payments
  // =========================

  const filteredPayments = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return db.payments.filter((payment) => {
      const studentName = payment.studentName?.toLowerCase() || "";

      const subjectName = payment.subjectName?.toLowerCase() || "";

      const className = payment.className?.toLowerCase() || "";

      // Search
      if (
        searchValue &&
        !studentName.includes(searchValue) &&
        !subjectName.includes(searchValue) &&
        !className.includes(searchValue)
      ) {
        return false;
      }

      // Student
      if (studentFilter !== "all" && payment.studentId !== studentFilter) {
        return false;
      }

      // Class
      if (classFilter !== "all" && payment.courseClassId !== classFilter) {
        return false;
      }

      // Payment Type
      if (
        paymentTypeFilter !== "all" &&
        payment.paymentType !== paymentTypeFilter
      ) {
        return false;
      }

      // Month
      if (payment.month.toString() !== monthFilter) {
        return false;
      }

      // Year
      if (payment.year.toString() !== yearFilter) {
        return false;
      }

      return true;
    });
  }, [
    db.payments,
    search,
    studentFilter,
    classFilter,
    paymentTypeFilter,
    monthFilter,
    yearFilter,
  ]);

  // =========================
  // Filtered Statistics
  // =========================

  const filteredIncome = useMemo(() => {
    return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
  }, [filteredPayments]);

  const monthlyCount = useMemo(() => {
    return filteredPayments.filter(
      (payment) => payment.paymentType === "Monthly",
    ).length;
  }, [filteredPayments]);

  const sessionCount = useMemo(() => {
    return filteredPayments.filter(
      (payment) => payment.paymentType === "Session",
    ).length;
  }, [filteredPayments]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPayments = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;

    return filteredPayments.slice(startIndex, startIndex + pageSize);
  }, [filteredPayments, safeCurrentPage, pageSize]);

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  // =========================
  // Helpers
  // =========================

  const resetPage = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setStudentFilter("all");
    setClassFilter("all");
    setPaymentTypeFilter("all");
    setMonthFilter(currentMonth.toString());
    setYearFilter(currentYear.toString());
    setCurrentPage(1);
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      studentId: "",
      studentClassId: "",
      paymentType: "Monthly",
      amount: "",
      month: currentMonth,
      year: currentYear,
      sessionsCount: 1,
      paymentMethod: "Cash",
      notes: "",
    });
  };

  const openPaymentDialog = () => {
    resetPaymentForm();
    setOpen(true);
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">إدارة المدفوعات</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تسجيل ومتابعة جميع مدفوعات الطلاب داخل السنتر.
          </p>
        </div>

        {/* تم تشغيل الزر */}
        <Button size="lg" onClick={openPaymentDialog}>
          <Plus className="size-4" />
          إضافة دفعة
        </Button>
      </header>

      {/* ================= MAIN STATISTICS ================= */}

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

      {/* ================= FILTERS ================= */}

      <div className="surface-card p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">البحث والفلترة</h2>

            <p className="text-sm text-muted-foreground">
              اعرض المدفوعات حسب الطالب أو المادة أو المجموعة أو نوع الدفع.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="size-4" />
            مسح الفلاتر
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {/* Search */}

          <div className="space-y-2 xl:col-span-2">
            <Label>بحث</Label>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                className="pr-9"
                placeholder="اسم الطالب أو المادة أو المجموعة..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
              />
            </div>
          </div>

          {/* Student */}

          <div className="space-y-2">
            <Label>الطالب</Label>

            <Select
              value={studentFilter}
              onValueChange={(value) => {
                setStudentFilter(value);
                resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر الطالب" />
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

          {/* Class */}

          <div className="space-y-2">
            <Label>المجموعة</Label>

            <Select
              value={classFilter}
              onValueChange={(value) => {
                setClassFilter(value);
                resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="اختر المجموعة" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">جميع المجموعات</SelectItem>

                {db.courseClasses.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Type */}

          <div className="space-y-2">
            <Label>نوع الدفع</Label>

            <Select
              value={paymentTypeFilter}
              onValueChange={(value) => {
                setPaymentTypeFilter(value);
                resetPage();
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>

                <SelectItem value="Monthly">اشتراك شهري</SelectItem>

                <SelectItem value="Session">بالحصة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Month */}

          <div className="space-y-2">
            <Label>الشهر</Label>

            <Select
              value={monthFilter}
              onValueChange={(value) => {
                setMonthFilter(value);
                resetPage();
              }}
            >
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

          {/* Year */}

          <div className="space-y-2">
            <Label>السنة</Label>

            <Input
              type="number"
              value={yearFilter}
              onChange={(e) => {
                setYearFilter(e.target.value);
                resetPage();
              }}
            />
          </div>
        </div>
      </div>

      {/* ================= FILTERED STATISTICS ================= */}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            إجمالي المبلغ حسب الفلترة
          </p>

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

      {/* ================= PAYMENTS TABLE ================= */}

      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="text-lg font-bold">سجل المدفوعات</h2>

            <p className="text-sm text-muted-foreground">
              جميع عمليات الدفع التي تمت.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{filteredPayments.length} عملية</Badge>

            <Button onClick={openPaymentDialog}>
              <Plus className="size-4" />
              تسجيل دفعة
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>الطالب</TableHead>
                <TableHead>المادة</TableHead>
                <TableHead>المجموعة</TableHead>
                <TableHead>النوع</TableHead>
                <TableHead>الشهر</TableHead>
                <TableHead>المبلغ</TableHead>
                <TableHead>الطريقة</TableHead>
                <TableHead>التاريخ</TableHead>
                <TableHead className="text-center">حذف</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedPayments.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    className="py-12 text-center text-muted-foreground"
                  >
                    لا توجد عمليات دفع مطابقة للفلاتر.
                  </TableCell>
                </TableRow>
              )}

              {paginatedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">
                    {payment.studentName}
                  </TableCell>

                  <TableCell>{payment.subjectName || "-"}</TableCell>

                  <TableCell>{payment.className || "-"}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        payment.paymentType === "Monthly"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {payment.paymentType === "Monthly" ? "شهري" : "بالحصة"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {months[payment.month - 1]} {payment.year}
                  </TableCell>

                  <TableCell>
                    {payment.amount.toLocaleString("ar-EG")} ج.م
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
                                .catch((err: Error) =>
                                  toast.error(err.message),
                                );
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
        </div>

        {/* ================= PAGINATION ================= */}

        {filteredPayments.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                عدد العمليات في الصفحة:
              </span>

              <Select
                value={pageSize.toString()}
                onValueChange={(value) => {
                  setPageSize(Number(value));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-22.5">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                disabled={safeCurrentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              >
                <ChevronRight className="size-4" />
              </Button>

              {pageNumbers.map((page) => (
                <Button
                  key={page}
                  variant={page === safeCurrentPage ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="icon"
                disabled={safeCurrentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
              >
                <ChevronLeft className="size-4" />
              </Button>
            </div>
          </div>
        )}

        {/* ================= ADD PAYMENT DIALOG ================= */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل دفعة جديدة</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Student */}

              <div className="space-y-2">
                <Label>الطالب</Label>

                <Select
                  value={paymentForm.studentId}
                  onValueChange={(value) => {
                    setPaymentForm((prev) => ({
                      ...prev,
                      studentId: value,
                      studentClassId: "",
                    }));
                  }}
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

              {/* Class / Subject */}

              <div className="space-y-2">
                <Label>المادة / المجموعة</Label>

                <Select
                  value={paymentForm.studentClassId}
                  onValueChange={(value) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      studentClassId: value,
                    }))
                  }
                  disabled={
                    !paymentForm.studentId || studentClasses.length === 0
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        !paymentForm.studentId
                          ? "اختر الطالب أولاً"
                          : studentClasses.length === 0
                            ? "الطالب غير مسجل في أي مجموعة"
                            : "اختر المادة"
                      }
                    />
                  </SelectTrigger>

                  <SelectContent>
                    {studentClasses.map((enrollment) => (
                      <SelectItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.subjectName} - {enrollment.className}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {paymentForm.studentId && studentClasses.length === 0 && (
                  <p className="text-xs text-destructive">
                    الطالب غير مسجل في أي مجموعة.
                  </p>
                )}
              </div>

              {/* Payment Type */}

              <div className="space-y-2">
                <Label>نوع الدفع</Label>

                <Select
                  value={paymentForm.paymentType}
                  onValueChange={(value) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      paymentType: value as "Monthly" | "Session",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Monthly">اشتراك شهري</SelectItem>

                    <SelectItem value="Session">بالحصة</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}

              <div className="space-y-2">
                <Label>المبلغ</Label>

                <Input
                  type="number"
                  min="0"
                  value={paymentForm.amount}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Sessions Count */}

              {paymentForm.paymentType === "Session" && (
                <div className="space-y-2">
                  <Label>عدد الحصص</Label>

                  <Input
                    type="number"
                    min="1"
                    value={paymentForm.sessionsCount}
                    onChange={(e) =>
                      setPaymentForm((prev) => ({
                        ...prev,
                        sessionsCount: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              )}

              {/* Month */}

              <div className="space-y-2">
                <Label>الشهر</Label>

                <Select
                  value={paymentForm.month.toString()}
                  onValueChange={(value) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      month: Number(value),
                    }))
                  }
                >
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

              {/* Year */}

              <div className="space-y-2">
                <Label>السنة</Label>

                <Input
                  type="number"
                  value={paymentForm.year}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      year: Number(e.target.value),
                    }))
                  }
                />
              </div>

              {/* Payment Method */}

              <div className="space-y-2">
                <Label>طريقة الدفع</Label>

                <Select
                  value={paymentForm.paymentMethod}
                  onValueChange={(value) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      paymentMethod: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="Cash">نقدي</SelectItem>

                    <SelectItem value="Visa">فيزا</SelectItem>

                    <SelectItem value="InstaPay">InstaPay</SelectItem>

                    <SelectItem value="VodafoneCash">Vodafone Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}

              <div className="space-y-2 md:col-span-2">
                <Label>ملاحظات</Label>

                <Input
                  value={paymentForm.notes}
                  onChange={(e) =>
                    setPaymentForm((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  placeholder="ملاحظات اختيارية..."
                />
              </div>

              {/* Footer */}

              <DialogFooter className="md:col-span-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>

                <Button
                  disabled={
                    !paymentForm.studentId ||
                    !paymentForm.studentClassId ||
                    !paymentForm.amount ||
                    Number(paymentForm.amount) <= 0
                  }
                  onClick={async () => {
                    try {
                      const dto: Parameters<typeof api.addPayment>[0] = {
                        studentId: paymentForm.studentId,

                        studentClassId: paymentForm.studentClassId,

                        amount: Number(paymentForm.amount),

                        month: paymentForm.month,

                        year: paymentForm.year,

                        paymentType: paymentForm.paymentType,

                        paymentMethod: paymentForm.paymentMethod,

                        notes: paymentForm.notes,
                      };

                      if (paymentForm.paymentType === "Session") {
                        dto.sessionsCount = paymentForm.sessionsCount;
                      }

                      await api.addPayment(dto);

                      toast.success("تم تسجيل الدفع بنجاح");

                      resetPaymentForm();
                      setOpen(false);
                    } catch (err) {
                      toast.error((err as Error).message);
                    }
                  }}
                >
                  حفظ الدفع
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
