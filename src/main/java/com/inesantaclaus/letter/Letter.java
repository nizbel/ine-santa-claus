package com.inesantaclaus.letter;

import java.util.List;

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

  @ElementCollection
  private List<String> imagePath;

  public Letter() {
    
  }

  public Letter(String name, String ineClass, List<String> imagePath) {
    this.name = name;
    this.ineClass = ineClass;
    this.imagePath = imagePath;
  }

  @Override
  public String toString() {
    return String.format("%s from %s wants %s", name, ineClass, giftSuggestion);
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

  public List<String> getImagePath() {
    return imagePath;
  }

  public void setImagePath(List<String> imagePath) {
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
