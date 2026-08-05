// طبقة البيانات: مربوطة بالـ API الحقيقي (endpoints الـ Swagger).
import { asArray, field, request, setToken, getToken } from "./api-client";

export type Student = {
  id: string;
  fullName: string;
  phone: string;
  grade: string;
  code: string;
  createdAt: string;
};
export type Teacher = { id: string; fullName: string; phone: string };
/** يقابل /api/classes في الـ API (مادة + مدرس + سعر). */
export type Subject = { id: string; name: string; description: string };
// export type Subject = { id: string; name: string; price: number; teacherId: string };
export type Attendance = {
  id: string;
  studentId: string;
  courseClassId: string;
  attendanceDate: string;
  status: string;
};
export type Payment = {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  month: number;
  year: number;
  paymentMethod: string;
  status: string;
  paymentDate: string;
  notes?: string;
};
export type CourseClass = {
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
export type DB = {
  students: Student[];
  teachers: Teacher[];
  subjects: Subject[];
  enrollments: Enrollment[];
  attendance: Attendance[];
  payments: Payment[];
  courseClasses: CourseClass[];
};
export const emptyDb: DB = {
  students: [],
  teachers: [],
  subjects: [],
  enrollments: [],
  attendance: [],
  payments: [],
  courseClasses: [],
};

const str = (v: unknown, fallback = "") =>
  v === undefined || v === null ? fallback : String(v);
const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);

function toStudent(raw: unknown): Student {
  return {
    id: str(field(raw, "id", "studentId")),
    fullName: str(field(raw, "fullName", "fullName")),
    phone: str(field(raw, "phone", "phoneNumber")),
    grade: str(field(raw, "grade", "level", "gradeName")),
    code: str(field(raw, "code", "qrCode", "studentCode")),
    createdAt: str(
      field(raw, "createdAt", "createdOn"),
      new Date().toISOString(),
    ),
  };
}
function toTeacher(raw: unknown): Teacher {
  return {
    id: str(field(raw, "id", "teacherId")),
    fullName: str(field(raw, "fullName", "fullName")),
    phone: str(field(raw, "phone", "phoneNumber")),
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
    id: str(field(raw, "id", "attendanceId")),
    studentId: str(field(raw, "studentId")),
    courseClassId: str(field(raw, "courseClassId", "classId")),
    attendanceDate: str(
      field(raw, "attendanceDate", "date"),
      new Date().toISOString(),
    ),
    status: str(field(raw, "status"), "Present"),
  };
}
function toPayment(raw: unknown): Payment {
  return {
    id: str(field(raw, "id")),
    studentId: str(field(raw, "studentId")),
    studentName: str(field(raw, "studentName")),
    amount: num(field(raw, "amount")),
    month: num(field(raw, "month")),
    year: num(field(raw, "year")),
    paymentMethod: str(field(raw, "paymentMethod")),
    status: str(field(raw, "status")),
    paymentDate: str(field(raw, "paymentDate")),
    notes: str(field(raw, "notes")),
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
function toCourseClass(raw: unknown): CourseClass {
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
  const [students, teachers, subjects, courseClasses] = await Promise.all([
    list("/students", toStudent),
    list("/teachers", toTeacher),
    list("/subjects", toSubject),
    list("/course-classes", toCourseClass),
  ]);

  const [enrollmentsNested, attendanceNested, payments] = await Promise.all([
    Promise.all(
      students.map((s) =>
        list(`/student-classes/student/${s.id}`, toEnrollment),
      ),
    ),
    Promise.all(
      students.map((s) => list(`/attendance/student/${s.id}`, toAttendance)),
    ),
    list("/payments", toPayment),
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
  async enroll(studentId: string, courseClassId: string, monthlyFee: number) {
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
  async addPayment(
    studentId: string,
    studentClassId: string,
    amount: number,
    paymentMethod = "Cash",
    notes = "",
  ) {
    const now = new Date();

    await request("/payments", {
      method: "POST",
      body: {
        studentId,
        studentClassId,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        amount,
        paymentMethod,
        notes,
      },
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
    await request("/course-classes", {
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
    await request(`/course-classes/${id}`, {
      method: "PUT",
      body: input,
    });

    changed();
  },
  async removeClass(id: string) {
    await request(`/course-classes/${id}`, {
      method: "DELETE",
    });

    changed();
  },
  async getStudentClasses(studentId: string) {
    return list(`/student-classes/student/${studentId}`, toEnrollment);
  },
  async getClasses() {
    return list("/course-classes", toCourseClass);
  },
  income() {
    return request<unknown>("/payments/income");
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
