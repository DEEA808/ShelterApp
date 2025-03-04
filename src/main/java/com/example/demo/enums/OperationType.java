package com.example.demo.enums;

public enum OperationType {
    ADD(1),
    DELETE(-1);

    private final int value;

    OperationType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
