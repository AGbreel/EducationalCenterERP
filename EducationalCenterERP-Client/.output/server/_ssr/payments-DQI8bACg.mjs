import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as api, t as Button } from "./data-BNilzuWy.mjs";
import { S as CreditCard, f as Plus, n as Wallet, o as Trash2, u as Receipt, x as DollarSign } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BJBFWfDZ.mjs";
import { n as useDb, t as Badge } from "./use-db-EiXjrZy6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-C-QkCN5n.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-ZrH3bKoZ.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CWLc1ozN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-DQI8bACg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
function PaymentsPage() {
	const db = useDb();
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const totalIncome = (0, import_react.useMemo)(() => {
		return db.payments.reduce((sum, payment) => sum + payment.amount, 0);
	}, [db.payments]);
	const monthIncome = (0, import_react.useMemo)(() => {
		return db.payments.filter((payment) => payment.month === currentMonth && payment.year === currentYear).reduce((sum, payment) => sum + payment.amount, 0);
	}, [db.payments]);
	const sessionPayments = (0, import_react.useMemo)(() => {
		return db.payments.filter((payment) => payment.paymentType === "Session").length;
	}, [db.payments]);
	const monthlyPayments = (0, import_react.useMemo)(() => {
		return db.payments.filter((payment) => payment.paymentType === "Monthly").length;
	}, [db.payments]);
	const [studentFilter, setStudentFilter] = (0, import_react.useState)("all");
	const [classFilter, setClassFilter] = (0, import_react.useState)("all");
	const [paymentTypeFilter, setPaymentTypeFilter] = (0, import_react.useState)("all");
	const [monthFilter, setMonthFilter] = (0, import_react.useState)(currentMonth.toString());
	const [yearFilter, setYearFilter] = (0, import_react.useState)(currentYear.toString());
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
		"ديسمبر"
	];
	const filteredPayments = (0, import_react.useMemo)(() => {
		return db.payments.filter((payment) => {
			if (studentFilter !== "all" && payment.studentId !== studentFilter) return false;
			if (classFilter !== "all" && payment.courseClassId !== classFilter) return false;
			if (paymentTypeFilter !== "all" && payment.paymentType !== paymentTypeFilter) return false;
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
		yearFilter
	]);
	const filteredIncome = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
	const monthlyCount = filteredPayments.filter((x) => x.paymentType === "Monthly").length;
	const sessionCount = filteredPayments.filter((x) => x.paymentType === "Session").length;
	const [open, setOpen] = (0, import_react.useState)(false);
	const [paymentForm, setPaymentForm] = (0, import_react.useState)({
		studentId: "",
		studentClassId: "",
		paymentType: "Monthly",
		amount: "",
		month: currentMonth,
		year: currentYear,
		sessionsCount: 1,
		paymentMethod: "Cash",
		notes: ""
	});
	const studentClasses = (0, import_react.useMemo)(() => {
		if (!paymentForm.studentId) return [];
		return db.enrollments.filter((x) => x.studentId === paymentForm.studentId);
	}, [paymentForm.studentId, db.enrollments]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-bold",
					children: "إدارة المدفوعات"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "تسجيل ومتابعة جميع مدفوعات الطلاب داخل السنتر."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "إضافة دفعة"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "إجمالي الإيرادات"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-3xl font-bold",
								children: [totalIncome.toLocaleString("ar-EG"), " ج.م"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "size-9 text-primary" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "إيرادات هذا الشهر"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-3xl font-bold",
								children: [monthIncome.toLocaleString("ar-EG"), " ج.م"]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "size-9 text-primary" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "الاشتراكات الشهرية"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-3xl font-bold",
								children: monthlyPayments
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-9 text-primary" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "مدفوعات الحصص"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-3xl font-bold",
								children: sessionPayments
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "size-9 text-primary" })]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-bold",
						children: "البحث والفلترة"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "اعرض المدفوعات حسب الطالب أو الكلاس أو نوع الدفع."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 md:grid-cols-2 xl:grid-cols-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الطالب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: studentFilter,
								onValueChange: setStudentFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "جميع الطلاب"
								}), db.students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: student.id,
									children: student.fullName
								}, student.id))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الكلاس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: classFilter,
								onValueChange: setClassFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "جميع الكلاسات"
								}), db.courseClasses.map((cls) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: cls.id,
									children: cls.name
								}, cls.id))] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نوع الدفع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: paymentTypeFilter,
								onValueChange: setPaymentTypeFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "الكل"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Monthly",
										children: "اشتراك شهرى"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Session",
										children: "بالحصة"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الشهر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: monthFilter,
								onValueChange: setMonthFilter,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: months.map((month, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: (index + 1).toString(),
									children: month
								}, index)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "السنة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								value: yearFilter,
								onChange: (e) => setYearFilter(e.target.value)
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "إجمالي المبلغ"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "mt-2 text-3xl font-bold",
							children: [filteredIncome.toLocaleString("ar-EG"), " ج.م"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "عدد الاشتراكات الشهرية"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-3xl font-bold",
							children: monthlyCount
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "surface-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "عدد دفعات الحصص"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 text-3xl font-bold",
							children: sessionCount
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "surface-card overflow-hidden",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "تسجيل دفعة"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold",
								children: "سجل المدفوعات"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "جميع عمليات الدفع التى تمت."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								children: [filteredPayments.length, " عملية"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الطالب" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "المادة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الكلاس" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "النوع" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الشهر" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "المبلغ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "الطريقة" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "التاريخ" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-center",
							children: "حذف"
						})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [filteredPayments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 9,
						className: "py-12 text-center text-muted-foreground",
						children: "لا توجد عمليات دفع."
					}) }), filteredPayments.map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "font-medium",
							children: payment.studentName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: payment.subjectName }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: payment.className }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: payment.paymentType === "Monthly" ? "default" : "secondary",
							children: payment.paymentType === "Monthly" ? "شهرى" : "بالحصة"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [months[payment.month - 1], payment.year] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [payment.amount.toLocaleString("ar-EG"), "ج.م"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: payment.paymentMethod }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: new Date(payment.paymentDate).toLocaleDateString("ar-EG") }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "حذف عملية الدفع؟" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, { children: "لن تستطيع استرجاع هذه العملية بعد حذفها." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "إلغاء" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
								onClick: () => {
									api.removePayment(payment.id).then(() => toast.success("تم حذف العملية")).catch((err) => toast.error(err.message));
								},
								children: "حذف"
							})] })] })] })
						})
					] }, payment.id))] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
						open,
						onOpenChange: setOpen,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
							className: "sm:max-w-2xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "تسجيل دفعة جديدة" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 md:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الطالب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: paymentForm.studentId,
											onValueChange: (v) => setPaymentForm({
												...paymentForm,
												studentId: v,
												studentClassId: ""
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الطالب" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: db.students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: student.id,
												children: student.fullName
											}, student.id)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المادة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: paymentForm.studentClassId,
											onValueChange: (v) => setPaymentForm({
												...paymentForm,
												studentClassId: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر المادة" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: studentClasses.map((enrollment) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: enrollment.id,
												children: enrollment.className
											}, enrollment.id)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نوع الدفع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: paymentForm.paymentType,
											onValueChange: (v) => setPaymentForm({
												...paymentForm,
												paymentType: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Monthly",
												children: "اشتراك شهرى"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Session",
												children: "بالحصة"
											})] })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المبلغ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: paymentForm.amount,
											onChange: (e) => setPaymentForm({
												...paymentForm,
												amount: e.target.value
											})
										})]
									}),
									paymentForm.paymentType === "Session" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عدد الحصص" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: paymentForm.sessionsCount,
											onChange: (e) => setPaymentForm({
												...paymentForm,
												sessionsCount: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الشهر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: paymentForm.month.toString(),
											onValueChange: (v) => setPaymentForm({
												...paymentForm,
												month: Number(v)
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: months.map((m, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: (index + 1).toString(),
												children: m
											}, index)) })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "السنة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: paymentForm.year,
											onChange: (e) => setPaymentForm({
												...paymentForm,
												year: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 md:col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ملاحظات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: paymentForm.notes,
											onChange: (e) => setPaymentForm({
												...paymentForm,
												notes: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										onClick: () => {
											setOpen(false);
										},
										children: "إلغاء"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: async () => {
											try {
												const dto = {
													studentId: paymentForm.studentId,
													studentClassId: paymentForm.studentClassId,
													amount: Number(paymentForm.amount),
													month: paymentForm.month,
													year: paymentForm.year,
													paymentType: paymentForm.paymentType,
													paymentMethod: "Cash",
													notes: paymentForm.notes
												};
												if (paymentForm.paymentType === "Session") dto.sessionsCount = paymentForm.sessionsCount;
												await api.addPayment(dto);
												toast.success("تم تسجيل الدفع");
												setOpen(false);
											} catch (err) {
												toast.error(err.message);
											}
										},
										children: "حفظ"
									})] })
								]
							})]
						})
					})
				]
			})
		]
	});
}
//#endregion
export { PaymentsPage as component };
