package com.inesantaclaus;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
public class InitController {
  @Autowired
  InitService service;

  @GetMapping("/init")
  public Boolean init() {
    return service.init();
  }
}
