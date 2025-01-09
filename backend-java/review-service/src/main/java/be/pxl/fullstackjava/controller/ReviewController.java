package be.pxl.fullstackjava.controller;

import be.pxl.fullstackjava.domain.dto.request.ReviewRequest;
import be.pxl.fullstackjava.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {

    private final IReviewService reviewService;
    private static final Logger log = LoggerFactory.getLogger(ReviewController.class);


    @PostMapping("/{postId}")
    public ResponseEntity<?> makeReview(@PathVariable Long postId, @RequestBody ReviewRequest reviewRequest, @RequestHeader(value = "name", required = false) String name,
                                        @RequestHeader(value = "role", required = false) String role) {

        if (role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role);
        }

        reviewService.makeReview(postId, reviewRequest);
        log.info("Review created by user={}, role={} for postId={}", name, role, postId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getReviewByPostId(@PathVariable Long postId, @RequestHeader(value = "name", required = false) String name,
                                               @RequestHeader(value = "role", required = false) String role) {

        if (role.equals("user")) {
            return ResponseEntity.status(403).body("Access denied for role: " + role + " for user: " + name);
        }
        log.info("Review found for postId={}, returning response", postId);
        return ResponseEntity.ok(reviewService.getReviewByPostId(postId));
    }

}
