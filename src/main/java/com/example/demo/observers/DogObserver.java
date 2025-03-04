package com.example.demo.observers;

import com.example.demo.enums.OperationType;

public interface DogObserver {
    void onDogUpdated(Long shelterId, OperationType operationType);
}
