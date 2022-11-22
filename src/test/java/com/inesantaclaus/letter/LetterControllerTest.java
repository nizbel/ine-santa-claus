package com.inesantaclaus.letter;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

@SpringBootTest
@AutoConfigureMockMvc
public class LetterControllerTest {

	private final String baseUrl = "/letters";

	@Autowired
	private MockMvc mvc;

	/*
	 * Listing
	 */
	@Test
	public void hasToBeAuthorizedToListLetters() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(baseUrl + "/list").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isUnauthorized());
	}
}