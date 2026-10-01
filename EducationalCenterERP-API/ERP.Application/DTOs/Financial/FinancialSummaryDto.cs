using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ERP.Application.DTOs.Financial
{
    public class FinancialSummaryDto
    {
        // مدفوعات الطلاب
        public decimal StudentPayments { get; set; }

        // الإيرادات الأخرى
        public decimal OtherPayments { get; set; }


        // إجمالي الداخل
        public decimal TotalIncome { get; set; }


        // إجمالي الخارج
        public decimal TotalExpenses { get; set; }


        // المتبقي في السنتر
        public decimal CurrentBalance { get; set; }
    }
}