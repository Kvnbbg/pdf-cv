# Normes Architecturales : Sensibilité à la Casse Lexicale

L'intégrité structurelle de ce référentiel requiert une standardisation syntaxique stricte de son arborescence, spécifiquement face à la dichotomie typographique entre les répertoires `/Docs` et `/docs`. La négligence de cette distinction engendre des asymétries de résolution d'adressage entre les différents environnements d'exécution, compromettant gravement la stabilité des pipelines d'intégration continue et la reproductibilité du code.

## Analyse de la Divergence Topologique

* **Environnements POSIX (Linux/Unix) :** L'évaluation des chemins d'accès est strictement sensible à la casse (*case-sensitive*). D'un point de vue topologique, `/Docs` et `/docs` constituent des entités de stockage mutuellement exclusives. Une divergence de nomenclature entraîne une défaillance immédiate (Erreur `ENOENT`).
* **Environnements Windows et macOS :** Le système de fichiers sous-jacent est généralement permissif (*case-preserving, case-insensitive*). Une requête ciblant `/Docs` résoudra implicitement `/docs`. Ce comportement masque artificiellement les erreurs d'adressage durant le développement local.
* **Mécanismes Git :** L'altération de la casse sans reconfiguration explicite du noyau Git génère des conflits de fusion complexes, aboutissant à l'existence simultanée de deux branches arborescentes dans l'index du contrôleur de version (états de corruption d'arbre de travail).

## Impacts Structurels et Défaillances Systémiques

| Vecteur d'Exécution | Comportement Face à la Distorsion de Casse | Conséquence Systémique |
| --- | --- | --- |
| **Développement Local (Win/Mac)** | Tolérance et correction implicite | Faux positif d'opérabilité (illusion de stabilité) |
| **Serveurs CI/CD (Ubuntu/Alpine)** | Rejet strict de la nomenclature invalide | Échec systémique du pipeline (Build Failure) |
| **Serveurs HTTP (Apache/Nginx)** | Déréférencement des URIs non exactes | Rupture totale des liaisons hypertexte statiques |

## Protocole de Normalisation

La convention canonique adoptée pour ce projet impose l'usage exclusif de la graphie en lettres minuscules pour toute documentation : **`/docs`**.

* **Audit de l'Adressage :** L'intégralité des imports de modules, des liaisons de ressources et des scripts de déploiement doit référencer l'arborescence selon la syntaxe stricte `/docs/...`. Toute variante utilisant des majuscules est proscrite.
* **Migration des Index Corrompus :** En cas d'apparition d'un répertoire `/Docs` fantôme dans le graphe Git, une restructuration explicite via le terminal est exigée pour forcer la réassignation des pointeurs sans perdre l'historique : `git mv Docs docs-temp && git mv docs-temp docs`.
* **Calibrage de l'Environnement de Développement :** Les contributeurs opérant sur des systèmes permissifs doivent impérativement désactiver l'ignorance de la casse au niveau local en exécutant `git config core.ignorecase false`. Cette directive prophylactique garantit la détection immédiate des dérives typographiques avant tout transfert vers la branche principale.
