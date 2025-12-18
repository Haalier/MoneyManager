package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.ExpenseDTO;
import com.haalier.moneymanager.dto.IncomeDTO;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.ProfileRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final ProfileRepository profileRepository;
    private final EmailService emailService;
    private final ExpenseService expenseService;
    private final IncomeService incomeService;

    @Value("${money.manager.frontend.url}")
    private String frontendUrl;

    @Scheduled(cron = "0 0 18 * * *", zone = "Europe/Warsaw")
    public void sendDailyIncomeExpenseReminder() {
        log.info("Job started: sendDailyIncomeExpenseReminder");
        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {
            List<ExpenseDTO> todayExpenses = expenseService.getExpensesForUserOnDate(profile.getId(),
                    LocalDate.now(ZoneId.of("Europe/Warsaw")));
            List<IncomeDTO> todayIncomes = incomeService.getIncomesForUserOnDate(profile.getId(),
                    LocalDate.now(ZoneId.of("Europe/Warsaw")));

            if (todayExpenses.isEmpty() && todayIncomes.isEmpty()) {
                String body = "Hi " + profile.getFullName() + ",<br><br>" + "This is a daily reminder to add your income " +
                        "and expenses for today in Money Manager.<br><br>" + "<a href=" + frontendUrl + "style='display" +
                        ":inline-block;padding:10px 20px;background-color:#4CAF50;color:#fff;text-decoration:none;" +
                        "border-radius:5px;font-weight:bold;'>Go to Money Manager</a>" + "<br><br>Thanks,<br>Money " +
                        "Manager Team";
                emailService.sendEmail(profile.getEmail(), "Daily reminde: Add your income and expenses", body);

            }
        }
        log.info("Job finished: sendDailyIncomeExpenseReminder");
    }

    @Scheduled(cron = "0 0 22 * * *", zone = "Europe/Warsaw")
    @Transactional
    public void sendDailyExpenseSummary() {
        log.info("Job started: sendDailyExpenseSummary");
        List<ProfileEntity> profiles = profileRepository.findAll();

        for (ProfileEntity profile : profiles) {
            List<ExpenseDTO> todayExpenses = expenseService.getExpensesForUserOnDate(profile.getId(),
                    LocalDate.now(ZoneId.of("Europe/Warsaw")));
            if (todayExpenses != null) {
                StringBuilder table = new StringBuilder();
                table.append("<table style='border-collapse:collapse;width:100%;'>");
                table.append("<tr style='background-color:#f2f2f2;'><th " +
                        "style='border:1px solid #ddd;padding:8px;'>Lp.</th><th style='border:1px " +
                        "solid #ddd;padding:8px;'>Name</th><th style='border:1px solid #ddd;padding:8px;" +
                        "'>Amount</th><th style='border:1px solid #ddd;padding:8px;'>Category</th></tr>");
                int i = 1;
                System.out.println("size " + todayExpenses.size());
                if (todayExpenses.isEmpty()) {
                    table.append("<tr><td colspan='4' style='text-align:center;padding:40px 20px;font-size:20px;" +
                            "color:#666666;background-color:#f9f9f9;border:1px solid #e0e0e0;'>No expenses for " +
                            "today<br><small style='color:#999;font-size:14px;'>Great job keeping " +
                            "your spending under control!</small></td></tr>");
                } else {
                    for (ExpenseDTO expense : todayExpenses) {
                        table.append("<tr>");
                        table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(i++).append("</td>");
                        table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getName())
                                .append("</td>");
                        table.append("<td style='border:1px solid #ddd;padding:8px;'>").append(expense.getAmount())
                                .append("</td>");
                        table.append("<td style='border:1px solid #ddd;padding:8px;'>")
                                .append(expense.getCategoryId() != null ? expense.getCategoryName() : "N/A").append(
                                        "</td>");
                        table.append("</tr>");
                    }
                }


                table.append("</table>");
                String body = "Hi " + profile.getFullName() + ", <br><br> Here is a summary of your today's " +
                        "expenses:<br><br>" + table + "<br><br>Thanks,<br>Money Manager Team";

                emailService.sendEmail(profile.getEmail(), "Daily summary: Expenses for today", body);
            }
        }
        log.info("Job finished: sendDailyExpenseSummary");
    }
}
