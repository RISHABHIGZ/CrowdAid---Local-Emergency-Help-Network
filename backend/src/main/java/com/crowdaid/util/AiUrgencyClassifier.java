package com.crowdaid.util;

import com.crowdaid.enums.EmergencyCategory;
import com.crowdaid.enums.UrgencyLevel;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;

/**
 * Lightweight AI-style urgency classifier.
 * Uses keyword weighting to predict severity score (0–100)
 * from emergency description + category + urgency level.
 *
 * In production this would delegate to an ML model or LLM API.
 */
@Component
public class AiUrgencyClassifier {

    private static final Map<String, Integer> KEYWORD_WEIGHTS = Map.ofEntries(
        Map.entry("unconscious",  30), Map.entry("not breathing", 35),
        Map.entry("bleeding",     20), Map.entry("severe",        15),
        Map.entry("critical",     20), Map.entry("trapped",       25),
        Map.entry("fire",         25), Map.entry("flood",         20),
        Map.entry("heart attack", 35), Map.entry("stroke",        30),
        Map.entry("accident",     20), Map.entry("blood",         15),
        Map.entry("urgent",       10), Map.entry("immediate",     10),
        Map.entry("help",          5), Map.entry("emergency",     10),
        Map.entry("collapse",     25), Map.entry("seizure",       30),
        Map.entry("dying",        35), Map.entry("broken",        10)
    );

    private static final Map<EmergencyCategory, Integer> CATEGORY_BASE = Map.of(
        EmergencyCategory.MEDICAL_EMERGENCY, 40,
        EmergencyCategory.ACCIDENT,          35,
        EmergencyCategory.BLOOD_DONATION,    25,
        EmergencyCategory.DISASTER_RELIEF,   30,
        EmergencyCategory.VEHICLE_BREAKDOWN, 15,
        EmergencyCategory.LOST_PET,           5,
        EmergencyCategory.OTHER,             10
    );

    private static final Map<UrgencyLevel, Integer> LEVEL_BASE = Map.of(
        UrgencyLevel.CRITICAL, 30,
        UrgencyLevel.HIGH,     20,
        UrgencyLevel.MEDIUM,   10,
        UrgencyLevel.LOW,       0
    );

    /**
     * Returns a severity score between 0 and 100.
     */
    public double classify(String description, EmergencyCategory category, UrgencyLevel level) {
        String lower = description.toLowerCase();

        int keywordScore = KEYWORD_WEIGHTS.entrySet().stream()
                .filter(e -> lower.contains(e.getKey()))
                .mapToInt(Map.Entry::getValue)
                .sum();

        int categoryScore = CATEGORY_BASE.getOrDefault(category, 10);
        int levelScore    = LEVEL_BASE.getOrDefault(level, 10);

        double raw = categoryScore + levelScore + keywordScore;
        return Math.min(100.0, raw);
    }
}
