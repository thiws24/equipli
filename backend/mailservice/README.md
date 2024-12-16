# Mail Service 📧 API Dokumentation

## Arten von E-Mails

Im Moment können folgende Arten von E-Mails versendet werden:

### 1. Reservierungsbestätigung
Bestätigung einer Reservierung.

### 2. Stornierbestätigung
Bestätigung einer Stornierung.

### 3. Rückgabebestätigung
Bestätigung einer Rückgabe.

### 4. Erinnerung an Rückgabe
Erinnerung an eine Rückgabe.

### 5. Bestätigung des Lagerwartes
Bestätigung durch den Lagerwart.

## Verwendung
Der Mail-Service wird von anderen Services verwendet, um E-Mails zu versenden. Dazu wird ein POST-Request an den ActiveMQ-Server gesendet.

### z.B für Reservierung bestätigen

#### HTTP Request
```
POST http://localhost:8161/api/message/send-reservation-confirmation?type=queue
Content-Type: application/json
Authorization: Basic YWRtaW46YWRtaW4xMjM=
```

#### Request Body
```
[
  {
    "itemId": "1",
    "startDate": "2024-11-28",
    "endDate": "2024-11-30",
    "userId": "26d7ee63-43f1-4deb-9d2f-41e297c9953a",
    "reservationId": "123"
  },
  {
    "itemId": "2",
    "startDate": "2024-12-28",
    "endDate": "2024-12-30",
    "userId": "26d7ee63-43f1-4deb-9d2f-41e297c9953a",
    "reservationId": "456"
  }
]
```

### Beachten:

Das Beispiel zeigt einen Request für die Bestätigung einer Reservierung. Die anderen E-Mail-Typen können analog versendet werden.
Dazu muss die Queue im Request, hier ``send-reservation-confirmation`` entsprechend angepasst werden.

Die möglichen Queues sind:
- send-reservation-confirmation
- cancellation-confirmation
- return-confirmation
- return-reminder
- storekeeper-confirmation
