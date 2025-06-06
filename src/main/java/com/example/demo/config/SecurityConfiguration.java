package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfiguration {
    private final AuthenticationProvider authenticationProvider;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfiguration(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            AuthenticationProvider authenticationProvider
    ) {
        this.authenticationProvider = authenticationProvider;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("users/favorites/add/{id}").permitAll()
                        .requestMatchers("users/favorites/delete/{id}").permitAll()
                        .requestMatchers("users/favorites/all").permitAll()
                        .requestMatchers("/appointments/**").permitAll()
                        .requestMatchers("/shelters/all").permitAll()
                        .requestMatchers("/dogs/all").permitAll()
                        .requestMatchers("dogs/extra-images/{id}").permitAll()
                        .requestMatchers("dogs/myDogs/{id}").permitAll()
                        .requestMatchers(("/shelters/add")).hasRole("ADMIN")
                        .requestMatchers(("/shelters/delete/{id}")).hasRole("ADMIN")
                        .requestMatchers(("/shelters/update/{id}")).hasRole("ADMIN")
                        .requestMatchers("/files/uploadFiles/{id}").hasRole("ADMIN")
                        .requestMatchers("/dogs/myDogs/{id}").permitAll()
                        .requestMatchers(("/dogs/byBreed/{breed}")).permitAll()
                        .requestMatchers(("/files/allFiles/{id}")).permitAll()
                        .requestMatchers("/files/myFiles/{id}").permitAll()
                        .requestMatchers("files/delete/{id}").hasRole("ADMIN")
                        .requestMatchers("dogs/preferencesAndResults/{email}").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOriginPattern("*");
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

