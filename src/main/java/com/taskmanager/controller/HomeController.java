package com.taskmanager.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Redireciona a rota "/" para o index.html em static/
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }
}
