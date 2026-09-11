# PDF-CV App 📁

## Professional profile

This public repository supports the CV / portfolio work of **Kévin Josué Marville — Développeur web et mobile**.

For recruiters and professional visitors, the primary public portfolio is the TechAndStream trilogy:

- **TechAndStream** — products, services and professional positioning: https://techandstream.com
- **kvnbbg.fr** — portfolio, development work, prototypes and projects: https://kvnbbg.fr
- **kvnbbg-creations.io** — digital and creative creations: https://kvnbbg-creations.io

For visitors who want to inspect the technical side more closely:

- [j-math](https://github.com/Kvnbbg/j-math)
- [Division-by-Zero](https://github.com/Kvnbbg/Division-by-Zero)

The technical links are optional: the three TechAndStream surfaces remain the main public presentation layer.

## Public repository / privacy

This repository is public and may be reviewed by recruiters. Please keep discussions and contributions courteous and professional.

Do not commit private administrative, legal, tribunal or financial records, personal identifiers, client documents, credentials, API keys, tokens or other sensitive information. Public documentation should remain factual and limited to information necessary to understand the project.

## Grimoire des Contenus 📑

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Trello STUDI](#studi)

![flowchat image](STUDI/flowchart.png)

## Installation

- **GitHub Repository:** Access the source code and public resources via this repository.
- **Online:** https://kvnbbg.github.io/pdf-cv/

To install the PDF-CV app:

1. Clone the repository: `git clone https://github.com/Kvnbbg/pdf-cv.git`
2. Navigate to the project directory: `cd pdf-cv`
3. Install the dependencies: `npm install`

## Usage

1. Start the app: `npm start`
2. Open the development URL shown by Expo.
3. Upload a CV and explore the available features.

## Contributing

We welcome contributions that improve the project while respecting the public-repository privacy rules above.

1. Fork the repository.
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them.
4. Push the branch and submit a pull request.

## License

The PDF-CV app is distributed under the [Mozilla Public License Version 2.0](https://opensource.org/licenses/MPL-2.0). See [LICENSE](LICENSE) for details.

## Studi

This section contains project-development notes and is retained as technical context rather than recruiter-facing marketing material.

**Core Telemetry & Bottleneck Detection**

* **Consumer Lag & Queue Depth:** Monitoring RabbitMQ to track if messages are accumulating faster than worker nodes can process them.
* **Query Profiling & Deadlocks:** Analyzing PostgreSQL slow query logs and connection pool saturation.
* **Endpoint Latency & Error Rates:** Tracking round-trip time for REST and GraphQL requests, HTTP 5xx errors and cascading timeouts.
* **Infrastructure Saturation:** Correlating CPU, memory and network I/O spikes with API workloads to identify scaling requirements.
