package com.inesantaclaus.letter;

import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.stringContainsInOrder;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Arrays;

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
	 * Details
	 */
	@Test
	public void getDetail() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(baseUrl).param("name", "John").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().string(stringContainsInOrder(Arrays.asList("name", "John"))))
				.andExpect(content().string(stringContainsInOrder(Arrays.asList("imagePath", "/aws/random/path"))));
	}
	
	@Test
	public void getDetailLackingParameter() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(baseUrl).accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isBadRequest());
	}

	@Test
	public void getDetailNotFound() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(baseUrl).param("name", "Jose").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isNotFound());
	}

	/*
	 * Listing
	 */
	@Test
	public void getList() throws Exception {
		mvc.perform(MockMvcRequestBuilders.get(baseUrl + "/list").accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(content().string(not(equalTo(""))));
	}
}