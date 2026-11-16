package com.inesantaclaus.event;

import javax.persistence.*;

@Entity
@Table(name = "event")
public class EventInfo {
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
  private Long id;

  private String letterAdoptionDeadline;

  private String giftDeliveryDeadline;

  public EventInfo() {

  }

  @Override
  public String toString() {
    return String.format("Adopt letter by %s and deliver gifts by %s", letterAdoptionDeadline, giftDeliveryDeadline);
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getLetterAdoptionDeadline() {
    return letterAdoptionDeadline;
  }

  public void setLetterAdoptionDeadline(String letterAdoptionDeadline) {
    this.letterAdoptionDeadline = letterAdoptionDeadline;
  }

  public String getGiftDeliveryDeadline() {
    return giftDeliveryDeadline;
  }

  public void setGiftDeliveryDeadline(String giftDeliveryDeadline) {
    this.giftDeliveryDeadline = giftDeliveryDeadline;
  }
}
