package io.kvnbbg.pdfcv;

import java.util.List;

public final class PayloadPusher {
  public static void main(String[] args) throws Exception {
    String graphqlUrl = env("GRAPHQL_URL", "http://localhost:4000/graphql");
    String rabbitUri = env("RABBITMQ_URI", "amqp://guest:guest@localhost:5672");
    String exchange = env("RABBITMQ_EXCHANGE", "pdf-cv.events");

    CvPayload payload = new CvPayload(
        "professional.context.updated", "1.0", "agent", "kevin-marville", "recruitment",
        List.of("full-stack", "API", "React", "Python", "FastAPI", "PostgreSQL", "Docker", "CI/CD"),
        List.of("software", "product", "marketing", "health-tech", "business", "finance-learning"),
        List.of("github", "linkedin", "portfolio"));

    try (RabbitPublisher rabbit = new RabbitPublisher(rabbitUri, exchange)) {
      rabbit.publish("professional.context.updated", payload);
    }
    new GraphQLPublisher(graphqlUrl).publish(payload);
    System.out.println("Professional context payload published to RabbitMQ and GraphQL.");
  }

  private static String env(String name, String fallback) {
    String value = System.getenv(name);
    return value == null || value.isBlank() ? fallback : value;
  }
}
