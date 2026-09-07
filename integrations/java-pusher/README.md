# Java GraphQL + RabbitMQ payload pusher

A small Java 21 integration layer for `pdf-cv` that publishes structured professional-context payloads through GraphQL and RabbitMQ.

## Flow

```text
Agent / application
        |
        v
  CvPayload (JSON)
      /   \
     v     v
 GraphQL  RabbitMQ
     |       |
     +---+---+
         v
      pdf-cv workers
```

## Configuration

```bash
export GRAPHQL_URL=http://localhost:4000/graphql
export RABBITMQ_URI=amqp://guest:guest@localhost:5672
export RABBITMQ_EXCHANGE=pdf-cv.events
```

Do not place passwords, access tokens, private keys, financial-account data, government identifiers, or medical personal data in payloads or source files.

## Build

```bash
mvn package
```

## Run

```bash
mvn -q exec:java -Dexec.mainClass=io.kvnbbg.pdfcv.PayloadPusher
```

The GraphQL endpoint must expose the `pushProfessionalContext` mutation and accept a `ProfessionalContextInput` compatible with `CvPayload`.
