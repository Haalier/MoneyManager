package com.haalier.moneymanager.controller;

import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailController {

    private final ExcelService excelService;
    private final IncomeService incomeService;
    private final ExpenseService expenseService;
    private final EmailService emailService;
    private final ProfileService profileService;

    @GetMapping("/income-excel")
    public ResponseEntity<Void> emailIncomeExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeIncomesToExcel(baos, incomeService.getCurrentMonthIncomesForCurrentUser());

        String emailBody = """
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2e7d32;">Your Income Excel Report</h2>
        <p>Hi!</p>
        <p>An Excel file with your income has been generated and added to the attachments below this message.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This message was generated automatically by the MoneyManager application.</p>
    </div>
    """;

        emailService.sendEmailWithAttachment(profile.getEmail(), "Your Income Excel Report", emailBody, baos.toByteArray(),
                "income.xlsx");
        return ResponseEntity.ok(null);
    }

    @GetMapping("/expense-excel")
    public ResponseEntity<Void> emailExpenseExcel() throws IOException {
        ProfileEntity profile = profileService.getCurrentProfile();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        excelService.writeExpensesToExcel(baos, expenseService.getCurrentMonthExpensesForCurrentUser());

        String emailBody = """
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2e7d32;">Your Expense Excel Report</h2>
        <p>Hi!</p>
        <p>An Excel file with your expenses has been generated and added to the attachments below this message.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #888;">This message was generated automatically by the MoneyManager application.</p>
    </div>
    """;

        emailService.sendEmailWithAttachment(profile.getEmail(), "Your Expenses Excel Report", emailBody,
                baos.toByteArray(),
                "expense.xlsx");
        return ResponseEntity.ok(null);
    }
}

