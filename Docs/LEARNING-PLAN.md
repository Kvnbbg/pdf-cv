# Plan d’apprentissage — boucle Learning

> Principe directeur : le dernier état n’est pas `finish`, mais `learning`.

## Modèle opérationnel

`observer → décider → agir → mesurer → corriger → apprendre → recommencer`

Une revue réussie produit un merge. Un merge produit une production. Une production produit des observations. Les observations produisent de nouvelles questions. Les questions produisent de nouvelles compétences. Les compétences produisent de meilleures décisions. Les décisions produisent de meilleurs systèmes. La boucle devient une spirale : chaque rotation conserve les connaissances acquises par la précédente.

## Kanban d’apprentissage

| État | Question | Sortie attendue |
| --- | --- | --- |
| `backlog` | Que dois-je comprendre ? | question formulée |
| `clarifying` | Quelles hypothèses sont ambiguës ? | périmètre explicite |
| `ready` | Qu’est-ce qui est suffisamment défini pour agir ? | tâche actionnable |
| `doing` | Quelle expérience ou implémentation permet de tester l’hypothèse ? | changement minimal |
| `review` | Qu’est-ce qui contredit ou confirme l’hypothèse ? | observations |
| `merged` | Quelle connaissance est désormais intégrée ? | artefact versionné |
| `production` | Le système fonctionne-t-il dans le réel ? | résultat mesurable |
| `observed` | Que révèle le réel ? | nouvelles données/questions |
| `learning` | Quelle compétence ou règle faut-il conserver ? | connaissance réutilisable |
| `backlog` | Quelle prochaine question découle de cette connaissance ? | nouveau cycle |

## Parcours de formation

### 1. Observer
Identifier le système, ses acteurs et ses contraintes. Distinguer fait, hypothèse, interprétation et décision. Collecter les signaux avant de proposer une solution.

### 2. Clarifier
Transformer une ambiguïté en question testable. Définir le résultat attendu et les critères d’acceptation. Identifier les parties prenantes affectées.

### 3. Expérimenter
Produire le changement minimal permettant d’apprendre. Préférer une expérience réversible et mesurable. Éviter de confondre activité produite et valeur créée.

### 4. Vérifier
Tester le comportement attendu. Comparer résultat observé et hypothèse initiale. Documenter les erreurs comme information exploitable.

### 5. Capitaliser
Convertir l’observation en connaissance explicite. Relier la connaissance à une décision future. Réutiliser les composants, tests, procédures et règles déjà validés.

### 6. Transférer
Appliquer la compétence à un autre contexte : DevOps, business, projet, formation ou gestion du travail. Mesurer si la compétence reste valable hors du contexte initial.

## Critère de progression

Un apprenant ne valide pas un cycle parce qu’il a consommé une quantité de contenu. Il le valide lorsqu’il peut :

1. expliquer le problème avec davantage de précision ;
2. prendre une décision mieux justifiée ;
3. produire une action vérifiable ;
4. interpréter le résultat ;
5. corriger son modèle mental ;
6. réutiliser la connaissance dans un nouveau contexte.

## On-click events / thread

Chaque interaction pédagogique importante peut ouvrir un thread d’apprentissage :

`click → thread → question → contexte → action → observation → correction → knowledge → next action`

Le thread conserve le contexte de la décision, les observations, les corrections et la prochaine question. Il ne doit pas devenir un journal passif : chaque thread doit pouvoir produire une action ou une connaissance réutilisable.

### Contrat minimal d’un thread

```text
thread.id
thread.topic
thread.stakeholders[]
thread.question
thread.hypothesis
thread.action
thread.observations[]
thread.correction
thread.knowledge
thread.next_action
thread.status = learning | blocked | validated
```

## Métriques utiles

- délai entre observation et décision ;
- taux d’hypothèses invalidées puis corrigées ;
- taux de réutilisation des connaissances ;
- nombre de décisions améliorées par cycle ;
- temps entre erreur détectée et correction vérifiée ;
- proportion d’activité transformée en actif durable.

## Règle de conception

Ne jamais optimiser uniquement le débit de tâches. Optimiser la qualité du système de décision : moins d’ambiguïté, feedback plus rapide, corrections moins coûteuses, connaissances plus réutilisables et décisions progressivement plus précises.
