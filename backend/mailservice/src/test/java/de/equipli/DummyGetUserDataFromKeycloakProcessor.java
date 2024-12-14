package de.equipli;

import de.equipli.dto.user.UserDto;
import jakarta.enterprise.context.ApplicationScoped;
import org.apache.camel.Exchange;
import org.apache.camel.Processor;

@ApplicationScoped
public class DummyGetUserDataFromKeycloakProcessor implements Processor {

    @Override
    public void process(Exchange exchange) throws Exception {
        // Erstelle ein Dummy UserDto, das die Keycloak-Daten simuliert
        UserDto mockUser = new UserDto();
        mockUser.setEmail("test@example.com");
        mockUser.setFirstName("John");
        mockUser.setLastName("Doe");

        // Setze den mock User als Property
        exchange.setProperty("user", mockUser);
    }
}