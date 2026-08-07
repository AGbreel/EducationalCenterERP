import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { N as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as api, t as Button } from "./data-BNilzuWy.mjs";
import { f as Plus, o as Trash2, p as Pencil, y as GraduationCap } from "../_libs/lucide-react.mjs";
import { n as Label, t as Input } from "./label-BJBFWfDZ.mjs";
import { n as useDb, t as Badge } from "./use-db-EiXjrZy6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, l as AlertDialogTrigger, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-ZrH3bKoZ.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-CWLc1ozN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/teachers-Bva3ldXK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeachersPage() {
	const db = useDb();
	const [form, setForm] = (0, import_react.useState)({
		fullName: "",
		phone: "",
		email: "",
		salary: 0
	});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const submit = async (e) => {
		e.preventDefault();
		if (!form.fullName.trim()) {
			toast.error("يرجى إدخال اسم المدرس");
			return;
		}
		setSaving(true);
		try {
			await api.addTeacher({ ...form });
			setForm({
				fullName: "",
				phone: "",
				email: "",
				salary: 0
			});
			toast.success("تم إضافة المدرس بنجاح");
		} catch (err) {
			toast.error(err.message);
		} finally {
			setSaving(false);
		}
	};
	const [editingTeacher, setEditingTeacher] = (0, import_react.useState)(null);
	const [editForm, setEditForm] = (0, import_react.useState)({
		fullName: "",
		phone: "",
		email: "",
		salary: 0
	});
	const [updating, setUpdating] = (0, import_react.useState)(false);
	const openEditTeacher = (teacher) => {
		setEditingTeacher(teacher);
		setEditForm({
			fullName: teacher.fullName,
			phone: teacher.phone ?? "",
			email: teacher.email ?? "",
			salary: teacher.salary ?? 0
		});
	};
	const updateTeacher = async () => {
		if (!editingTeacher) return;
		setUpdating(true);
		try {
			await api.updateTeacher(editingTeacher.id, { ...editForm });
			toast.success("تم تعديل بيانات المدرس");
			setEditingTeacher(null);
		} catch (err) {
			toast.error(err.message);
		} finally {
			setUpdating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-3xl font-bold",
				children: "المدرسون"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "إدارة المدرسين وإضافة بياناتهم."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => void submit(e),
				className: "surface-card grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "fullName",
							children: "اسم المدرس"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "fullName",
							value: form.fullName,
							onChange: (e) => setForm({
								...form,
								fullName: e.target.value
							}),
							placeholder: "مثال: أحمد محمد",
							required: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "البريد الإلكتروني"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							type: "email",
							value: form.email,
							onChange: (e) => setForm({
								...form,
								email: e.target.value
							}),
							placeholder: "teacher@example.com"
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "salary",
							children: "الراتب الشهري"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "salary",
							type: "number",
							min: 0,
							step: 100,
							value: form.salary,
							onChange: (e) => setForm({
								...form,
								salary: Number(e.target.value)
							}),
							placeholder: "5000"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							className: "w-full",
							size: "lg",
							disabled: saving,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), saving ? "جارٍ الإضافة..." : "إضافة مدرس"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 lg:grid-cols-2",
				children: db.teachers.map((teacher) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "surface-card rounded-xl border bg-card p-5 shadow-sm transition-all hover:shadow-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex h-14 w-14 items-center justify-center rounded-full bg-primary/10",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-7 w-7 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-lg font-bold",
									children: teacher.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: "مدرس"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-2 text-sm text-muted-foreground md:grid-cols-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["📞 ", teacher.phone || "--"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["📧 ", teacher.email || "--"] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"💰 ",
											teacher.salary?.toLocaleString(),
											" ج.م"
										] })
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => openEditTeacher(teacher),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-2 h-4 w-4" }), "تعديل"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "destructive",
									size: "icon",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, { children: "حذف المدرس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, { children: [
								"هل تريد حذف",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
									" ",
									teacher.fullName,
									" "
								] }),
								"؟",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"لا يمكن التراجع عن هذه العملية."
							] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, { children: "إلغاء" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
								onClick: async () => {
									try {
										await api.removeTeacher(teacher.id);
										toast.success("تم حذف المدرس");
									} catch (err) {
										toast.error(err.message);
									}
								},
								children: "حذف"
							})] })] })] })]
						})]
					})
				}, teacher.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editingTeacher,
				onOpenChange: (open) => !open && setEditingTeacher(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "تعديل بيانات المدرس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "قم بتعديل البيانات ثم اضغط حفظ." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "اسم المدرس" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editForm.fullName,
										onChange: (e) => setEditForm({
											...editForm,
											fullName: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "البريد الإلكتروني" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "email",
										value: editForm.email,
										onChange: (e) => setEditForm({
											...editForm,
											email: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "رقم الهاتف" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: editForm.phone,
										onChange: (e) => setEditForm({
											...editForm,
											phone: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "الراتب" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: editForm.salary,
										onChange: (e) => setEditForm({
											...editForm,
											salary: Number(e.target.value)
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setEditingTeacher(null),
								children: "إلغاء"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => void updateTeacher(),
								disabled: updating,
								children: updating ? "جارٍ الحفظ..." : "حفظ التعديلات"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { TeachersPage as component };
