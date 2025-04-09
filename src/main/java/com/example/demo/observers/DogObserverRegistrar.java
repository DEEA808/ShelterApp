package com.example.demo.observers;

import com.example.demo.services.DogService;
import com.example.demo.services.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

@Component
public class DogObserverRegistrar {

    private final DogService dogService;
    private final ShelterService shelterService;

    @Autowired
    public DogObserverRegistrar(DogService dogService, ShelterService shelterService) {
        this.dogService = dogService;
        this.shelterService = shelterService;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void registerObserver() {
        dogService.addObserver(shelterService);
        System.out.println("✅ ShelterService registered as observer in DogService.");
    }
}
