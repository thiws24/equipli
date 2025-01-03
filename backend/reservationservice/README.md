# ReservationService API

Die ReservationService API ermöglicht die Verwaltung von Reservierungen und Verfügbarkeiten. Benutzer können verfügbare Items abrufen, Reservierungen erstellen, aktualisieren und Zeitfenster für Reservierungen prüfen.

---

## Endpoints

### Verfügbarkeit

#### Verfügbare Artikel nach Kategorie und Datumsbereich abrufen

Gibt eine Liste von verfügbaren Artikeln für die angegebene Kategorie und den Datumsbereich zurück.

```http
GET /availability/categories/{categoryId}/items?startDate={startDate}&endDate={endDate}
```

#### Response

    Status 200 (OK): Gibt eine Liste von verfügbaren Artikeln zurück.
    Status 404 (Not Found): Kategorie nicht gefunden.

---

#### Reservierungszeitfenster nach Kategorie abrufen

Gibt eine Liste von Items und deren Zeitfenstern zurück, in denen sie bereits reserviert sind.

```http
GET /availability/reservations/categories/{categoryId}
```

#### Response

    Status 200 (OK): Gibt eine Liste von Items und deren Zeitfenstern zurück.
    Status 404 (Not Found): Kategorie nicht gefunden.

---

#### Reservierungszeitfenster nach Artikel abrufen

Gibt eine Liste von Zeitfenstern zurück, in denen ein bestimmtes Item bereits reserviert ist.

```http
GET /availability/reservations/items/{itemId}
```

#### Response

    Status 200 (OK): Gibt eine Liste von Zeitfenstern zurück.
    Status 404 (Not Found): Item nicht gefunden.

---


### Alle Reservierungen abrufen

Gibt eine Liste aller vorhandenen Reservierungen zurück.

```http
GET  /reservations
```

#### Response

    Status 200 (OK): Gibt eine Liste von Reservierungen zurück.

```json
[
  {
    "id": 1,
    "itemId": 1,
    "categoryId": 1,
    "startDate": "2022-03-10",
    "endDate": "2022-03-11",
    "userId": "user123",
    "status": "CANCELLED"
  },
  {
    "id": 2,
    "itemId": 2,
    "categoryId": 1,
    "startDate": "2022-03-10",
    "endDate": "2022-03-11",
    "userId": "user123",
    "status": "CANCELLED"
  }
]
```

---

### Reservierung hinzufügen

Erstellt eine neue Reservierung für ein InventoryItem.

```http
POST /reservations
```

#### Request Body

```json
{
  "itemId": 1,
  "categoryId": 1,
  "startDate": "2022-03-10",
  "endDate": "2022-03-11",
  "userId": "user123",
  "status": "CANCELLED"
}
```

#### Response

    Status 201 (Created): Reservierung wurde erfolgreich erstellt.
    Status 400 (Bad Request): Erforderliche Felder fehlen oder sind ungültig.

```json
{
  "id": 1,
  "itemId": 1,
  "categoryId": 1,
  "startDate": "2022-03-10",
  "endDate": "2022-03-11",
  "userId": "user123",
  "status": "CANCELLED"
}
```

---

### Reservierung aktualisieren

Aktualisiert eine bestehende Reservierung anhand seiner ID.

```http
PUT /reservations/{id}
```

#### Request Body

```json
{
    "itemId": 1,
    "categoryId": 1,
    "startDate": "2022-03-10",
    "endDate": "2022-03-11",
    "userId": "user123",
    "status": "CANCELLED"
}
```

#### Response

    Status 200 (OK): Reservierung erfolgreich aktualisiert.
    Status 404 (Not Found): Reservierung nicht gefunden.
    Status 400 (Bad Request): Erforderliche Felder fehlen oder sind ungültig.

```json
{
  "id": 1,
  "itemId": 1,
  "categoryId": 1,
  "startDate": "2022-03-10",
  "endDate": "2022-03-11",
  "userId": "user123",
  "status": "CANCELLED"
}
```

---

# Deployment

## Umgebungsvariablen

Um den ReservationService mit einer Datenbank zu verbinden, müssen folgende Umgebungsvariablen gesetzt werden:

| Variable                          | Beschreibung                   |
|:----------------------------------|:-------------------------------|
| QUARKUS_DATASOURCE_JDBC_URL       | JDBC-URL der Datenbank         |    
| QUARKUS_DATASOURCE_USERNAME       | Benutzername für die Datenbank |      
| QUARKUS_DATASOURCE_PASSWORD       | Passwort für die Datenbank     |
| QUARKUS_REST-CLIENT_INVENTORY-API | URL des InventoryService       |

---

# Quarkus Documentation

This project uses Quarkus, the Supersonic Subatomic Java Framework.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw compile quarkus:dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Packaging and running the application

The application can be packaged using:

```shell script
./mvnw package
```

It produces the `quarkus-run.jar` file in the `target/quarkus-app/` directory.
Be aware that it’s not an _über-jar_ as the dependencies are copied into the `target/quarkus-app/lib/` directory.

The application is now runnable using `java -jar target/quarkus-app/quarkus-run.jar`.

If you want to build an _über-jar_, execute the following command:

```shell script
./mvnw package -Dquarkus.package.jar.type=uber-jar
```

The application, packaged as an _über-jar_, is now runnable using `java -jar target/*-runner.jar`.

## Creating a native executable

You can create a native executable using:

```shell script
./mvnw package -Dnative
```

Or, if you don't have GraalVM installed, you can run the native executable build in a container using:

```shell script
./mvnw package -Dnative -Dquarkus.native.container-build=true
```

You can then execute your native executable with: `./target/reservation_service-1.0.0-SNAPSHOT-runner`

If you want to learn more about building native executables, please consult <https://quarkus.io/guides/maven-tooling>.

## Related Guides

- REST ([guide](https://quarkus.io/guides/rest)): A Jakarta REST implementation utilizing build time processing and Vert.x. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it.
- SmallRye OpenAPI ([guide](https://quarkus.io/guides/openapi-swaggerui)): Document your REST APIs with OpenAPI - comes with Swagger UI
- REST Jackson ([guide](https://quarkus.io/guides/rest#json-serialisation)): Jackson serialization support for Quarkus REST. This extension is not compatible with the quarkus-resteasy extension, or any of the extensions that depend on it
- Hibernate ORM with Panache ([guide](https://quarkus.io/guides/hibernate-orm-panache)): Simplify your persistence code for Hibernate ORM via the active record or the repository pattern
- JDBC Driver - PostgreSQL ([guide](https://quarkus.io/guides/datasource)): Connect to the PostgreSQL database via JDBC

## Provided Code

### Hibernate ORM

Create your first JPA entity

[Related guide section...](https://quarkus.io/guides/hibernate-orm)

[Related Hibernate with Panache section...](https://quarkus.io/guides/hibernate-orm-panache)

### REST

Easily start your REST Web Services

[Related guide section...](https://quarkus.io/guides/getting-started-reactive#reactive-jax-rs-resources)
