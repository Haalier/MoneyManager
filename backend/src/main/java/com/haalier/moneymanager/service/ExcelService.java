package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.ExpenseDTO;
import com.haalier.moneymanager.dto.IncomeDTO;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.OutputStream;
import java.util.List;

@Service
public class ExcelService {

    public void writeIncomesToExcel(OutputStream os, List<IncomeDTO> incomes) throws IOException {
        try(Workbook workbook = new XSSFWorkbook()) {
           Sheet sheet = workbook.createSheet("Incomes");
           Row header = sheet.createRow(0);
           header.createCell(0).setCellValue("S.No");
           header.createCell(1).setCellValue("Name");
           header.createCell(2).setCellValue("Category");
           header.createCell(3).setCellValue("Amount");
           header.createCell(4).setCellValue("Date");
           for (int i=0; i < incomes.size(); i++) {
               IncomeDTO income = incomes.get(i);
               Row row = sheet.createRow(i + 1);
               row.createCell(0).setCellValue(i + 1);
               row.createCell(1).setCellValue(income.getName() != null ? income.getName() : "N/A");
               row.createCell(2).setCellValue(income.getCategoryName() != null ? income.getCategoryName() : "N/A");
               row.createCell(3).setCellValue(income.getAmount() != null ? income.getAmount().doubleValue() : 0);
               row.createCell(4).setCellValue(income.getDate() != null ? income.getDate().toString() : "N/A");
           }
            workbook.write(os);
        }
    }
    public void writeExpensesToExcel(OutputStream os, List<ExpenseDTO> expenses) throws IOException {
        try(Workbook workbook = new XSSFWorkbook()) {
           Sheet sheet = workbook.createSheet("Expenses");
           Row header = sheet.createRow(0);
           header.createCell(0).setCellValue("S.No");
           header.createCell(1).setCellValue("Name");
           header.createCell(2).setCellValue("Category");
           header.createCell(3).setCellValue("Amount");
           header.createCell(4).setCellValue("Date");
           for (int i=0; i < expenses.size(); i++) {
               ExpenseDTO expense = expenses.get(i);
               Row row = sheet.createRow(i + 1);
               row.createCell(0).setCellValue(i + 1);
               row.createCell(1).setCellValue(expense.getName() != null ? expense.getName() : "N/A");
               row.createCell(2).setCellValue(expense.getCategoryName() != null ? expense.getCategoryName() : "N/A");
               row.createCell(3).setCellValue(expense.getAmount() != null ? expense.getAmount().doubleValue() : 0);
               row.createCell(4).setCellValue(expense.getDate() != null ? expense.getDate().toString() : "N/A");
           }
            workbook.write(os);
        }
    }
}
