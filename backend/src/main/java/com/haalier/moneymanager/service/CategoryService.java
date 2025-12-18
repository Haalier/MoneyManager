package com.haalier.moneymanager.service;

import com.haalier.moneymanager.dto.CategoryDTO;
import com.haalier.moneymanager.entity.CategoryEntity;
import com.haalier.moneymanager.entity.ProfileEntity;
import com.haalier.moneymanager.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final ProfileService profileService;
    private final CategoryRepository categoryRepository;


    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();

        if (categoryRepository.existsByNameAndProfileId(categoryDTO.getName(), profile.getId())) {
            throw new RuntimeException("Category already exists.");
        }
        ;

        CategoryEntity newCategory = toEntity(categoryDTO, profile);
        newCategory = categoryRepository.save(newCategory);
        return toDTO(newCategory);
    }

    public List<CategoryDTO> getCategoriesForCurrentUser() {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categories = categoryRepository.findByProfileId(profile.getId());
        return categories.stream().map(this::toDTO).toList();
    }


    public List<CategoryDTO> getCategoriesByTypeForCurrentUser(String type) {
        ProfileEntity profile = profileService.getCurrentProfile();
        List<CategoryEntity> categories = categoryRepository.findByTypeAndProfileId(type, profile.getId());
        return categories.stream().map(this::toDTO).toList();
    }

    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        ProfileEntity profile = profileService.getCurrentProfile();
        CategoryEntity categoryToUpdate =
                categoryRepository.findByIdAndProfileId(categoryId, profile.getId())
                        .orElseThrow(() -> new RuntimeException("Category not found or not accessible."));
        categoryToUpdate.setName(categoryDTO.getName());
        categoryToUpdate.setIcon(categoryDTO.getIcon());
        categoryToUpdate.setType(categoryDTO.getType());
        categoryToUpdate = categoryRepository.save(categoryToUpdate);
        return toDTO(categoryToUpdate);
    }

    // helper methods
    private CategoryEntity toEntity(CategoryDTO categoryDTO, ProfileEntity profile) {
        return CategoryEntity.builder()
                .name(categoryDTO.getName())
                .type(categoryDTO.getType())
                .icon(categoryDTO.getIcon())
                .profile(profile)
                .build();
    }

    private CategoryDTO toDTO(CategoryEntity category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .profileId(category.getProfile() != null ? category.getProfile().getId() : null)
                .name(category.getName())
                .icon(category.getIcon())
                .type(category.getType())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
