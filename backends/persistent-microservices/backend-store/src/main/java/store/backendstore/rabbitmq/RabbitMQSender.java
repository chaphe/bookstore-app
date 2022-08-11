package store.backendstore.rabbitmq;

import org.springframework.amqp.core.AmqpTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class RabbitMQSender {

	@Autowired
	private AmqpTemplate rabbitTemplate;

	@Value("${javainuse.rabbitmq.exchange}")
	private String exchange;

	@Value("${javainuse.rabbitmq.routingkey}")
	private String routingkey;

	public boolean send(Object company) {
		try {
			System.out.println("Message ton send >>>>>>>> " + company);
			rabbitTemplate.convertAndSend(exchange, routingkey, company);
			System.out.println("Send msg =" + company);
			return true;
		} catch (Exception e) {
			return false;
		}
	}
}