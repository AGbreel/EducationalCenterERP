// طبقة البيانات: مربوطة بالـ API الحقيقي (endpoints الـ Swagger).
import { asArray, field, request, setToken, getToken } from "./api-client";

export interface Student {
  id: string;
  code: string;
  fullName: string;
  phone: string;
  parentPhone: string;
  address: string;
  school: string;
  grade: string;
  createdAt: string;
}
export type Teacher = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  salary: number;
};
/** يقابل /api/classes في الـ API (مادة + مدرس + سعر). */
export type Subject = { id: string; name: string; description: string };
// export type Subject = { id: string; name: string; price: number; teacherId: string };
export type Attendance = {
  id: string;
  studentId: string;
  studentName: string;
  courseClassId: string;
  className: string;
  attendanceDate: string;
  status: string;
};
export type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  studentClassId: string;
  courseClassId: string;
  className: string;
  subjectName: string;
  teacherName: string;
  amount: number;
  month: number;
  year: number;
  paymentType: "Monthly" | "Session";
  sessionsCount: number | null;
  paymentMethod: string;
  notes: string;
  paymentDate: string;
};
export type Expense = {
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
export type CreateExpenseDto = {
  payerName: string;
  reason: string;
  category?: string | null;
  amount: number;
  paymentDate: string;
  eventDate?: string | null;
  notes?: string | null;
};
export type OtherIncome = {
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
export type CreateOtherIncomeDto = {
  payerName: string;
  reason: string;
  category?: string | null;
  amount: number;
  paymentDate: string;
  eventDate?: string | null;
  notes?: string | null;
};
export type courseClasses = {
  id: string;
  name: string;
  subjectId?: string;
  subject: string;
  teacherId?: string;
  teacher: string;
  day: string;
  startTime: string;
  endTime: string;
  hall: string;
  maxStudents: number;
  currentStudents: number;
};
export type Enrollment = {
  id: string;
  studentId: string;
  studentName?: string;
  courseClassId: string;
  className: string;
  monthlyFee: number;
  enrollmentDate?: string;
  isActive?: boolean;
};
export type StudentClassLookup = {
  courseClassId: string;
  className: string;
  subject: string;
  teacher: string;
};
export type StudentAttendanceLookup = {
  studentId: string;
  studentName: string;
  studentCode: string;
  classes: StudentClassLookup[];
};
export type FinancialSummary = {
  studentPayments: number;
  otherPayments: number;
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
};
export type DB = {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  enrollments: Enrollment[];
  attendance: Attendance[];
  payments: Payment[];
  courseClasses: courseClasses[];
  financialSummary: FinancialSummary;
};
export const emptyDb: DB = {
  students: [],
  teachers: [],
  subjects: [],
  enrollments: [],
  attendance: [],
  payments: [],
  courseClasses: [],
  financialSummary: {
    studentPayments: 0,
    otherPayments: 0,
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
  },
};

const str = (v: unknown, fallback = "") =>
  v === undefined || v === null ? fallback : String(v);
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

function toStudent(data: any): Student {
  return {
    id: data.id,
    code: data.studentCode,
    fullName: data.fullName,

    phone: data.phone ?? "",
    parentPhone: data.parentPhone ?? "",
    address: data.address ?? "",
    school: data.school ?? "",
    grade: data.grade ?? "",

    createdAt: data.createdAt,
  };
}
function toTeacher(raw: unknown): Teacher {
  return {
    id: str(field(raw, "id", "teacherId")),
    fullName: str(field(raw, "fullName", "fullName")),
    phone: str(field(raw, "phone", "phoneNumber")),
    email: str(field(raw, "email")),
    salary: num(field(raw, "salary")),
  };
}
function toSubject(raw: unknown): Subject {
  return {
    id: str(field(raw, "id", "classId")),
    name: str(field(raw, "name", "className", "subjectName")),
    description: str(
      field(raw, "description", "classDescription", "subjectDescription"),
    ),
  };
}
function toAttendance(raw: unknown): Attendance {
  return {
    id: str(field(raw, "id")),
    studentId: str(field(raw, "studentId")),
    studentName: str(field(raw, "studentName")),
    courseClassId: str(field(raw, "courseClassId")),
    className: str(field(raw, "className")),
    attendanceDate: str(field(raw, "attendanceDate")),
    status: str(field(raw, "status")),
  };
}
function toPayment(raw: unknown): Payment {
  return {
    id: str(field(raw, "id")),

    studentId: str(field(raw, "studentId")),
    studentName: str(field(raw, "studentName")),

    studentClassId: str(field(raw, "studentClassId")),

    courseClassId: str(field(raw, "courseClassId")),

    className: str(field(raw, "className")),

    subjectName: str(field(raw, "subjectName")),

    teacherName: str(field(raw, "teacherName")),

    amount: num(field(raw, "amount")),

    month: num(field(raw, "month")),

    year: num(field(raw, "year")),

    paymentType: str(field(raw, "paymentType")) as "Monthly" | "Session",

    sessionsCount:
      field(raw, "sessionsCount") == null
        ? null
        : num(field(raw, "sessionsCount")),

    paymentMethod: str(field(raw, "paymentMethod")),

    notes: str(field(raw, "notes")),

    paymentDate: str(field(raw, "paymentDate")),
  };
}
function toEnrollment(raw: unknown): Enrollment {
  return {
    id: str(field(raw, "id")),

    studentId: str(field(raw, "studentId")),
    studentName: str(field(raw, "studentName")),

    courseClassId: str(field(raw, "courseClassId")),
    className: str(field(raw, "className")),

    monthlyFee: num(field(raw, "monthlyFee")),

    enrollmentDate: str(field(raw, "enrollmentDate")),

    isActive:
      field(raw, "isActive") === undefined
        ? true
        : Boolean(field(raw, "isActive")),
  };
}
function toStudentAttendanceLookup(raw: unknown): StudentAttendanceLookup {
  return {
    studentId: str(field(raw, "studentId")),
    studentName: str(field(raw, "studentName")),
    studentCode: str(field(raw, "studentCode")),

    classes: asArray(field(raw, "classes")).map((c) => ({
      courseClassId: str(field(c, "courseClassId")),
      className: str(field(c, "className")),
      subject: str(field(c, "subject")),
      teacher: str(field(c, "teacher")),
    })),
  };
}
function toCourseClass(raw: unknown): courseClasses {
  return {
    id: str(field(raw, "id")),
    name: str(field(raw, "name")),

    subjectId: str(field(raw, "subjectId")),
    subject: str(field(raw, "subject")),

    teacherId: str(field(raw, "teacherId")),
    teacher: str(field(raw, "teacher")),

    day: str(field(raw, "day")),
    startTime: str(field(raw, "startTime")),
    endTime: str(field(raw, "endTime")),

    hall: str(field(raw, "hall")),

    maxStudents: num(field(raw, "maxStudents")),
    currentStudents: num(field(raw, "currentStudents")),
  };
}
function toExpense(raw: unknown): Expense {
  return {
    id: str(field(raw, "id")),
    payerName: str(field(raw, "payerName")),
    reason: str(field(raw, "reason")),
    category:
      field(raw, "category") == null ? null : str(field(raw, "category")),
    amount: num(field(raw, "amount")),
    paymentDate: str(field(raw, "paymentDate")),
    eventDate:
      field(raw, "eventDate") == null ? null : str(field(raw, "eventDate")),
    notes: field(raw, "notes") == null ? null : str(field(raw, "notes")),
    createdAt: str(field(raw, "createdAt")),
  };
}
function toOtherIncome(raw: unknown): OtherIncome {
  return {
    id: str(field(raw, "id")),
    payerName: str(field(raw, "payerName")),
    reason: str(field(raw, "reason")),
    category:
      field(raw, "category") == null ? null : str(field(raw, "category")),
    amount: num(field(raw, "amount")),
    paymentDate: str(field(raw, "paymentDate")),
    eventDate:
      field(raw, "eventDate") == null ? null : str(field(raw, "eventDate")),
    notes: field(raw, "notes") == null ? null : str(field(raw, "notes")),
    createdAt: str(field(raw, "createdAt")),
  };
}

const list = async <T>(
  path: string,
  map: (raw: unknown) => T,
): Promise<T[]> => {
  try {
    return asArray(await request<unknown>(path)).map(map);
  } catch {
    return [];
  }
};

/** يحمّل كل البيانات من الـ API. */
export async function fetchDb(): Promise<DB> {
  const [
    students,
    teachers,
    subjects,
    courseClasses,
    payments,
    financialSummary,
  ] = await Promise.all([
    list("/students", toStudent),
    list("/teachers", toTeacher),
    list("/subjects", toSubject),
    list("/classes", toCourseClass),
    list("/payments", toPayment),
    request<FinancialSummary>("/financial/summary"),
  ]);

  const [enrollmentsNested, attendanceNested] = await Promise.all([
    Promise.all(
      students.map((s) =>
        list(`/student-classes/student/${s.id}`, toEnrollment),
      ),
    ),
    Promise.all(
      students.map((s) => list(`/attendance/student/${s.id}`, toAttendance)),
    ),
  ]);

  const enrollments = enrollmentsNested.flatMap((rows, idx) =>
    rows.map((row, i) => ({
      ...row,
      id: row.id || `enr-${idx}-${i}`,
      studentId: row.studentId || (students[idx]?.id ?? ""),
    })),
  );

  const attendance = attendanceNested.flatMap((rows, idx) =>
    rows.map((row, i) => ({
      ...row,
      id: row.id || `att-${idx}-${i}`,
      studentId: row.studentId || (students[idx]?.id ?? ""),
    })),
  );

  return {
    students,
    teachers,
    subjects,
    enrollments,
    attendance,
    payments,
    courseClasses,
    financialSummary,
  };
}

const changed = () => window.dispatchEvent(new Event("db-change"));
export const helpers = {
  getStudentEnrollments(db: DB, studentId: string) {
    return db.enrollments.filter((e) => e.studentId === studentId);
  },

  getClassStudents(db: DB, classId: string) {
    return db.enrollments.filter((e) => e.courseClassId === classId);
  },

  getCourseClass(db: DB, id: string) {
    return db.courseClasses.find((c) => c.id === id);
  },
};

export const api = {
  async addStudent(
    input: Omit<Student, "id" | "code" | "createdAt">,
  ): Promise<Student> {
    const created = await request<unknown>("/students", {
      method: "POST",
      body: {
        fullName: input.fullName,
        phone: input.phone,
        parentPhone: input.parentPhone,
        address: input.address,
        school: input.school,
        grade: input.grade,
      },
    });

    changed();
    return toStudent(created ?? {});
  },
  async removeStudent(id: string) {
    await request(`/students/${id}`, { method: "DELETE" });
    changed();
  },
  async addTeacher(input: Omit<Teacher, "id">) {
    await request("/teachers", { method: "POST", body: input });
    changed();
  },
  async updateTeacher(
    id: string,
    input: Omit<Teacher, "id">,
  ): Promise<Teacher> {
    const updated = await request<unknown>(`/teachers/${id}`, {
      method: "PUT",
      body: {
        fullName: input.fullName,
        phone: input.phone,
        email: input.email,
        salary: input.salary,
      },
    });

    changed();

    return toTeacher(updated ?? {});
  },
  async removeTeacher(id: string) {
    await request(`/teachers/${id}`, { method: "DELETE" });
    changed();
  },
  async addSubject(input: Omit<Subject, "id">) {
    await request("/subjects", {
      method: "POST",
      body: { name: input.name, description: input.description },
    });
    changed();
  },
  async removeSubject(id: string) {
    await request(`/subjects/${id}`, { method: "DELETE" });
    changed();
  },
  async enrollStudent(
    studentId: string,
    courseClassId: string,
    monthlyFee: number,
  ) {
    await request("/student-classes", {
      method: "POST",
      body: {
        studentId,
        courseClassId,
        monthlyFee,
      },
    });

    changed();
  },
  async unenroll(id: string) {
    await request(`/student-classes/${id}`, {
      method: "DELETE",
    });

    changed();
  },
  async markAttendance(studentId: string, courseClassId: string) {
    await request("/attendance", {
      method: "POST",
      body: {
        studentId,
        courseClassId,
      },
    });

    changed();
  },
  async getAttendance() {
    return list("/attendance", toAttendance);
  },
  async deleteAttendance(id: string) {
    await request(`/attendance/${id}`, {
      method: "DELETE",
    });

    changed();
  },
  async addPayment(input: {
    studentId: string;

    studentClassId: string;

    amount: number;

    month: number;

    year: number;

    paymentType: "Monthly" | "Session";

    sessionsCount?: number;

    paymentMethod: string;

    notes?: string;
  }) {
    await request("/payments", {
      method: "POST",
      body: input,
    });

    changed();
  },
  async removePayment(id: string) {
    await request(`/payments/${id}`, {
      method: "DELETE",
    });

    changed();
  },
  async findByQrValue(code: string): Promise<Student | null> {
    try {
      const found = await request<unknown>(
        `/students/qr/${encodeURIComponent(code.trim())}`,
      );
      if (!found) return null;
      const rows = Array.isArray(found) ? found : null;
      return toStudent(rows ? rows[0] : found);
    } catch {
      return null;
    }
  },
  async findByStudentID(id: string): Promise<Student | null> {
    try {
      const found = await request<unknown>(
        `/students/${encodeURIComponent(id.trim())}`,
      );
      if (!found) return null;
      const rows = Array.isArray(found) ? found : null;
      return toStudent(rows ? rows[0] : found);
    } catch {
      return null;
    }
  },
  async findByStudentCode(code: string): Promise<Student | null> {
    try {
      const found = await request<unknown>(
        `/students/code/${encodeURIComponent(code.trim())}`,
      );

      return toStudent(found);
    } catch {
      return null;
    }
  },
  async getStudentClassesByCode(
    code: string,
  ): Promise<StudentAttendanceLookup | null> {
    try {
      const result = await request<unknown>(
        `/students/code/${encodeURIComponent(code.trim())}/classes`,
      );

      return toStudentAttendanceLookup(result);
    } catch {
      return null;
    }
  },
  async getStudentClassesByQr(
    qr: string,
  ): Promise<StudentAttendanceLookup | null> {
    try {
      const result = await request<unknown>(
        `/students/qr/${encodeURIComponent(qr.trim())}/classes`,
      );

      return toStudentAttendanceLookup(result);
    } catch {
      return null;
    }
  },
  async addClass(input: {
    name: string;
    subjectId: string;
    teacherId: string;
    day: string;
    startTime: string;
    endTime: string;
    hall: string;
    maxStudents: number;
  }) {
    await request("/classes", {
      method: "POST",
      body: input,
    });

    changed();
  },
  async updateClass(
    id: string,
    input: {
      name: string;
      subjectId: string;
      teacherId: string;
      day: string;
      startTime: string;
      endTime: string;
      hall: string;
      maxStudents: number;
    },
  ) {
    await request(`/classes/${id}`, {
      method: "PUT",
      body: input,
    });

    changed();
  },
  async getClassById(id: string): Promise<courseClasses> {
    const result = await request<unknown>(`/classes/${id}`, {
      method: "GET",
    });

    return toCourseClass(result);
  },
  async removeClass(id: string) {
    await request(`/classes/${id}`, {
      method: "DELETE",
    });

    changed();
  },
  async getStudentClasses(studentId: string) {
    return list(`/student-classes/student/${studentId}`, toEnrollment);
  },
  async getClasses() {
    return list("/classes", toCourseClass);
  },
  async income(): Promise<number> {
    return await request<number>("/payments/income");
  },
  async getStudentPayments(studentId: string) {
    return list(`/payments/student/${studentId}`, toPayment);
  },
  async getStudentClassPayments(studentClassId: string) {
    return list(`/payments/student-class/${studentClassId}`, toPayment);
  },
  async getExpenses(): Promise<Expense[]> {
    return list("/expenses", toExpense);
  },
  async addExpense(dto: CreateExpenseDto): Promise<Expense> {
    const created = await request<unknown>("/expenses", {
      method: "POST",
      body: dto,
    });

    changed();

    return toExpense(created ?? {});
  },
  async removeExpense(id: string) {
    await request(`/expenses/${id}`, {
      method: "DELETE",
    });

    changed();
  },
  async getExpensesTotal(): Promise<number> {
    const result = await request<unknown>("/expenses/total");

    return num(field(result, "totalExpenses"));
  },
  async getOtherIncomes(): Promise<OtherIncome[]> {
    return list("/other-income", toOtherIncome);
  },
  async addOtherIncome(dto: CreateOtherIncomeDto): Promise<OtherIncome> {
    const created = await request<unknown>("/other-income", {
      method: "POST",
      body: dto,
    });

    changed();

    return toOtherIncome(created ?? {});
  },
  async removeOtherIncome(id: string) {
    await request(`/other-income/${id}`, {
      method: "DELETE",
    });

    changed();
  },
};

const AUTH_KEY = "edu-center-auth";
export const auth = {
  async login(userName: string, password: string) {
    const res = await request<unknown>("/auth/login", {
      method: "POST",
      body: { userName, password },
      auth: false,
    });
    const token =
      field<string>(res, "token", "accessToken", "jwt") ??
      field<string>(field(res, "data"), "token", "accessToken");
    if (!token) return false;
    setToken(token);
    window.localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        userName: str(field(res, "userName"), userName),
        at: Date.now(),
      }),
    );
    return true;
  },
  logout() {
    setToken(null);
    window.localStorage.removeItem(AUTH_KEY);
  },
  current(): { userName: string } | null {
    if (typeof window === "undefined") return null;
    if (!getToken()) return null;
    const raw = window.localStorage.getItem(AUTH_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { userName: string };
    } catch {
      return null;
    }
  },
};
