package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.IncomeDTO;
import com.haalier.moneymanager.entity.CategoryEntity;
import com.haalier.moneymanager.entity.IncomeEntity;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.CategoryRepository;
import com.haalier.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;

    public IncomeDTO addIncome(IncomeDTO dto) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found."));
        IncomeEntity newIncome = toEntity(dto, profile, category);
        incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    // Helper methods
    private IncomeEntity toEntity(IncomeDTO dto, ProfileEntity profile, CategoryEntity category) {
        return IncomeEntity.builder().id(dto.getId()).name(dto.getName()).icon(dto.getIcon()).date(dto.getDate())
                .amount(dto.getAmount()).createdAt(dto.getCreatedAt()).updatedAt(dto.getUpdatedAt()).category(category)
                .profile(profile).build();
    }

    private IncomeDTO toDTO(IncomeEntity income) {
        return IncomeDTO.builder()
                .id(income.getId()).name(income.getName()).icon(income.getIcon())
                .categoryName(income.getCategory() != null ? income.getCategory().getName() : null)
                .categoryId(income.getCategory() != null ? income.getCategory().getId() : null)
                .amount(income.getAmount()).date(income.getDate())
                .createdAt(income.getCreatedAt()).updatedAt(income.getUpdatedAt()).build();
    }
}
