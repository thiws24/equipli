package de.equipli;

import de.equipli.dto.mail.MailCreateDto;
import io.quarkus.test.common.QuarkusTestResource;
import io.quarkus.test.junit.QuarkusTest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.apache.camel.builder.RouteBuilder;
import org.apache.camel.component.jackson.JacksonDataFormat;
import org.apache.camel.component.mock.MockEndpoint;
import org.apache.camel.test.junit5.CamelTestSupport;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;

@QuarkusTest
@QuarkusTestResource(TestContainerResource.class)
public class MailRouteTest extends CamelTestSupport {

    // Mock-Processor für den Keycloak-Abruf
    @Inject
    @ApplicationScoped
    DummyGetUserDataFromKeycloakProcessor dummyKeycloakProcessor;

    JacksonDataFormat mailDtoFormat = new JacksonDataFormat(MailCreateDto[].class);

    @Test
    void testMailRouteWithMockedKeycloakData() throws Exception {

        context.addRoutes(new RouteBuilder() {
            @Override
            public void configure() throws Exception {
                // Route für reservation-confirmation, aber mit direct statt ActiveMQ
                from("direct:send-reservation-confirmation")
                        .routeId("sendReservationConfirmation-Route")
                        .unmarshal(mailDtoFormat)
                        .setProperty("mailTemplate", simple("reservation-confirmation-mail.html"))
                        .to("direct:sendMail");

                // Route für storekeeper-confirmation, aber mit direct statt ActiveMQ
                from("direct:storekeeper-confirmation")
                        .routeId("sendStorekeeperConfirmation-Route")
                        .unmarshal(mailDtoFormat)
                        .setProperty("mailTemplate", simple("storekeeper-confirmation-mail.html"))
                        .to("direct:sendMail");

                // cancellation-confirmation Route
                from("direct:cancellation-confirmation")
                        .routeId("sendCancellationConfirmation-Route")
                        .unmarshal(mailDtoFormat)
                        .setProperty("mailTemplate", simple("cancellation-confirmation-mail.html"))
                        .to("direct:sendMail");
            }
        });

        // Ersetze die Route, um den Dummy-Processor zu verwenden
        context.getRouteDefinition("getUserDataFromKeycloak-Route")
                .onException(Exception.class)
                .handled(true)
                .to("mock:dummyKeycloakProcessor");


        // Sende eine Nachricht an die Queue
        template.sendBody("direct:queue:send-reservation-confirmation", createMailDtoArray());
        template.sendBody("direct:storekeeper-confirmation", createMailDtoArray());
        template.sendBody("direct:cancellation-confirmation", createMailDtoArray());

        MockEndpoint mockEndpoint = getMockEndpoint("mock:dummyKeycloakProcessor");

        // Überprüfe, ob die Nachricht korrekt empfangen wurde
        mockEndpoint.expectedMessageCount(1);
        mockEndpoint.assertIsSatisfied();
    }

    // Hilfsmethode um ein Mock-MailCreateDto zu erstellen
    private ArrayList<MailCreateDto> createMailDtoArray() {
        ArrayList<MailCreateDto> MailCreateDtoList = new ArrayList<>();
        MailCreateDto dto1 = new MailCreateDto();
        dto1.setItemId("123");
        dto1.setUserId("123");
        dto1.setReservationId("123");
        dto1.setStartDate("2024-12-14");
        dto1.setEndDate("2024-12-15");
        MailCreateDtoList.add(dto1);

        MailCreateDto dto2 = new MailCreateDto();
        dto2.setItemId("456");
        dto2.setUserId("456");
        dto2.setReservationId("456");
        dto2.setStartDate("2024-12-14");
        dto2.setEndDate("2024-12-15");
        MailCreateDtoList.add(dto2);


        return MailCreateDtoList;
    }
}
