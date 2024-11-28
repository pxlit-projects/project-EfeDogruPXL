package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.Post;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping("/post")
    public ResponseEntity<Void> createPost(@RequestBody PostRequest createPostRequest) {
        postService.createPost(createPostRequest);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/post/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody PostRequest updatePostRequest) {
        postService.updatePost(id, updatePostRequest);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/post/all")
    public ResponseEntity<List<PostResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/post/draft")
    public ResponseEntity<List<PostResponse>> getAllDraftedPosts() {
        return ResponseEntity.ok(postService.getAllDraftedPosts());
    }



}
