package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.dto.request.CommentRequest;
import be.pxl.fullstackjava.service.CommentService;
import be.pxl.fullstackjava.service.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private final ICommentService commentService;

    @PostMapping("/{postId}")
    public ResponseEntity<?> createComment(@PathVariable Long postId, @RequestBody CommentRequest request, @RequestHeader(value = "name", required = false) String name,
                                           @RequestHeader(value = "role", required = false) String role){

        if (!role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }

        commentService.createComment(postId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentByPostId(@PathVariable Long postId, @RequestHeader(value = "name", required = false) String name,
                                                @RequestHeader(value = "role", required = false) String role){

        if (!role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }

        return ResponseEntity.ok(commentService.getCommentByPostId(postId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody String commentText, @RequestHeader(value = "name", required = false) String name,
                                           @RequestHeader(value = "role", required = false) String role){

        if (!role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }
        commentService.updateComment(id, commentText);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(@PathVariable Long id, @RequestHeader(value = "name", required = false) String name,
                                            @RequestHeader(value = "role", required = false) String role){

        if (!role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }
        return ResponseEntity.ok(commentService.getCommentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id, @RequestHeader(value = "name", required = false) String name,
                                           @RequestHeader(value = "role", required = false) String role){

        if (!role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }

        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
