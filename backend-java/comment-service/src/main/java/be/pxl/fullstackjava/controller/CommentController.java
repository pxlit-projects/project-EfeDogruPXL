package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.dto.request.CommentRequest;
import be.pxl.fullstackjava.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    private final CommentService commentService;

    @PostMapping("/{postId}")
    public ResponseEntity<?> createComment(@PathVariable Long postId, @RequestBody CommentRequest request){
        commentService.createComment(postId, request);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<?> getCommentByPostId(@PathVariable Long postId){
        return ResponseEntity.ok(commentService.getCommentByPostId(postId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@PathVariable Long id, @RequestBody String commentText){
        commentService.updateComment(id, commentText);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommentById(@PathVariable Long id){
        return ResponseEntity.ok(commentService.getCommentById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id){
        commentService.deleteComment(id);
        return ResponseEntity.ok().build();
    }
}
