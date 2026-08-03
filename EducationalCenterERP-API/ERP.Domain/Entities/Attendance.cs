using ERP.Domain.Common;


namespace ERP.Domain.Entities;


public class Attendance : BaseEntity
{

    public Guid StudentId { get; set; }


    public Student Student { get; set; }



    public Guid CourseClassId { get; set; }


    public CourseClass CourseClass { get; set; }



    public DateTime AttendanceDate { get; set; }


    public string Status { get; set; } = "Present";

}