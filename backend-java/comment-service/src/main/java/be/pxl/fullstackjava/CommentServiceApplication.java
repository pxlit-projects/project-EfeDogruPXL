package be.pxl.fullstackjava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * CommentServiceApplication
 *
 */
@SpringBootApplication
@EnableDiscoveryClient
public class CommentServiceApplication
{
    public static void main( String[] args )
    {
        SpringApplication.run(CommentServiceApplication.class, args);
    }
}
