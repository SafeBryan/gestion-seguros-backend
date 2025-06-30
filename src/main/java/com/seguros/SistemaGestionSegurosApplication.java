package com.seguros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication
public class SistemaGestionSegurosApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(SistemaGestionSegurosApplication.class, args);
	}

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(SistemaGestionSegurosApplication.class);
	}
}

