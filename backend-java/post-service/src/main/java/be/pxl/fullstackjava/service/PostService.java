package be.pxl.fullstackjava.service;

import be.pxl.fullstackjava.domain.Post;
import be.pxl.fullstackjava.domain.dto.request.PostRequest;
import be.pxl.fullstackjava.domain.dto.response.PostResponse;
import be.pxl.fullstackjava.repository.PostRepository;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Builder
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;

    public void createPost(PostRequest createPostRequest) {
        Post post = Post.builder()
                .title(createPostRequest.getTitle())
                .content(createPostRequest.getContent())
                .auteur(createPostRequest.getAuteur())
                .createdAt(java.time.LocalDateTime.now())
                .isDraft(createPostRequest.isDraft())
                .build();
        postRepository.save(post);
    }

    public void updatePost(Long id, PostRequest updatePostRequest) {
        Post post = postRepository.findById(id).orElseThrow();
        post.setTitle(updatePostRequest.getTitle());
        post.setContent(updatePostRequest.getContent());
        post.setAuteur(updatePostRequest.getAuteur());
        post.setDraft(updatePostRequest.isDraft());
        postRepository.save(post);
    }

    public List<PostResponse> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<PostResponse> getAllDraftedPosts(){
        List<Post> posts = postRepository.findAll();
        return posts.stream()
                .filter(Post::isDraft)
                .map(this::mapToResponse)
                .toList();
    }



    private PostResponse mapToResponse(Post post) {
        return PostResponse.builder()
                .title(post.getTitle())
                .content(post.getContent())
                .auteur(post.getAuteur())
                .isDraft(post.isDraft())
                .createdAt(post.getCreatedAt().toString())
                .build();
    }
}
