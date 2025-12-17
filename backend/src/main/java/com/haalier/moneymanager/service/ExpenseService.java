package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.ExpenseDTO;
import com.haalier.moneymanager.entity.CategoryEntity;
import com.haalier.moneymanager.entity.ExpenseEntity;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.CategoryRepository;
import com.haalier.moneymanager.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    public ExpenseDTO addExpense(ExpenseDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found."));

        if (dto.getAmount() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount cannot be null.");
        }

        if (dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount cannot be negative.");
        }

        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new RuntimeException("Name cannot be empty.");
        }

        ExpenseEntity newExpense = toEntity(dto, profile, category);
        expenseRepository.save(newExpense);

        return toDTO(newExpense);
    }

    // Get all expenses for current user and month based on the start date and end date
    public List<ExpenseDTO> getCurrentMonthExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate date = LocalDate.now();
        LocalDate startOfMonth = date.withDayOfMonth(1);
        LocalDate endOfMonth = date.withDayOfMonth(date.lengthOfMonth());
        return expenseRepository.findByProfileIdAndDateBetween(profile.getId(), startOfMonth, endOfMonth).stream()
                .map(this::toDTO).toList();

    }


    // Get latest 5 expenses for current user
    public List<ExpenseDTO> getLatestFiveExpensesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<ExpenseEntity> newEntity = expenseRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());
        return newEntity.stream().map(this::toDTO).toList();
    }

    // Get total expenses for current user
    public BigDecimal getTotalExpenseForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = expenseRepository.findTotalExpenseByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    // Delete expense by id
    public void deleteExpense(Long expenseId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        ExpenseEntity expense = expenseRepository.findById(expenseId).orElseThrow(() -> new RuntimeException("Expense" +
                " not found."));
        if (!expense.getProfile().equals(profile)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this expense.");
        }
        expenseRepository.delete(expense);
    }

    // Helper methods
    private ExpenseEntity toEntity(ExpenseDTO dto, ProfileEntity profile, CategoryEntity category) {
        return ExpenseEntity.builder().id(dto.getId()).name(dto.getName()).icon(dto.getIcon()).date(dto.getDate())
                .amount(dto.getAmount()).createdAt(dto.getCreatedAt()).updatedAt(dto.getUpdatedAt()).category(category)
                .profile(profile).build();
    }

    private ExpenseDTO toDTO(ExpenseEntity expense) {
        return ExpenseDTO.builder()
                .id(expense.getId()).name(expense.getName()).icon(expense.getIcon())
                .categoryName(expense.getCategory() != null ? expense.getCategory().getName() : null)
                .categoryId(expense.getCategory() != null ? expense.getCategory().getId() : null)
                .amount(expense.getAmount()).date(expense.getDate())
                .createdAt(expense.getCreatedAt()).updatedAt(expense.getUpdatedAt()).build();
    }
}
