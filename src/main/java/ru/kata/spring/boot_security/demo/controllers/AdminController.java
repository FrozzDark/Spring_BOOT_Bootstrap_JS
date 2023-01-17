package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import javax.validation.Valid;
import java.security.Principal;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("")
    public String adminPanel(@ModelAttribute("user") User userToBeCreated,
                             Principal principal, Model model) {

        User user = userService.findByUsername(principal.getName());
        model.addAttribute("currentUser", user);

        model.addAttribute("listUsers", userService.findAll());
        model.addAttribute("listRoles", userService.findAllRoles());
        return "/admin/adminPanel";
    }

    @PostMapping("/save")
    public String create(@ModelAttribute("user") @Valid User userToBeCreated, BindingResult bindingResult) {
        if (bindingResult.hasErrors()){
            return "redirect:/admin";
        }

        userService.save(userToBeCreated);
        return "redirect:/admin";
    }

    @DeleteMapping("/delete/{id}")
    public String removeUser(@PathVariable("id") Long id) {
        userService.delete(id);
        return "redirect:/admin";
    }

    @PatchMapping("/edit/{id}")
    public String update(@ModelAttribute("user") @Valid User user, BindingResult bindingResult,
                         @PathVariable("id") Long id) {
        if (bindingResult.hasErrors()) {
            return "redirect:/edit/{id}";
        }

        userService.update(user, id);
        return "redirect:/admin";
    }
}
