package com.haalier.moneymanager.controller;

import com.haalier.moneymanager.dto.ExpenseDTO;
import com.haalier.moneymanager.service.ExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    @PostMapping
    public ResponseEntity<ExpenseDTO> addExpense(@RequestBody ExpenseDTO dto) {
        ExpenseDTO saved = expenseService.addExpense(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getExpenses() {
        List<ExpenseDTO> expenses = expenseService.getCurrentMonthExpensesForCurrentUser();
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/latest")
    public ResponseEntity<List<ExpenseDTO>> getLatestFiveExpensesForCurrentUser() {
        List<ExpenseDTO> latestExpenses = expenseService.getLatestFiveExpensesForCurrentUser();
        return ResponseEntity.ok(latestExpenses);
    }

    @GetMapping("/total")
    public ResponseEntity<BigDecimal> getTotalExpenseForCurrentUser() {
        BigDecimal totalExpense = expenseService.getTotalExpenseForCurrentUser();
        return ResponseEntity.ok(totalExpense);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
