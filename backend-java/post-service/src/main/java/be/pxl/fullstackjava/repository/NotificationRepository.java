package be.pxl.fullstackjava.repository;

import be.pxl.fullstackjava.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByAuthor(String author);
}
