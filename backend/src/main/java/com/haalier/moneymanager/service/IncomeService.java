package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.ExpenseDTO;
import com.haalier.moneymanager.dto.IncomeDTO;
import com.haalier.moneymanager.entity.CategoryEntity;
import com.haalier.moneymanager.entity.ExpenseEntity;
import com.haalier.moneymanager.entity.IncomeEntity;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.CategoryRepository;
import com.haalier.moneymanager.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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

        if (dto.getAmount() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount cannot be null.");
        }

        if (dto.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Amount cannot be negative.");
        }

        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new RuntimeException("Name cannot be empty.");
        }

        IncomeEntity newIncome = toEntity(dto, profile, category);
        incomeRepository.save(newIncome);
        return toDTO(newIncome);
    }

    // Get all incomes for the current user and month based on the start date and end date
    public List<IncomeDTO> getCurrentMonthIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        LocalDate date = LocalDate.now();
        LocalDate startOfMonth = date.withDayOfMonth(1);
        LocalDate endOfMonth = date.withDayOfMonth(date.lengthOfMonth());
        return incomeRepository.findByProfileIdAndDateBetween(profile.getId(), startOfMonth, endOfMonth).stream()
                .map(this::toDTO).toList();

    }

    // Get total incomes for the current user
    public BigDecimal getTotalIncomeForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        BigDecimal total = incomeRepository.findTotalIncomeByProfileId(profile.getId());
        return total != null ? total : BigDecimal.ZERO;
    }

    // Get latest 5 incomes for current user
    public List<IncomeDTO> getLatestFiveIncomesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> newEntity = incomeRepository.findTop5ByProfileIdOrderByDateDesc(profile.getId());

        return newEntity.stream().map(this::toDTO).toList();
    }

    // Delete income by id
    public void deleteIncome(Long incomeId) {
        ProfileEntity profile = profileService.getCurrentProfile();
        IncomeEntity expense = incomeRepository.findById(incomeId)
                .orElseThrow(() -> new RuntimeException("Income not found."));
        if (!expense.getProfile().getId().equals(profile.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to delete this income.");
        }
        incomeRepository.delete(expense);
    }

    // Filter incomes
    public List<IncomeDTO> filterIncomes(LocalDate startDate, LocalDate endDate, String keyword, Sort sort){
        ProfileEntity profile = profileService.getCurrentProfile();
        List<IncomeEntity> entities =
                incomeRepository.findByProfileIdAndDateBetweenAndNameContainingIgnoreCase(profile.getId(), startDate, endDate, keyword, sort);
        return entities.stream().map(this::toDTO).toList();
    }

    // Notifications
    public boolean hasIncomesForUserOnDate(Long profileId, LocalDate date) {
        return incomeRepository.existByProfileIdAndDate(profileId, date);
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
