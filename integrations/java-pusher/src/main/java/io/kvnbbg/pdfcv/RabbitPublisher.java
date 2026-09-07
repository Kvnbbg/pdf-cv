package io.kvnbbg.pdfcv;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rabbitmq.client.Channel;
import com.rabbitmq.client.Connection;
import com.rabbitmq.client.ConnectionFactory;

public final class RabbitPublisher implements AutoCloseable {
  private final Connection connection;
  private final Channel channel;
  private final String exchange;
  private final ObjectMapper mapper = new ObjectMapper();

  public RabbitPublisher(String uri, String exchange) throws Exception {
    ConnectionFactory factory = new ConnectionFactory();
    factory.setUri(uri);
    this.connection = factory.newConnection();
    this.channel = connection.createChannel();
    this.exchange = exchange;
    channel.exchangeDeclare(exchange, "topic", true);
  }

  public void publish(String routingKey, CvPayload payload) throws Exception {
    byte[] body = mapper.writeValueAsBytes(payload);
    channel.basicPublish(exchange, routingKey, null, body);
  }

  @Override public void close() throws Exception { channel.close(); connection.close(); }
}
