package be.pxl.fullstackjava.client;

import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "post-service")
public interface PostServiceClient {

    @GetMapping("/api/post/{postId}/status")
    String getPostStatus(@PathVariable("postId") Long postId);

    @GetMapping("/api/post/{postId}/author")
    String getAuthor(@PathVariable("postId") Long postId);


    @PostMapping("/api/post/notification")
    void sendNotification(@RequestBody NotificationRequest notificationRequest);
}
