package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.Notification;
import be.pxl.fullstackjava.domain.Post;
import be.pxl.fullstackjava.domain.ReviewStatus;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {

    private final PostService postService;

    @PostMapping()
    public ResponseEntity<Void> createPost(@RequestBody PostRequest createPostRequest) {
        postService.createPost(createPostRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody PostRequest updatePostRequest) {
        postService.updatePost(id, updatePostRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/all/approved-pending")
    public ResponseEntity<List<PostResponse>> getApprovedAndPendingPosts() {
        return ResponseEntity.ok(postService.getApprovedAndPendingPosts());
    }

    @GetMapping("/all/rejected")
    public ResponseEntity<List<PostResponse>> getRejectedPosts() {
        return ResponseEntity.ok(postService.getRejectedPosts());
    }

    @GetMapping("/all/approved")
    public ResponseEntity<List<PostResponse>> getApprovedPosts() {
        return ResponseEntity.ok(postService.getApprovedPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/all/drafted")
    public ResponseEntity<List<PostResponse>> getAllDraftedPosts() {
        return ResponseEntity.ok(postService.getAllDraftedPosts());
    }

    @GetMapping("/{postId}/status")
    public ResponseEntity<String> getPostStatus(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostStatus(postId));
    }

    @GetMapping("/{postId}/author")
    public ResponseEntity<String> getAuthor(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostAuthor(postId));
    }

    @PostMapping("/notification")
    public ResponseEntity<Void> receiveNotification(@RequestBody NotificationRequest notificationRequest) {
        postService.saveNotification(notificationRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{author}/notification")
    public ResponseEntity<List<Notification>> getNotificationsByAuthor(@PathVariable String author) {
        return ResponseEntity.ok(postService.getNotificationsByAuthor(author));
    }

}
