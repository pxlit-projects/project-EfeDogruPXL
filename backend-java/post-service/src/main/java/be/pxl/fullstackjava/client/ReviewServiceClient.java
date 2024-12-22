package be.pxl.fullstackjava.client;

import org.springframework.cloud.openfeign.FeignClient;

@FeignClient(name = "review-service")
public interface ReviewServiceClient {

}
