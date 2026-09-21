package in.kalvi;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class KalviApplication {
    public static void main(String[] args) {
        SpringApplication.run(KalviApplication.class, args);
    }

    /* serve the portal's image folder (../images) at /images/** */
    @Configuration
    static class WebConfig implements WebMvcConfigurer {
        @Override
        public void addResourceHandlers(ResourceHandlerRegistry reg) {
            reg.addResourceHandler("/images/**")
               .addResourceLocations("file:../images/");
        }
    }
}
