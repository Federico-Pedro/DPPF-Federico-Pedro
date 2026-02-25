package com.rustica.reservas.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender){
        this.mailSender = mailSender;
    }

    public void sendConfirmationEmail(String name, String email){
        SimpleMailMessage message = new SimpleMailMessage();

        message.setTo(email);
        message.setSubject("Cuenta creada con éxito en Rústica");
        message.setText("Su cuenta se ha creado con éxito. Su nombre: " + name + " Su email: " + email + " Para iniciar sesión ingresá a: http://localhost:5173/login");
        mailSender.send(message);
    }
}
