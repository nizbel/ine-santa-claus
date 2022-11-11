package com.inesantaclaus.letter;

import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.List;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class LetterControllerIT {

	private final String baseUrl = "/letters";
    
	@Autowired
	private TestRestTemplate template;

    @Test
    public void getList() throws Exception {
        ResponseEntity<Letter[]> response = template.getForEntity(baseUrl + "/list", Letter[].class);
        List<Letter> letters = Arrays.asList(response.getBody());
        assertThat(letters.size() > 1);
    }
}