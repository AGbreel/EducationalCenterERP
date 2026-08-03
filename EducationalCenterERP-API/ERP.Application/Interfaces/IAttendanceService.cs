using ERP.Application.DTOs.Attendance;

namespace ERP.Application.Interfaces
{
    public interface IAttendanceService
    {
        Task<bool> MarkAttendanceAsync(CreateAttendanceDto dto);
        Task<List<AttendanceDto>> GetStudentAttendanceAsync(Guid studentId);
        Task<List<AttendanceDto>> GetClassAttendanceAsync(Guid classId);
    }
}