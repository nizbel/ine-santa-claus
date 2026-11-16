package com.inesantaclaus.event;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/event")
public class EventInfoController {

	private static final Logger logger = LoggerFactory.getLogger(EventInfoController.class);

  @Autowired
  EventInfoService service;

  @GetMapping("/{id}")
  public EventInfo get(@PathVariable(value = "id") long id) {
    return service.get(id);
  }

  @GetMapping("/list")
  public List<EventInfo> list() {
    return service.listInfo();
  }

  @PostMapping("/edit/{id}") 
	@PreAuthorize("hasRole('ADMIN')")
  public EventInfo edit(@RequestBody EventInfo letter, @PathVariable long id) throws Exception {
    return service.edit(letter);
  }
}
