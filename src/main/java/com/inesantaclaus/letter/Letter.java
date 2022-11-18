package com.inesantaclaus.letter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;

@Entity
@Table(name = "letters", 
  uniqueConstraints = { 
    @UniqueConstraint(columnNames = {"name", "ineClass"})
  })
public class Letter {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
  private int id;

  @NotBlank
  private String name;

  @NotBlank
  private String ineClass;

  private String giftSuggestion;

  @NotBlank
  private String imagePath;

  public Letter(String name, String imagePath) {
    this.name = name;
    this.imagePath = imagePath;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getImagePath() {
    return imagePath;
  }

  public void setImagePath(String imagePath) {
    this.imagePath = imagePath;
  }
  
  public String getIneClass() {
    return ineClass;
  }

  public void setIneClass(String ineClass) {
    this.ineClass = ineClass;
  }

  public String getGiftSuggestion() {
    return giftSuggestion;
  }

  public void setGiftSuggestion(String giftSuggestion) {
    this.giftSuggestion = giftSuggestion;
  }
}
