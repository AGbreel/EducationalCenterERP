import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api, t as Button } from "./data-BNilzuWy.mjs";
import { f as Plus, o as Trash2 } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BJBFWfDZ.mjs";
import { n as useDb, t as Badge } from "./use-db-EiXjrZy6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/student-enrollment-CWSDVMMi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentEnrollmentPage() {
	const db = useDb();
	const [form, setForm] = (0, import_react.useState)({
		studentId: "",
		courseClassId: "",
		monthlyFee: ""
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!form.studentId || !form.courseClassId || !form.monthlyFee) {
			toast.error("أكمل جميع البيانات");
			return;
		}
		try {
			setSaving(true);
			await api.enrollStudent(form.studentId, form.courseClassId, Number(form.monthlyFee));
			toast.success("تم تسجيل الطالب داخل الكلاس");
			setForm({
				studentId: "",
				courseClassId: "",
				monthlyFee: ""
			});
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "تسجيل الطلاب داخل الكلاسات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "اربط الطالب بالكلاس وحدد قيمة الاشتراك الشهري."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "surface-card grid gap-4 p-5 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الطالب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border bg-background px-3",
							value: form.studentId,
							onChange: (e) => setForm({
								...form,
								studentId: e.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "اختر الطالب"
							}), db.students.map((student) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: student.id,
								children: student.fullName
							}, student.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الكلاس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "h-10 w-full rounded-md border bg-background px-3",
							value: form.courseClassId,
							onChange: (e) => setForm({
								...form,
								courseClassId: e.target.value
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "اختر الكلاس"
							}), db.courseClasses.map((courseClass) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: courseClass.id,
								children: [
									courseClass.name,
									" - ",
									courseClass.teacher
								]
							}, courseClass.id))]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الاشتراك الشهري" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							placeholder: "300",
							value: form.monthlyFee,
							onChange: (e) => setForm({
								...form,
								monthlyFee: e.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "w-full",
							size: "lg",
							type: "submit",
							disabled: saving,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), saving ? "جاري التسجيل..." : "تسجيل الطالب"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-4",
				children: [db.enrollments.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card p-6 text-center text-muted-foreground",
					children: "لا يوجد أي طالب مسجل داخل الكلاسات حتى الآن."
				}), db.enrollments.map((enrollment) => {
					const student = db.students.find((s) => s.id === enrollment.studentId);
					const courseClass = db.courseClasses.find((c) => c.id === enrollment.courseClassId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "surface-card space-y-4 p-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-lg font-bold",
									children: student?.fullName ?? "طالب غير موجود"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: courseClass?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: courseClass?.subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: courseClass?.teacher }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											children: courseClass?.day
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											children: [
												courseClass?.startTime,
												" - ",
												courseClass?.endTime
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											children: courseClass?.hall
										})
									]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									className: "text-base",
									children: [enrollment.monthlyFee, " ج.م"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "حذف",
									onClick: () => {
										api.unenroll(enrollment.id).then(() => toast.success("تم إلغاء تسجيل الطالب")).catch((err) => toast.error(err.message));
									},
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4 text-destructive" })
								})]
							})]
						})
					}, enrollment.id);
				})]
			})
		]
	});
}
//#endregion
export { StudentEnrollmentPage as component };
