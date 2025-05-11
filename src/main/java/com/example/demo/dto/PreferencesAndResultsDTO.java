package com.example.demo.dto;

import com.example.demo.model.BreedScoreResult;

import java.util.List;

public class PreferencesAndResultsDTO {
    private UserPreferencesDTO preferences;
    private List<BreedScoreResult> results;

    public PreferencesAndResultsDTO() {
    }

    public PreferencesAndResultsDTO(UserPreferencesDTO preferences, List<BreedScoreResult> results) {
        this.preferences = preferences;
        this.results = results;
    }

    public UserPreferencesDTO getPreferences() {
        return preferences;
    }

    public void setPreferences(UserPreferencesDTO preferences) {
        this.preferences = preferences;
    }

    public List<BreedScoreResult> getResults() {
        return results;
    }

    public void setResults(List<BreedScoreResult> results) {
        this.results = results;
    }
}
