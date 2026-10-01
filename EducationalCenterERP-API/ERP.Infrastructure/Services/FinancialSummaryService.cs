using ERP.Application.DTOs.Financial;
using ERP.Application.Interfaces;
using ERP.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infrastructure.Services
{
    public class FinancialSummaryService : IFinancialSummaryService
    {
        private readonly ERPDbContext _context;


        public FinancialSummaryService(ERPDbContext context)
        {
            _context = context;
        }



        public async Task<FinancialSummaryDto> GetSummaryAsync()
        {

            // مدفوعات الطلاب
            var studentPayments = await _context.Payments
                .SumAsync(x => x.Amount);



            // الإيرادات الأخرى
            var otherPayments = await _context.OtherPayments
                .SumAsync(x => x.Amount);



            // المصروفات
            var expenses = await _context.Expenses
                .SumAsync(x => x.Amount);



            var totalIncome = studentPayments + otherPayments;


            var balance = totalIncome - expenses;



            return new FinancialSummaryDto
            {
                StudentPayments = studentPayments,

                OtherPayments = otherPayments,


                TotalIncome = totalIncome,


                TotalExpenses = expenses,


                CurrentBalance = balance
            };
        }
    }
}