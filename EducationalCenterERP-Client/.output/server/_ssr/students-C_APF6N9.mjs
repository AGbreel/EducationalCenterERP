import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api, t as Button } from "./data-BNilzuWy.mjs";
import { b as Download, d as QrCode, f as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BJBFWfDZ.mjs";
import { n as useDb, t as Badge } from "./use-db-EiXjrZy6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectLabel, i as SelectItem, n as SelectContent, o as SelectTrigger, r as SelectGroup, s as SelectValue, t as Select } from "./select-C-QkCN5n.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-ZrH3bKoZ.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CWLc1ozN.mjs";
import { t as QRCodeCanvas } from "../_libs/qrcode.react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students-C_APF6N9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentsPage() {
	const db = useDb();
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		phone: "",
		parentPhone: "",
		address: "",
		school: "",
		grade: ""
	});
	const [qrStudent, setQrStudent] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!form.fullName.trim()) return;
		if (form.fullName.length < 3) {
			toast.error("اسم الطالب غير صحيح");
			return;
		}
		if (form.phone.length != 11) {
			toast.error("رقم الهاتف غير صحيح");
			return;
		}
		if (form.parentPhone.length != 11) {
			toast.error("رقم ولي الأمر غير صحيح");
			return;
		}
		setSaving(true);
		try {
			const student = await api.addStudent({
				fullName: form.fullName,
				phone: form.phone,
				parentPhone: form.parentPhone,
				address: form.address,
				school: form.school,
				grade: form.grade
			});
			setForm({
				fullName: "",
				phone: "",
				grade: "",
				parentPhone: "",
				address: "",
				school: ""
			});
			setQrStudent(student);
			toast.success(`تم تسجيل ${student.fullName} وإنشاء كود ${student.code}`);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	const downloadQr = () => {
		const canvas = document.querySelector("#student-qr canvas");
		if (!canvas || !qrStudent) return;
		const link = document.createElement("a");
		link.href = canvas.toDataURL("image/png");
		link.download = `${qrStudent.code}.png`;
		link.click();
	};
	const grades = [{
		label: "المرحلة الإعدادية",
		items: [
			"الصف الأول الإعدادي",
			"الصف الثاني الإعدادي",
			"الصف الثالث الإعدادي"
		]
	}, {
		label: "المرحلة الثانوية",
		items: [
			"الصف الأول الثانوي",
			"الصف الثاني الثانوي",
			"الصف الثالث الثانوي"
		]
	}];
	(0, import_react.useEffect)(() => {
		console.log(db.students);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "تسجيل الطلاب"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "كل طالب جديد يحصل تلقائيًا على كود QR خاص به للحضور والدفع."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "surface-card grid gap-4 p-5 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "fullName",
							children: "اسم الطالب"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fullName",
							value: form.fullName,
							onChange: (e) => setForm({
								...form,
								fullName: e.target.value
							}),
							placeholder: "مثال: أحمد كريم",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "رقم الهاتف"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							value: form.phone,
							onChange: (e) => setForm({
								...form,
								phone: e.target.value
							}),
							placeholder: "01xxxxxxxxx"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "رقم ولي الأمر" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.parentPhone,
							onChange: (e) => setForm({
								...form,
								parentPhone: e.target.value
							}),
							placeholder: "01xxxxxxxxx"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "المدرسة" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.school,
							onChange: (e) => setForm({
								...form,
								school: e.target.value
							}),
							placeholder: "اسم المدرسة"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 md:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "العنوان" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.address,
							onChange: (e) => setForm({
								...form,
								address: e.target.value
							}),
							placeholder: "عنوان الطالب"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "grade",
							children: "الصف الدراسي"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.grade,
							onValueChange: (value) => setForm((prev) => ({
								...prev,
								grade: value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "grade",
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "اختر الصف الدراسي" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: grades.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel, { children: group.label }), group.items.map((grade) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: grade,
								children: grade
							}, grade))] }, group.label)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "w-full",
							size: "lg",
							disabled: saving,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }),
								" ",
								saving ? "جاري الحفظ..." : "إضافة الطالب"
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: db.students.map((student) => {
					db.courseClasses;
					const studentEnrollments = db.enrollments.filter((e) => e.studentId === student.id);
					console.log(db.students);
					studentEnrollments.map((e) => e.courseClassId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold",
									children: student.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "mt-2 font-mono",
									children: student.code
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 text-sm text-muted-foreground md:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"📱",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: student.phone || "--"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"👨‍👦",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: student.parentPhone || "--"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"🎓",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: student.grade || "--"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"🏫",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium",
												children: student.school || "--"
											})
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "md:col-span-2",
											children: [
												"📍",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium",
													children: student.address || "--"
												})
											]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => setQrStudent(student),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-2 h-4 w-4" }), "QR Code"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "destructive",
										size: "icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "حذف الطالب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
									"هل تريد حذف",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
										" ",
										student.fullName,
										" "
									] }),
									"؟",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"لن تستطيع استرجاع بياناته بعد الحذف."
								] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "إلغاء" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
									onClick: async () => {
										try {
											await api.removeStudent(student.id);
											toast.success("تم حذف الطالب");
										} catch (err) {
											toast.error(err.message);
										}
									},
									children: "حذف"
								})] })] })] })]
							})]
						})
					}, student.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!qrStudent,
				onOpenChange: (o) => !o && setQrStudent(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "كود QR للطالب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [qrStudent?.fullName, " — استخدم هذا الكود في صفحة السكان للحضور أو الدفع."] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "student-qr",
						className: "flex flex-col items-center gap-4 py-2",
						children: [
							qrStudent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl bg-card p-4 shadow-card",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QRCodeCanvas, {
									value: qrStudent.code,
									size: 200,
									level: "H",
									includeMargin: true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: "font-mono",
								children: qrStudent?.code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: downloadQr,
								className: "w-full",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " تحميل الكود"]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { StudentsPage as component };
