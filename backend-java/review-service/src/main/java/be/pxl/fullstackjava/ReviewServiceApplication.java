package be.pxl.fullstackjava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Hello world!
 *
 */
@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients
public class ReviewServiceApplication
{
    public static void main( String[] args )
    {
        SpringApplication.run(ReviewServiceApplication.class, args);
    }
}
