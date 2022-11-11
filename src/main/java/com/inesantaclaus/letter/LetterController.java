package com.inesantaclaus.letter;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/letters")
public class LetterController {

  @GetMapping("/{id}")
  public Letter detail(@PathVariable int id) {
    if (id == 1) {
      return new Letter("John", "/aws/random/path");
    }
    return null;
  }

  @GetMapping("/list")
  public List<Letter> list() {
    // Generate random list
    ArrayList<Letter> letters = new ArrayList<Letter>();

    Random rand = new Random();
    for (int i = 0; i < 10; i++) {
      int randomValue = rand.nextInt(100);
      letters.add(new Letter("John" + randomValue, "/aws/random/path/" + randomValue));
    }

    return letters;
  }
}
