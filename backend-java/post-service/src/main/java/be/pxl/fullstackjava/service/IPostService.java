package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.domain.dto.response.ReviewEvent;

import java.util.List;

public interface IPostService {
    void createPost(PostRequest createPostRequest);

    void updatePost(Long id, PostRequest updatePostRequest);

    List<PostResponse> getAllPosts();

    List<PostResponse> getApprovedAndPendingPosts();

    List<PostResponse> getRejectedPosts();

    List<PostResponse> getApprovedPosts();

    PostResponse getPostById(Long id);

    List<PostResponse> getAllDraftedPosts();

    void receiveReview(ReviewEvent reviewEvent);
}
