package th.ac.tu.cs.services.entity;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer { // Implement the interface
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Specify the API path pattern
                .allowedOrigins("http://127.0.0.1:5501") // Allow this specific frontend domain
                .allowedMethods("GET", "POST", "PUT", "DELETE") // Allow specific HTTP methods
                .allowedHeaders("*") // Allow all headers
                .exposedHeaders("Content-Disposition") // Add exposed header to allow clients to read it
                .allowCredentials(true); // Allow cookies (if applicable)
    }
}


