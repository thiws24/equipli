package de.equipli;


import io.quarkus.test.common.QuarkusTestResourceLifecycleManager;
import jakarta.enterprise.context.ApplicationScoped;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.Network;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.wait.strategy.Wait;

import java.util.HashMap;
import java.util.Map;


@ApplicationScoped
public class TestContainerResource implements QuarkusTestResourceLifecycleManager {

    private PostgreSQLContainer<?> postgresInventoryServiceContainer;
    //private GenericContainer<?> keycloakContainer;
    private GenericContainer<?> inventoryServiceContainer;
    private GenericContainer<?> activeMQContainer;


    @Override
    public Map<String, String> start() {

        Network network = Network.newNetwork();


        postgresInventoryServiceContainer = new PostgreSQLContainer<>("postgres:17")
                .withDatabaseName("inventoryservicedb")
                .withUsername("inventoryservicedbuser")
                .withPassword("inventoryservicedbpw")
                .withNetwork(network)
                .withNetworkAliases("inventoryservice_db")
                .withExposedPorts(5432)
                .waitingFor(Wait.forListeningPort());
        postgresInventoryServiceContainer.start();

        inventoryServiceContainer = new GenericContainer<>("ghcr.io/thiws24/inventoryservice:latest")
                .dependsOn(postgresInventoryServiceContainer)
                .withEnv("QUARKUS_DATASOURCE_JDBC_URL", "jdbc:postgresql://inventoryservice_db:5432/inventoryservicedb")
                .withEnv("QUARKUS_DATASOURCE_USERNAME", postgresInventoryServiceContainer.getUsername())
                .withEnv("QUARKUS_DATASOURCE_PASSWORD", postgresInventoryServiceContainer.getPassword())
                .withNetwork(network)
                .withNetworkAliases("inventoryservice")
                .withExposedPorts(8080)
                .waitingFor(Wait.forListeningPort());
        inventoryServiceContainer.start();

/*        keycloakContainer = new GenericContainer<>("ghcr.io/ainges/keycloak:clean1")
                .withNetwork(network)
                .withNetworkAliases("keycloak")
                .withExposedPorts(8081)
                .waitingFor(Wait.forListeningPort());
        keycloakContainer.start();*/

        activeMQContainer = new GenericContainer<>("ghcr.io/thiws24/equipli/activemq:latest")
                .withEnv("ACTIVEMQ_USER", "admin")
                .withEnv("ACTIVEMQ_PASSWORD", "admin123")
                .withNetwork(network)
                .withNetworkAliases("activemq")
                .withExposedPorts(61616)
                .waitingFor(Wait.forListeningPort());





        return new HashMap<>() {{

            // Inventory Service
            put("quarkus.inventoryservice.url", "http://localhost:8080");
            put("camel.component.activemq.brokerURL", "tcp://activemq:61616");
            put("camel.component.activemq.username", "admin");
            put("camel.component.activemq.password", "admin123");

        }};

    }

    @Override
    public void stop() {

        inventoryServiceContainer.stop();
        inventoryServiceContainer.stop();



    }
}
