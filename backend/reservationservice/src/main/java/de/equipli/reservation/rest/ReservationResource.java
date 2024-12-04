package de.equipli.reservation.rest;

import de.equipli.reservation.jpa.ReservationRepository;
import de.equipli.reservation.jpa.Reservation;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.LocalDate;
import java.time.Period;
import java.util.List;

@Path("/reservations")
public class ReservationResource {

    @Inject
    ReservationRepository reservationRepository;

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List<Reservation> getReservations() {
        return reservationRepository.listAll();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addReservation(Reservation reservation) {
        LocalDate startDate = reservation.getStartDate();
        LocalDate endDate = reservation.getEndDate();

        Period periodBetweenDates = Period.between(startDate, endDate);

        if (periodBetweenDates.isNegative()) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("End-Datum muss nach Start-Datum liegen!")
                    .build();
        }

        if (startDate.isBefore(LocalDate.now())) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Start-Datum liegt in der Vergangenheit")
                    .build();
        }

        List<Reservation> reservations = Reservation.list("itemId", reservation.getItemId());

        for (Reservation r : reservations) {
            if (!endDate.isBefore(r.getStartDate()) && !startDate.isAfter(r.getEndDate())) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Das Item ist in diesem Zeitraum nicht verfügbar")
                        .build();
            }
        }

        reservationRepository.persist(reservation);
        return Response.status(Response.Status.CREATED).entity(reservation).build();
    }
}