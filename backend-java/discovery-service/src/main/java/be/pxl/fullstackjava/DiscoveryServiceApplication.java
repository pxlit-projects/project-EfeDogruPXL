package be.pxl.fullstackjava;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

/**
 * DiscoveryServiceApplication
 *
 */
@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication
{
    public static void main( String[] args )
    {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}
