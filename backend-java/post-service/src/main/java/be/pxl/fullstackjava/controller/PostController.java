package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.Notification;
import be.pxl.fullstackjava.domain.Post;
import be.pxl.fullstackjava.domain.ReviewStatus;
import be.pxl.fullstackjava.domain.dto.request.NotificationRequest;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.service.IPostService;
import be.pxl.fullstackjava.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
public class PostController {

    private final IPostService postService;

    @PostMapping()
    public ResponseEntity<?> createPost(@RequestBody PostRequest createPostRequest,  @RequestHeader(value = "name", required = false) String name,
                                           @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("editor")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }

        postService.createPost(createPostRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@PathVariable Long id, @RequestBody PostRequest updatePostRequest,  @RequestHeader(value = "name", required = false) String name,
                                           @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("editor")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }
        postService.updatePost(id, updatePostRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/all/approved-pending")
    public ResponseEntity<List<PostResponse>> getApprovedAndPendingPosts( @RequestHeader(value = "name", required = false) String name,
                                                                          @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("editor")) {
            return ResponseEntity.status(403).body(Collections.emptyList());
        }

        return ResponseEntity.ok(postService.getApprovedAndPendingPosts());
    }

    @GetMapping("/all/rejected")
    public ResponseEntity<List<PostResponse>> getRejectedPosts( @RequestHeader(value = "name", required = false) String name,
                                                                @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("editor")) {
            return ResponseEntity.status(403).body(Collections.emptyList());
        }
        return ResponseEntity.ok(postService.getRejectedPosts());
    }

    @GetMapping("/all/approved")
    public ResponseEntity<List<PostResponse>> getApprovedPosts( @RequestHeader(value = "name", required = false) String name,
                                                                @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("user")) {
            return ResponseEntity.status(403).body(Collections.emptyList());
        }
        return ResponseEntity.ok(postService.getApprovedPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id,  @RequestHeader(value = "name", required = false) String name,
                                                    @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("user") && !role.equals("editor")) {
            return ResponseEntity.status(403).body(PostResponse.builder().build());
        }
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @GetMapping("/all/drafted")
    public ResponseEntity<List<PostResponse>> getAllDraftedPosts( @RequestHeader(value = "name", required = false) String name,
                                                                  @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("editor")) {
            return ResponseEntity.status(403).body(Collections.emptyList());
        }
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
    public ResponseEntity<List<Notification>> getNotificationsByAuthor(@PathVariable String author,  @RequestHeader(value = "name", required = false) String name,
                                                                       @RequestHeader(value = "role", required = false) String role) {

        if (!role.equals("editor")) {
            return ResponseEntity.status(403).body(Collections.emptyList());
        }
        return ResponseEntity.ok(postService.getNotificationsByAuthor(author));
    }

}
