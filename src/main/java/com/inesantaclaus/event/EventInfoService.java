package com.inesantaclaus.event;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EventInfoService {

	private static final Logger logger = LoggerFactory.getLogger(EventInfoService.class);
 
  @Autowired
  EventInfoRepository repository;

  public EventInfo get(Long id) {
    return repository.findById(id).orElseThrow();
  }

  public List<EventInfo> listInfo() {
    List<EventInfo> result = repository.findAll();

    if (result.size() == 0) {
      EventInfo event = new EventInfo();
      repository.save(event);
      result.add(event);
    }

    return result;
  }

  public EventInfo create(EventInfo letter) {
    return repository.save(letter);
  }

  public EventInfo edit(EventInfo letter) {
    return repository.save(letter);
  }
}
