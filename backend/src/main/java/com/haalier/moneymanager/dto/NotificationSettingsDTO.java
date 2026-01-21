package com.haalier.moneymanager.dto;

import lombok.Data;

@Data
public class NotificationSettingsDTO {
    private boolean dailyReminderEnabled;
    private boolean dailySummaryEnabled;
}
