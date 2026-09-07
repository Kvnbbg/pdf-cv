package io.kvnbbg.pdfcv;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public final class GraphQLPublisher {
  private final URI endpoint;
  private final HttpClient client = HttpClient.newHttpClient();
  private final ObjectMapper mapper = new ObjectMapper();

  public GraphQLPublisher(String endpoint) { this.endpoint = URI.create(endpoint); }

  public void publish(CvPayload payload) throws Exception {
    String mutation = "mutation Push($payload: ProfessionalContextInput!) { pushProfessionalContext(payload: $payload) { id status version } }";
    String body = mapper.writeValueAsString(java.util.Map.of(
        "query", mutation,
        "variables", java.util.Map.of("payload", payload)));
    HttpRequest request = HttpRequest.newBuilder(endpoint)
        .header("Content-Type", "application/json")
        .POST(HttpRequest.BodyPublishers.ofString(body))
        .build();
    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
    if (response.statusCode() / 100 != 2) throw new IllegalStateException("GraphQL HTTP " + response.statusCode());
  }
}
