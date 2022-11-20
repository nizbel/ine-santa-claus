package com.inesantaclaus;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class StaticController {
  
  @RequestMapping("/")
  public String index() {
    return "index.html";
  }

  @RequestMapping("/login")
  public String login() {
    return "login.html";
  }

  @RequestMapping("/signup")
  public String signup() {
    return "signup.html";
  }
}
