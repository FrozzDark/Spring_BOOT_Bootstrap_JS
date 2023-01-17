package ru.kata.spring.boot_security.demo.exception_handlers;

import org.springframework.security.core.userdetails.UsernameNotFoundException;

public class NoUserWithSuchIdException extends UsernameNotFoundException {
    public NoUserWithSuchIdException(String msg) {
        super(msg);
    }
}
