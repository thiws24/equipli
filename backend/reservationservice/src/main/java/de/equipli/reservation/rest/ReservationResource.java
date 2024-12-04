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

    @GET
    @Path("/{itemId}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReservationsById(@PathParam("itemId") Long id) {
        if (id == null || id <= 0) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Invalid ID").build();
        }

        List<Reservation> reservations = reservationRepository.list("itemId = ?1", id);

        if (reservations == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }

        return Response.ok(reservations).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response addReservation(Reservation reservation) {
        LocalDate startDate = reservation.getStartDate();
        LocalDate endDate = reservation.getEndDate();

        Period periodBetweenDates = Period.between(startDate, endDate);

        if (periodBetweenDates.isNegative()) {
            return Response.status(Response.Status.BAD_REQUEST).entity("End-Datum muss nach Start-Datum liegen!")
                    .build();
        }

        if (startDate.isBefore(LocalDate.now())) {
            return Response.status(Response.Status.BAD_REQUEST).entity("Start-Datum liegt in der Vergangenheit")
                    .build();
        }

        List<Reservation> reservations = Reservation.list("itemId", reservation.getItemId());

        for (Reservation r : reservations) {
            if (!endDate.isBefore(r.getStartDate()) && !startDate.isAfter(r.getEndDate())) {
                return Response.status(Response.Status.BAD_REQUEST)
                        .entity("Das Item ist in diesem Zeitraum nicht verfügbar").build();
            }
        }
        reservationRepository.persist(reservation);
        return Response.status(Response.Status.CREATED).entity(reservation).build();
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    @Transactional
    public Reservation updateReservation(@PathParam("id") Long id, Reservation reservation) {
        Reservation existingReservation = reservationRepository.findById(id);

        if (existingReservation == null) {
            throw new WebApplicationException("Reservation with id '" + id + "' not found", 404);
        }

        if (reservation.getStartDate() != null) {
            existingReservation.setStartDate(reservation.getStartDate());
        }
        if (reservation.getEndDate() != null) {
            existingReservation.setEndDate(reservation.getEndDate());
        }
        if (reservation.getItemId() != null) {
            existingReservation.setItemId(reservation.getItemId());
        }
        if (reservation.getUserId() != null) {
            existingReservation.setUserId(reservation.getUserId());
        }
        if (reservation.getReservationStatus() != null) {
            existingReservation.setReservationStatus(reservation.getReservationStatus());
        }
        reservationRepository.persist(existingReservation);
        return reservation;
    }

}