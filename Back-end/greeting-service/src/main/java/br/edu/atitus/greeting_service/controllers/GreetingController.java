package br.edu.atitus.greeting_service.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.edu.atitus.entities.PersonEntity;
import br.edu.atitus.greeting_service.configs.GreetingConfig;

@RestController
@RequestMapping("greeting-service")
public class GreetingController {

	
	//@Value("${greeting-service.greeting}")
	//private String greeting;
	
	//@Value("${greeting-service.default-name}")
	//private String defaultName;
	
	private final GreetingConfig config;
	
	
	
	public GreetingController(GreetingConfig config) {
		super();
		this.config = config;
	}


	@GetMapping
	public ResponseEntity<String> greet( @RequestParam(required = false) String name){
		String greetingReturn = config.getGreeting();
		String nameReturn = name != null ? name : config.getDefaultName();
		String textReturn = String.format("%s, %s!!!", greetingReturn, nameReturn);
		
		return ResponseEntity.ok(textReturn);
	}
	
	@GetMapping("/{name}")
	public ResponseEntity<String> greetWithPath(@PathVariable("name") String name) {

		return greet(name);
	}
	
	@PostMapping
	public ResponseEntity<String> greetWithPost(@RequestBody PersonEntity person) {
	    String greetingReturn = config.getGreeting();
	    String nameReturn = person.getName() != null ? person.getName() : config.getDefaultName();
	    String textReturn = String.format("%s, %s!!!", greetingReturn, nameReturn);

	    return ResponseEntity.ok(textReturn);
	}
}
