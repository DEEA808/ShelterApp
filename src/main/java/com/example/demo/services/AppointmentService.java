package com.example.demo.services;

import com.example.demo.dto.AppointmentDTO;
import com.example.demo.exceptions.ResourceNotFoundException;
import com.example.demo.exceptions.SaveInfoException;
import com.example.demo.model.Appointment;
import com.example.demo.model.Dog;
import com.example.demo.model.Shelter;
import com.example.demo.model.User;
import com.example.demo.repositories.AppointmentRepository;
import com.example.demo.util.MapperUtil;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;

    @Autowired
    private JavaMailSender mailSender;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Transactional
    public List<AppointmentDTO> getAllAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream().map(MapperUtil::toAppointmentDTO).toList();
    }

    @Transactional(readOnly = true)
    public AppointmentDTO getAppointmentById(Long id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isEmpty()) {
            throw new ResourceNotFoundException("Appointment with id " + id + " not found");
        }
        return MapperUtil.toAppointmentDTO(appointment.get());
    }

    /*public List<AppointmentDTO> getAppointmentsByUserId(Long userId) {

    }*/

    @Transactional
    public AppointmentDTO createAppointment(AppointmentDTO appointmentDTO, Dog dog, Shelter shelter, User user) throws MessagingException {
        Appointment appointment = MapperUtil.toAppointment(appointmentDTO, dog, shelter, user);
        appointment.setStatus("schedueled");
        appointmentRepository.save(appointment);
        sendAppointmentEmail(user.getEmail(),appointment);
        try {
            return MapperUtil.toAppointmentDTO(appointment);
        } catch (IllegalArgumentException ex) {
            throw new SaveInfoException("Error saving appointment");
        } catch (RuntimeException ex) {
            throw new SaveInfoException("An error occurred while saving appointment");
        }
    }

    private  void sendAppointmentEmail(String email, Appointment appointment) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(email);
        helper.setSubject("Your appointment was scheduled");
        helper.setText(
                "<p><strong>Hello,Your appointment was successfully scheduled.</strong></p>" +
                        "<p><strong>Details:</strong></p>" +
                        "<ul>" +
                        "<li><strong>Dog:</strong> " + appointment.getDogName() + "</li>" +
                        "<li><strong>Your Name:</strong> " + appointment.getUserName() + "</li>" +
                        "<li><strong>Date and Time:</strong> " + appointment.getDateTime() + "</li>" +
                        "<li><strong>Cost:</strong> " + appointment.getCost() + "</li>" +
                        "<li><strong>Shelter:</strong> " + appointment.getShelter().getName() + "</li>" +
                        "</ul>",
                true
        );


        mailSender.send(message);
    }
}
