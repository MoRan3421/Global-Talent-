package com.globaltalent.core;

public class SecurityManager {
    public static void validateTransaction(String txId) {
        System.out.println("Validating transaction: " + txId);
    }
}
