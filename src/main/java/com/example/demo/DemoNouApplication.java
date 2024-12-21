package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
@EnableScheduling
public class DemoNouApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoNouApplication.class, args);
		System.out.println("SSS");
	}

}
