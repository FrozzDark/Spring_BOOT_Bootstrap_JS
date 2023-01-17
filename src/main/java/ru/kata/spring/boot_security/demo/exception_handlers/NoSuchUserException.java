package ru.kata.spring.boot_security.demo.exception_handlers;

public class NoSuchUserException extends RuntimeException {
    public NoSuchUserException(String message) {
        super(message);
    }
}
