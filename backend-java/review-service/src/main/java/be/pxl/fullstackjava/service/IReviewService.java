package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.dto.request.ReviewRequest;
import be.pxl.fullstackjava.domain.dto.response.ReviewResponse;

public interface IReviewService {
    ReviewResponse getReviewByPostId(Long postId);

    void makeReview(Long postId, ReviewRequest reviewRequest);
}
