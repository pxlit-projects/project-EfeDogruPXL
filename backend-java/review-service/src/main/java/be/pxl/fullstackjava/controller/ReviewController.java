package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.dto.request.ReviewRequest;
import be.pxl.fullstackjava.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {

    private final ReviewService reviewService;
    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);


    @PostMapping("/{postId}")
    public ResponseEntity<?> makeReview(@PathVariable Long postId, @RequestBody ReviewRequest reviewRequest) {
        reviewService.makeReview(postId, reviewRequest);
        log.info("Review created successfully for postId={}", postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getReviewByPostId(@PathVariable Long postId) {
        log.info("Review found for postId={}, returning response", postId);
        return ResponseEntity.ok(reviewService.getReviewByPostId(postId));
    }

}
