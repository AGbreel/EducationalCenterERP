import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { a as cn, n as api, t as Button } from "./data-BNilzuWy.mjs";
import { A as CameraOff, S as CreditCard, j as CalendarCheck, l as ScanLine, s as Search } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BJBFWfDZ.mjs";
import { n as useDb, t as Badge } from "./use-db-EiXjrZy6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as SelectItem, n as SelectContent, o as SelectTrigger, s as SelectValue, t as Select } from "./select-C-QkCN5n.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-CWLc1ozN.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scan-CmuThqUX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
function ScanPage() {
	const db = useDb();
	const [student, setStudent] = (0, import_react.useState)(null);
	const [manual, setManual] = (0, import_react.useState)("");
	const [scanning, setScanning] = (0, import_react.useState)(false);
	const [camError, setCamError] = (0, import_react.useState)(null);
	const scannerRef = (0, import_react.useRef)(null);
	const resolve = async (text) => {
		let student = await api.findByQrValue(text);
		if (!student) student = await api.findByStudentCode(text);
		if (!student) student = await api.findByStudentID(text);
		if (student) {
			setStudent(student);
			toast.success(`تم التعرف على ${student.fullName}`);
		} else toast.error("لا يوجد طالب بهذا الكود");
	};
	(0, import_react.useEffect)(() => {
		if (!scanning) return;
		let active = true;
		(async () => {
			try {
				const { Html5Qrcode } = await import("../_libs/html5-qrcode.mjs").then((n) => n.t);
				const scanner = new Html5Qrcode("qr-reader");
				scannerRef.current = scanner;
				await scanner.start({ facingMode: "environment" }, {
					fps: 10,
					qrbox: {
						width: 240,
						height: 240
					}
				}, (decoded) => {
					if (!active) return;
					active = false;
					resolve(decoded);
					setScanning(false);
				}, () => {});
			} catch {
				setCamError("لا يمكن الوصول إلى الكاميرا — استخدم إدخال الكود يدويًا.");
				setScanning(false);
			}
		})();
		return () => {
			active = false;
			const s = scannerRef.current;
			scannerRef.current = null;
			if (s) s.stop().then(() => s.clear()).catch(() => {});
		};
	}, [scanning]);
	const studentEnrollments = student ? db.enrollments.filter((e) => e.studentId === student.id).map((e) => ({
		studentClassId: e.id,
		courseClassId: e.courseClassId,
		monthlyFee: e.monthlyFee,
		courseClass: db.courseClasses.find((c) => c.id === e.courseClassId)
	})).filter((x) => x.courseClass) : [];
	const [openPayment, setOpenPayment] = (0, import_react.useState)(false);
	const [selectedEnrollment, setSelectedEnrollment] = (0, import_react.useState)(null);
	const [paymentType, setPaymentType] = (0, import_react.useState)("Monthly");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [sessions, setSessions] = (0, import_react.useState)(1);
	const [notes, setNotes] = (0, import_react.useState)("");
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const monthlyPaid = selectedEnrollment != null && db.payments.some((p) => p.studentClassId === selectedEnrollment.studentClassId && p.paymentType === "Monthly" && p.month === currentMonth && p.year === currentYear);
	const studentPayments = student ? db.payments.filter((p) => p.studentId === student.id) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "سكان QR Code"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "امسح كود الطالب ثم اختر: تسجيل حضور في مادة، أو دفع مصاريف مادة واحدة أو كل المواد."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "surface-card space-y-4 p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold",
							children: "المسح"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							id: "qr-reader",
							className: "grid min-h-64 place-items-center overflow-hidden rounded-xl bg-muted [&_video]:w-full",
							children: !scanning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-6 text-center text-sm text-muted-foreground",
								children: camError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex flex-col items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CameraOff, { className: "size-6" }),
										" ",
										camError
									]
								}) : "اضغط بدء المسح لتشغيل الكاميرا"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "flex-1",
								size: "lg",
								onClick: () => setScanning((v) => !v),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { className: "size-4" }),
									" ",
									scanning ? "إيقاف المسح" : "بدء المسح"
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							className: "flex gap-2",
							onSubmit: (e) => {
								e.preventDefault();
								resolve(manual);
								setManual("");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: manual,
								onChange: (e) => setManual(e.target.value),
								placeholder: "أو أدخل كود الطالب يدويًا: STD-1001",
								className: "font-mono"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "outline",
								"aria-label": "بحث",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "size-4" })
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card space-y-5 p-5",
					children: !student ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full min-h-64 place-items-center text-center text-sm text-muted-foreground",
						children: "لم يتم مسح أي كود بعد — بيانات الطالب والخيارات ستظهر هنا."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xl font-bold",
								children: student.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									student.grade || "بدون صف",
									" · ",
									student.phone || "بدون رقم"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "mt-2 font-mono",
								children: student.code
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
							defaultValue: "attendance",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "w-full",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "attendance",
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "size-4" }), " تسجيل حضور"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
										value: "payment",
										className: "flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "size-4" }), " دفع مصاريف"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "attendance",
									className: "space-y-4 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "اختر الكلاس لتسجيل الحضور."
										}),
										studentEnrollments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "الطالب غير مشترك في أي كلاس."
										}),
										studentEnrollments.map(({ studentClassId, courseClassId, courseClass }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "h-auto w-full justify-between py-4",
											onClick: async () => {
												try {
													await api.markAttendance(student.id, courseClassId);
													toast.success(`تم تسجيل حضور ${student.fullName} في ${courseClass.name}`);
												} catch (err) {
													toast.error(err.message);
												}
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold",
													children: courseClass.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														courseClass.day,
														" • ",
														courseClass.startTime,
														" -",
														" ",
														courseClass.endTime
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "secondary",
												children: [
													db.attendance.filter((a) => a.studentId === student.id && a.courseClassId === courseClassId).length,
													" ",
													"حضور"
												]
											})]
										}, studentClassId))
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
									value: "payment",
									className: "space-y-4 pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "اختر الكلاس لتسجيل دفعة جديدة."
										}),
										studentEnrollments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "الطالب غير مشترك في أي كلاس."
										}),
										studentEnrollments.map(({ studentClassId, monthlyFee, courseClass }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											className: "h-auto w-full justify-between py-4",
											onClick: () => {
												setSelectedEnrollment({
													studentClassId,
													monthlyFee,
													courseClass
												});
												setPaymentType("Monthly");
												setAmount(monthlyFee.toString());
												setSessions(1);
												setNotes("");
												setOpenPayment(true);
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold",
													children: courseClass.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-muted-foreground",
													children: [
														courseClass.day,
														" • ",
														courseClass.startTime
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [monthlyFee, " ج.م"] })]
										}, studentClassId))
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "w-full",
							onClick: () => {
								setStudent(null);
								setSelectedEnrollment(null);
							},
							children: "مسح طالب آخر"
						})
					] })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: openPayment,
				onOpenChange: setOpenPayment,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "تسجيل دفعة جديدة" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الكلاس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: selectedEnrollment?.courseClass?.name ?? "",
									disabled: true
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-lg border p-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium",
											children: "حالة اشتراك هذا الشهر"
										}), monthlyPaid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-green-600",
											children: "مدفوع"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "destructive",
											children: "غير مدفوع"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "نوع الدفع" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: paymentType,
									onValueChange: (v) => setPaymentType(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Monthly",
										children: "اشتراك شهرى"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Session",
										children: "بالحصة"
									})] })]
								})] }),
								paymentType === "Session" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "عدد الحصص" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: sessions,
									onChange: (e) => setSessions(Number(e.target.value))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المبلغ" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: amount,
									onChange: (e) => setAmount(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "ملاحظات" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: notes,
									onChange: (e) => setNotes(e.target.value)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آخر المدفوعات" }),
										studentPayments.filter((p) => p.studentClassId === selectedEnrollment?.studentClassId).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 5).map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between rounded-lg border p-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium",
												children: payment.paymentType === "Monthly" ? "اشتراك شهرى" : "بالحصة"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-muted-foreground",
												children: [
													payment.month,
													"/",
													payment.year
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [payment.amount, " ج.م"] })]
										}, payment.id)),
										studentPayments.filter((p) => p.studentClassId === selectedEnrollment?.studentClassId).length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted-foreground",
											children: "لا توجد مدفوعات حتى الآن."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									className: "w-full",
									disabled: paymentType === "Monthly" && monthlyPaid,
									onClick: async () => {
										if (!selectedEnrollment || !student) return;
										try {
											const dto = {
												studentId: student.id,
												studentClassId: selectedEnrollment.studentClassId,
												amount: Number(amount),
												month: currentMonth,
												year: currentYear,
												paymentType,
												paymentMethod: "Cash",
												notes
											};
											if (paymentType === "Session") dto.sessionsCount = sessions;
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
											toast.error(err.message);
										}
									},
									children: "تسجيل الدفع"
								})
							]
						}),
						selectedEnrollment && (() => {
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-lg border p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: "حالة اشتراك هذا الشهر"
									}), monthlyPaid ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "bg-green-600",
										children: "مدفوع"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										children: "غير مدفوع"
									})]
								})
							});
						})(),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "آخر المدفوعات" }), studentPayments.filter((p) => p.studentClassId === selectedEnrollment?.studentClassId).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()).slice(0, 5).map((payment) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-lg border p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: payment.paymentType === "Monthly" ? "اشتراك شهرى" : "بالحصة"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										payment.month,
										"/",
										payment.year
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [payment.amount, " ج.م"] })]
							}, payment.id))]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { ScanPage as component };
