import { api, type OtherIncome } from "@/lib/data";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

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
  DollarSign,
  Wallet,
  Receipt,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
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

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { toast } from "sonner";

export const Route = createFileRoute("/_app/OtherIncomes")({
  head: () => ({
    meta: [
      {
        title: "الإيرادات الأخرى | منصة السنتر",
      },
      {
        name: "description",
        content: "تسجيل وإدارة الإيرادات الأخرى داخل السنتر.",
      },
    ],
  }),
  component: OtherIncomes,
});

const incomeCategories = [
  "استضافة",
  "تبرع",
  "إيجار قاعة",
  "بيع ملازم",
  "كورس إضافي",
  "خدمات",
  "شراكة",
  "أخرى",
];

const PAGE_SIZE = 10;

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 border-t p-4">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronRight className="size-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>
    </div>
  );
}

function OtherIncomes() {
  const [incomes, setIncomes] = useState<OtherIncome[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [payerFilter, setPayerFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);

  const [incomeForm, setIncomeForm] = useState({
    payerName: "",
    reason: "",
    category: "أخرى",
    amount: "",
    paymentDate: currentDate.toISOString().split("T")[0],
    eventDate: "",
    notes: "",
  });

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
  // Load incomes
  // =========================

  const loadOtherIncomes = async () => {
    try {
      setLoading(true);
      const result = await api.getOtherIncomes();
      setIncomes(result);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "حدث خطأ أثناء تحميل المصروفات",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOtherIncomes();
  }, []);

  // =========================
  // Helpers
  // =========================

  const getincomeMonth = (date: string) => {
    return new Date(date).getMonth() + 1;
  };

  const getincomeYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  // =========================
  // Payers
  // =========================

  const payers = useMemo(() => {
    const names = incomes.map((income) => income.payerName).filter(Boolean);

    return Array.from(new Set(names));
  }, [incomes]);

  // =========================
  // Filtered incomes
  // =========================

  const filteredincomes = useMemo(() => {
    return [...incomes]
      .sort(
        (a, b) =>
          new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime(),
      )
      .filter((income) => {
        if (categoryFilter !== "all" && income.category !== categoryFilter) {
          return false;
        }

        if (payerFilter !== "all" && income.payerName !== payerFilter) {
          return false;
        }

        if (
          monthFilter !== "all" &&
          getincomeMonth(income.paymentDate).toString() !== monthFilter
        ) {
          return false;
        }

        if (
          yearFilter !== "all" &&
          getincomeYear(income.paymentDate).toString() !== yearFilter
        ) {
          return false;
        }

        return true;
      });
  }, [incomes, categoryFilter, payerFilter, monthFilter, yearFilter]);

  // =========================
  // Reset Pagination
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, payerFilter, monthFilter, yearFilter]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(filteredincomes.length / PAGE_SIZE);

  const paginatedincomes = filteredincomes.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // =========================
  // Statistics
  // =========================

  const totalincomes = useMemo(() => {
    return incomes.reduce((sum, income) => sum + income.amount, 0);
  }, [incomes]);

  const monthincomes = useMemo(() => {
    return incomes
      .filter(
        (income) =>
          getincomeMonth(income.paymentDate) === currentMonth &&
          getincomeYear(income.paymentDate) === currentYear,
      )
      .reduce((sum, income) => sum + income.amount, 0);
  }, [incomes, currentMonth, currentYear]);

  const filteredTotal = useMemo(() => {
    return filteredincomes.reduce((sum, income) => sum + income.amount, 0);
  }, [filteredincomes]);

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setIncomeForm({
      payerName: "",
      reason: "",
      category: "أخرى",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      eventDate: "",
      notes: "",
    });
  };

  // =========================
  // Create income
  // =========================
  const handleCreateincome = async () => {
    try {
      if (!incomeForm.payerName.trim()) {
        toast.error("اكتب اسم الشخص الذي دفع");
        return;
      }

      if (!incomeForm.reason.trim()) {
        toast.error("اكتب سبب الدفع");
        return;
      }

      if (!incomeForm.amount || Number(incomeForm.amount) <= 0) {
        toast.error("أدخل مبلغ صحيح");
        return;
      }

      if (!incomeForm.paymentDate) {
        toast.error("حدد تاريخ الدفع");
        return;
      }

      await api.addOtherIncome({
        payerName: incomeForm.payerName.trim(),
        reason: incomeForm.reason.trim(),
        category: incomeForm.category,
        amount: Number(incomeForm.amount),
        paymentDate: incomeForm.paymentDate,
        eventDate: incomeForm.eventDate || null,
        notes: incomeForm.notes.trim() || null,
      });

      toast.success("تم تسجيل المصروف بنجاح");

      setOpen(false);
      resetForm();

      await loadOtherIncomes();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل المصروف",
      );
    }
  };

  // =========================
  // Delete income
  // =========================
  const handleDelete = async (id: string) => {
    try {
      await api.removeOtherIncome(id);

      toast.success("تم حذف المصروف");

      await loadOtherIncomes();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "حدث خطأ أثناء حذف المصروف",
      );
    }
  };

  // =========================
  // Format Date
  // =========================
  const formatDate = (date?: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("ar-EG");
  };

  return (
    <div className="space-y-8">
      {/* Header */}

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">الإيرادات الأخرى</h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تسجيل ومتابعة جميع المصروفات والدفعات الأخرى داخل السنتر.
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => {
            resetForm();
            setOpen(true);
          }}
        >
          <Plus className="size-4" />
          تسجيل إيراد
        </Button>
      </header>

      {/* Statistics */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                إجمالي الإيرادات الأخرى
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalincomes.toLocaleString("ar-EG")} ج.م
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
                {monthincomes.toLocaleString("ar-EG")} ج.م
              </p>
            </div>

            <Wallet className="size-9 text-primary" />
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                عدد عمليات المصروفات
              </p>

              <p className="mt-2 text-3xl font-bold">{incomes.length}</p>
            </div>

            <Receipt className="size-9 text-primary" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="surface-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold">البحث والفلترة</h2>

          <p className="text-sm text-muted-foreground">
            اعرض المصروفات حسب الشخص أو التصنيف أو الشهر.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Payer */}
          <div className="space-y-2">
            <Label>مصدر الإيراد</Label>
            <Select value={payerFilter} onValueChange={setPayerFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">جميع الأشخاص</SelectItem>

                {payers.map((payer) => (
                  <SelectItem key={payer} value={payer}>
                    {payer}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>التصنيف</Label>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>

                {incomeCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month */}

          <div className="space-y-2">
            <Label>الشهر</Label>

            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">كل الشهور</SelectItem>
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

            <Select value={yearFilter} onValueChange={setYearFilter}>
              <SelectTrigger>
                <SelectValue placeholder="اختر السنة" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">كل السنوات</SelectItem>

                {Array.from(
                  new Set(
                    incomes.map((income) =>
                      getincomeYear(income.paymentDate).toString(),
                    ),
                  ),
                )
                  .sort((a, b) => Number(b) - Number(a))
                  .map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Filtered Summary */}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">
            إجمالي المبلغ حسب الفلترة
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {filteredTotal.toLocaleString("ar-EG")} ج.م
          </h2>
        </div>

        <div className="surface-card p-5">
          <p className="text-sm text-muted-foreground">عدد العمليات</p>

          <h2 className="mt-2 text-3xl font-bold">{filteredincomes.length}</h2>
        </div>
      </div>

      {/* incomes Table */}

      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            تسجيل إيراد
          </Button>

          <div>
            <h2 className="text-lg font-bold">سجل الإيرادات الأخرى</h2>

            <p className="text-sm text-muted-foreground">
              جميع المصروفات والدفعات الأخرى التي تم تسجيلها.
            </p>
          </div>

          <Badge variant="secondary">{filteredincomes.length} عملية</Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">مصدر الإيراد</TableHead>
              <TableHead className="text-center">السبب</TableHead>
              <TableHead className="text-center">التصنيف</TableHead>
              <TableHead className="text-center">المبلغ</TableHead>
              <TableHead className="text-center">تاريخ الدفع</TableHead>
              <TableHead className="text-center">تاريخ الحدث</TableHead>
              <TableHead className="text-center">ملاحظات</TableHead>
              <TableHead className="text-center">حذف</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  جاري تحميل المصروفات...
                </TableCell>
              </TableRow>
            )}

            {!loading && filteredincomes.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-12 text-center text-muted-foreground"
                >
                  لا توجد مصروفات.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paginatedincomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell className="text-center font-medium">
                    {income.payerName}
                  </TableCell>
                  <TableCell className="text-center">
                    {income.reason}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary">
                      {income.category || "أخرى"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {income.amount.toLocaleString("ar-EG")} ج.م
                  </TableCell>
                  <TableCell className="text-center">{formatDate(income.paymentDate)}</TableCell>
                  <TableCell className="text-center">{formatDate(income.eventDate)}</TableCell>
                  <TableCell className="text-center">{income.notes || "-"}</TableCell>
                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>حذف المصروف؟</AlertDialogTitle>

                          <AlertDialogDescription>
                            لن تستطيع استرجاع هذه العملية بعد حذفها.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>إلغاء</AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() => handleDelete(income.id)}
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

        {/* Pagination */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        {/* Create income Dialog */}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>تسجيل إيراد جديد</DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Payer */}

              <div className="space-y-2">
                <Label>مصدر الإيراد</Label>

                <Input
                  placeholder="مثال: أحمد"
                  value={incomeForm.payerName}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      payerName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Category */}

              <div className="space-y-2">
                <Label>تصنيف المصروف</Label>

                <Select
                  value={incomeForm.category}
                  onValueChange={(value) =>
                    setIncomeForm({
                      ...incomeForm,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {incomeCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}

              <div className="space-y-2 md:col-span-2">
                <Label>سبب الدفع</Label>

                <Input
                  placeholder="مثال: حجز استضافة مدرس"
                  value={incomeForm.reason}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      reason: e.target.value,
                    })
                  }
                />
              </div>

              {/* Amount */}

              <div className="space-y-2">
                <Label>المبلغ</Label>

                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={incomeForm.amount}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      amount: e.target.value,
                    })
                  }
                />
              </div>

              {/* Payment Date */}

              <div className="space-y-2">
                <Label>تاريخ الدفع</Label>

                <Input
                  type="date"
                  value={incomeForm.paymentDate}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      paymentDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* Event Date */}
              <div className="space-y-2">
                <Label>
                  تاريخ الحدث
                  <span className="mr-1 text-xs text-muted-foreground">
                    (اختياري)
                  </span>
                </Label>

                <Input
                  type="date"
                  value={incomeForm.eventDate}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      eventDate: e.target.value,
                    })
                  }
                />
              </div>

              {/* Notes */}

              <div className="space-y-2 md:col-span-2">
                <Label>ملاحظات</Label>

                <Input
                  placeholder="أي تفاصيل إضافية..."
                  value={incomeForm.notes}
                  onChange={(e) =>
                    setIncomeForm({
                      ...incomeForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <DialogFooter className="md:col-span-2">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  إلغاء
                </Button>

                <Button onClick={handleCreateincome}>حفظ الإيراد</Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
