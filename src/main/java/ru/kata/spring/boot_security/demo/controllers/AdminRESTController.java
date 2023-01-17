package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.exception_handlers.NoSuchUserException;
import ru.kata.spring.boot_security.demo.exception_handlers.DataInfoHandler;
import ru.kata.spring.boot_security.demo.exception_handlers.UserWithSuchUsernameExist;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class AdminRESTController {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admins")
    public ResponseEntity<List<User>> showAllUsers() {
        List<User> users = userService.findAll();
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @GetMapping("/admins/{id}")
    public ResponseEntity<User> getUser(@PathVariable("id") Long id) {
        User user = userService.findOne(id);

        if (user == null) {
            throw new NoSuchUserException("There is no user with ID = " + id + " in Database");
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/admins")
    public ResponseEntity<DataInfoHandler> addNewUser(@Valid @RequestBody User user,
                                                      BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String error = getErrorsFromBindingResult(bindingResult);
            return new ResponseEntity<>(new DataInfoHandler(error), HttpStatus.BAD_REQUEST);
        }

        try {
            userService.save(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new UserWithSuchUsernameExist("User with such username exists");
        }
    }

    @PutMapping("/admins/{id}")
    public ResponseEntity<DataInfoHandler> updateUser(@PathVariable("id") Long id,
                                                      @RequestBody @Valid User user,
                                                      BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String error = getErrorsFromBindingResult(bindingResult);
            return new ResponseEntity<>(new DataInfoHandler(error), HttpStatus.BAD_REQUEST);
        }
        try {
            userService.update(user, id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (DataIntegrityViolationException e) {
            throw new UserWithSuchUsernameExist("User with such username exists");
        }
    }

    @DeleteMapping("/admins/{id}")
    public ResponseEntity<DataInfoHandler> deleteUser(@PathVariable("id") Long id) {

        if(userService.findOne(id) == null) {
           throw new NoSuchUserException("There is no user with ID = " + id + " in Database");
        }

        userService.delete(id);

        return new ResponseEntity<>(new DataInfoHandler("User was deleted"), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getAllRoles() {
        return new ResponseEntity<>(userService.findAllRoles(), HttpStatus.OK);
    }

    private String getErrorsFromBindingResult(BindingResult bindingResult) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.joining("; "));
    }
}
