package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.ExpenseDTO;
import com.haalier.moneymanager.entity.CategoryEntity;
import com.haalier.moneymanager.entity.ExpenseEntity;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.CategoryRepository;
import com.haalier.moneymanager.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

        ExpenseEntity newExpense =  toEntity(dto, profile, category);
        expenseRepository.save(newExpense);

        return toDTO(newExpense);
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
