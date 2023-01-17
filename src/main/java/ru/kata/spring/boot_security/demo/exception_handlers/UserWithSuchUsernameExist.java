package ru.kata.spring.boot_security.demo.exception_handlers;

import org.springframework.dao.DataIntegrityViolationException;

public class UserWithSuchUsernameExist extends DataIntegrityViolationException {
    public UserWithSuchUsernameExist(String msg) {
        super(msg);
    }
}
