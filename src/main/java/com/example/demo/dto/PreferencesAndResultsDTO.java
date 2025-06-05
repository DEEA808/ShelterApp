package com.example.demo.dto;

import com.example.demo.model.BreedScoreResult;

import java.util.List;

public class PreferencesAndResultsDTO {
    private UserPreferencesForEmailDTO preferences;
    private List<BreedScoreResult> results;

    public PreferencesAndResultsDTO() {
    }

    public PreferencesAndResultsDTO(UserPreferencesForEmailDTO preferences, List<BreedScoreResult> results) {
        this.preferences = preferences;
        this.results = results;
    }

    public UserPreferencesForEmailDTO getPreferences() {
        return preferences;
    }

    public void setPreferences(UserPreferencesForEmailDTO preferences) {
        this.preferences = preferences;
    }

    public List<BreedScoreResult> getResults() {
        return results;
    }

    public void setResults(List<BreedScoreResult> results) {
        this.results = results;
    }
}
