package be.pxl.fullstackjava.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Bean
    public Queue reviewQueue() {
        return new Queue("review-queue", false);
    }

    @Bean
    public Queue updateQueue() {
        return new Queue("update-queue", false);
    }

//    @Bean
//    public Queue commentQueue() {
//        return new Queue("comment-queue", false);
//    }

//    @Bean
//    public Queue postQueue() {
//        return new Queue("post-queue", false);
//    }

    @Bean
    public Jackson2JsonMessageConverter converter() {
        return new Jackson2JsonMessageConverter();
    }
}
