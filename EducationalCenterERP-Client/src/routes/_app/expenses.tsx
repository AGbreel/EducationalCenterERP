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
import { api } from "@/lib/data";

export const Route = createFileRoute("/_app/expenses")({
  head: () => ({
    meta: [
      {
        title: "المصروفات الأخرى | منصة السنتر",
      },
      {
        name: "description",
        content: "تسجيل وإدارة المصروفات الأخرى داخل السنتر.",
      },
    ],
  }),
  component: ExpensesPage,
});

type Expense = {
  id: string;
  payerName: string;
  reason: string;
  category?: string | null;
  amount: number;
  paymentDate: string;
  eventDate?: string | null;
  notes?: string | null;
  createdAt?: string;
};

const expenseCategories = [
  "استضافة",
  "رواتب",
  "إيجار",
  "كهرباء",
  "مياه",
  "إنترنت",
  "أدوات",
  "دعاية",
  "مواصلات",
  "صيانة",
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

function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const currentDate = new Date();

  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [payerFilter, setPayerFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState(
    currentMonth.toString(),
  );
  const [yearFilter, setYearFilter] = useState(
    currentYear.toString(),
  );

  const [currentPage, setCurrentPage] = useState(1);

  const [expenseForm, setExpenseForm] = useState({
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
  // Load Expenses
  // =========================

  const loadExpenses = async () => {
    try {
      setLoading(true);

      const result = await api.getExpenses();

      setExpenses(result);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تحميل المصروفات",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  // =========================
  // Helpers
  // =========================

  const getExpenseMonth = (date: string) => {
    return new Date(date).getMonth() + 1;
  };

  const getExpenseYear = (date: string) => {
    return new Date(date).getFullYear();
  };

  // =========================
  // Payers
  // =========================

  const payers = useMemo(() => {
    const names = expenses
      .map((expense) => expense.payerName)
      .filter(Boolean);

    return Array.from(new Set(names));
  }, [expenses]);

  // =========================
  // Filtered Expenses
  // =========================

  const filteredExpenses = useMemo(() => {
    return [...expenses]
      .sort(
        (a, b) =>
          new Date(b.paymentDate).getTime() -
          new Date(a.paymentDate).getTime(),
      )
      .filter((expense) => {
        if (
          categoryFilter !== "all" &&
          expense.category !== categoryFilter
        ) {
          return false;
        }

        if (
          payerFilter !== "all" &&
          expense.payerName !== payerFilter
        ) {
          return false;
        }

        if (
          getExpenseMonth(expense.paymentDate).toString() !==
          monthFilter
        ) {
          return false;
        }

        if (
          getExpenseYear(expense.paymentDate).toString() !==
          yearFilter
        ) {
          return false;
        }

        return true;
      });
  }, [
    expenses,
    categoryFilter,
    payerFilter,
    monthFilter,
    yearFilter,
  ]);

  // =========================
  // Reset Pagination
  // =========================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    categoryFilter,
    payerFilter,
    monthFilter,
    yearFilter,
  ]);

  // =========================
  // Pagination
  // =========================

  const totalPages = Math.ceil(
    filteredExpenses.length / PAGE_SIZE,
  );

  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // =========================
  // Statistics
  // =========================

  const totalExpenses = useMemo(() => {
    return expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
  }, [expenses]);

  const monthExpenses = useMemo(() => {
    return expenses
      .filter(
        (expense) =>
          getExpenseMonth(expense.paymentDate) === currentMonth &&
          getExpenseYear(expense.paymentDate) === currentYear,
      )
      .reduce(
        (sum, expense) => sum + expense.amount,
        0,
      );
  }, [expenses, currentMonth, currentYear]);

  const filteredTotal = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
  }, [filteredExpenses]);

  // =========================
  // Reset Form
  // =========================

  const resetForm = () => {
    setExpenseForm({
      payerName: "",
      reason: "",
      category: "أخرى",
      amount: "",
      paymentDate: new Date()
        .toISOString()
        .split("T")[0],
      eventDate: "",
      notes: "",
    });
  };

  // =========================
  // Create Expense
  // =========================

  const handleCreateExpense = async () => {
    try {
      if (!expenseForm.payerName.trim()) {
        toast.error("اكتب اسم الشخص الذي دفع");
        return;
      }

      if (!expenseForm.reason.trim()) {
        toast.error("اكتب سبب الدفع");
        return;
      }

      if (
        !expenseForm.amount ||
        Number(expenseForm.amount) <= 0
      ) {
        toast.error("أدخل مبلغ صحيح");
        return;
      }

      if (!expenseForm.paymentDate) {
        toast.error("حدد تاريخ الدفع");
        return;
      }

      await api.addExpense({
        payerName: expenseForm.payerName.trim(),
        reason: expenseForm.reason.trim(),
        category: expenseForm.category,
        amount: Number(expenseForm.amount),
        paymentDate: expenseForm.paymentDate,
        eventDate: expenseForm.eventDate || null,
        notes: expenseForm.notes.trim() || null,
      });

      toast.success("تم تسجيل المصروف بنجاح");

      setOpen(false);
      resetForm();

      await loadExpenses();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء تسجيل المصروف",
      );
    }
  };

  // =========================
  // Delete Expense
  // =========================

  const handleDelete = async (id: string) => {
    try {
      await api.removeExpense(id);

      toast.success("تم حذف المصروف");

      await loadExpenses();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "حدث خطأ أثناء حذف المصروف",
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
          <h1 className="text-3xl font-bold">
            المصروفات الأخرى
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            تسجيل ومتابعة جميع المصروفات والدفعات الأخرى
            داخل السنتر.
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
          تسجيل مصروف
        </Button>
      </header>

      {/* Statistics */}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                إجمالي المصروفات
              </p>

              <p className="mt-2 text-3xl font-bold">
                {totalExpenses.toLocaleString("ar-EG")} ج.م
              </p>
            </div>

            <DollarSign className="size-9 text-primary" />
          </div>
        </div>

        <div className="surface-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                مصروفات هذا الشهر
              </p>

              <p className="mt-2 text-3xl font-bold">
                {monthExpenses.toLocaleString("ar-EG")} ج.م
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

              <p className="mt-2 text-3xl font-bold">
                {expenses.length}
              </p>
            </div>

            <Receipt className="size-9 text-primary" />
          </div>
        </div>
      </div>

      {/* Filters */}

      <div className="surface-card p-5">
        <div className="mb-5">
          <h2 className="text-lg font-bold">
            البحث والفلترة
          </h2>

          <p className="text-sm text-muted-foreground">
            اعرض المصروفات حسب الشخص أو التصنيف أو الشهر.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Payer */}

          <div className="space-y-2">
            <Label>من دفع؟</Label>

            <Select
              value={payerFilter}
              onValueChange={setPayerFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  جميع الأشخاص
                </SelectItem>

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

            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">
                  جميع التصنيفات
                </SelectItem>

                {expenseCategories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Month */}

          <div className="space-y-2">
            <Label>الشهر</Label>

            <Select
              value={monthFilter}
              onValueChange={setMonthFilter}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {months.map((month, index) => (
                  <SelectItem
                    key={index}
                    value={(index + 1).toString()}
                  >
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
              onChange={(e) =>
                setYearFilter(e.target.value)
              }
            />
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
          <p className="text-sm text-muted-foreground">
            عدد العمليات
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {filteredExpenses.length}
          </h2>
        </div>
      </div>

      {/* Expenses Table */}

      <div className="surface-card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            <Plus className="size-4" />
            تسجيل مصروف
          </Button>

          <div>
            <h2 className="text-lg font-bold">
              سجل المصروفات
            </h2>

            <p className="text-sm text-muted-foreground">
              جميع المصروفات والدفعات الأخرى التي تم تسجيلها.
            </p>
          </div>

          <Badge variant="secondary">
            {filteredExpenses.length} عملية
          </Badge>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>من دفع؟</TableHead>
              <TableHead>السبب</TableHead>
              <TableHead>التصنيف</TableHead>
              <TableHead>المبلغ</TableHead>
              <TableHead>تاريخ الدفع</TableHead>
              <TableHead>تاريخ الحدث</TableHead>
              <TableHead>ملاحظات</TableHead>
              <TableHead className="text-center">
                حذف
              </TableHead>
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

            {!loading &&
              filteredExpenses.length === 0 && (
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
              paginatedExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">
                    {expense.payerName}
                  </TableCell>

                  <TableCell>
                    {expense.reason}
                  </TableCell>

                  <TableCell>
                    <Badge variant="secondary">
                      {expense.category || "أخرى"}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {expense.amount.toLocaleString("ar-EG")} ج.م
                  </TableCell>

                  <TableCell>
                    {formatDate(expense.paymentDate)}
                  </TableCell>

                  <TableCell>
                    {formatDate(expense.eventDate)}
                  </TableCell>

                  <TableCell>
                    {expense.notes || "-"}
                  </TableCell>

                  <TableCell className="text-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>

                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            حذف المصروف؟
                          </AlertDialogTitle>

                          <AlertDialogDescription>
                            لن تستطيع استرجاع هذه العملية بعد
                            حذفها.
                          </AlertDialogDescription>
                        </AlertDialogHeader>

                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            إلغاء
                          </AlertDialogCancel>

                          <AlertDialogAction
                            onClick={() =>
                              handleDelete(expense.id)
                            }
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

        {/* Create Expense Dialog */}

        <Dialog
          open={open}
          onOpenChange={setOpen}
        >
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                تسجيل مصروف جديد
              </DialogTitle>
            </DialogHeader>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Payer */}

              <div className="space-y-2">
                <Label>من دفع؟</Label>

                <Input
                  placeholder="مثال: أحمد"
                  value={expenseForm.payerName}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      payerName: e.target.value,
                    })
                  }
                />
              </div>

              {/* Category */}

              <div className="space-y-2">
                <Label>تصنيف المصروف</Label>

                <Select
                  value={expenseForm.category}
                  onValueChange={(value) =>
                    setExpenseForm({
                      ...expenseForm,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    {expenseCategories.map(
                      (category) => (
                        <SelectItem
                          key={category}
                          value={category}
                        >
                          {category}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}

              <div className="space-y-2 md:col-span-2">
                <Label>سبب الدفع</Label>

                <Input
                  placeholder="مثال: حجز استضافة مدرس"
                  value={expenseForm.reason}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
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
                  value={expenseForm.amount}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
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
                  value={expenseForm.paymentDate}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
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
                  value={expenseForm.eventDate}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
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
                  value={expenseForm.notes}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      notes: e.target.value,
                    })
                  }
                />
              </div>

              <DialogFooter className="md:col-span-2">
                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  إلغاء
                </Button>

                <Button
                  onClick={handleCreateExpense}
                >
                  حفظ المصروف
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};