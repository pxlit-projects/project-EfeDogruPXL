# Architecture

:heavy_check_mark:_(COMMENT) Add a description of the architecture of your application and create a diagram like the one below. Link to the diagram in this document._

![Architecture](https://github.com/user-attachments/assets/276ef74b-e079-4776-b9d4-1c59924242f9)

## Client Applicaties

De Angular Web App is toegankelijk voor zowel de gebruiker als de redacteur via de browser.

## API Gateway

De API Gateway vormt het centrale punt tussen de Web App en de backend-services, waarbij het inkomende verzoeken doorstuurt naar de juiste microservices en zorgt voor controle over de communicatie tussen frontend en backend.

## Config Service

De Config Service biedt centrale configuratiebeheer voor alle microservices. Het slaat belangrijke instellingen, zoals database-configuraties en API-parameters, op één centrale locatie op. Hierdoor kunnen alle microservices consistentie in configuraties behouden, en kunnen wijzigingen eenvoudig worden doorgevoerd zonder handmatige aanpassing van elke individuele service. Dit maakt het beheer van de microservices efficiënter en eenvoudiger.

## Cloud Services (Microservices)

**PostService**

De PostService stelt redacteurs in staat om nieuwe posts aan te maken, bestaande posts te bewerken en posts te verwijderen. Alle postgegevens worden beheerd en opgeslagen in een PostgreSQL-database.

**ReviewService**

De ReviewService biedt redacteurs de mogelijkheid om posts te beoordelen en goed te keuren of af te wijzen.

**CommentService**

De CommentService stelt gebruikers in staat om reacties op posts achter te laten. Reacties worden beheerd en opgeslagen in een aparte PostgreSQL-database.

## Discovery Service (Eureka)

De Discovery Service zorgt ervoor dat microservices zichzelf kunnen registreren en elkaars locaties kunnen ontdekken binnen het netwerk. Hierdoor kunnen services elkaar vinden en ermee communiceren zonder dat handmatige configuratie vereist is, wat resulteert in een flexibel en dynamisch systeem.

## Event Bus (RabbitMQ)

De Event Bus zorgt voor de berichtenuitwisseling tussen microservices, zodat deze onafhankelijk van elkaar kunnen reageren op gebeurtenissen, zoals wanneer een nieuwe post wordt gepubliceerd.

## OpenFeign

OpenFeign maakt synchrone communicatie mogelijk tussen microservices. Dit zorgt voor directe communicatie waarbij de ene service gegevens van de andere kan ophalen wanneer dat nodig is, zonder onnodige duplicatie van logica, en draagt zo bij aan een modulaire architectuur.

**Synchronous Communication**

- **Fetching Reviews (US1, US4)**: Wanneer een bericht samen met de bijbehorende reviews wordt opgehaald, roept de PostService de ReviewService synchroon aan om reviews op te halen op basis van het post-ID.
- **Fetching Comments (US4, US10, US11)**: Om een bericht met de bijbehorende reacties op te halen, maakt de PostService een synchrone aanvraag naar de CommentService.
- **Post Approval Status (US7, US8, US9)**: Wanneer een bericht wordt goedgekeurd of afgewezen via de ReviewService, wordt de status direct bijgewerkt in de PostService.
- **Review Eligibility Check (US2, US7)**: Voordat een bericht wordt beoordeeld, controleert de ReviewService of het bericht zich in de status "ingediend" bevindt door de PostService aan te roepen.

## Message Bus

De Message Bus maakt asynchrone communicatie mogelijk tussen microservices. Dit zorgt ervoor dat microservices elkaar niet blokkeren en flexibel blijven.

**Asynchronous Communication**

- **Post Approval Notification (US7, US8)**: Wanneer een bericht wordt goedgekeurd of afgewezen in de ReviewService, wordt er een bericht verzonden. De PostService luistert naar dit bericht en werkt de status van het bericht asynchroon bij.
- **Comment Notifications (US10, US11, US12)**: Wanneer er een nieuwe reactie wordt toegevoegd in de CommentService, wordt er een event uitgezonden om andere services asynchroon te informeren, waardoor updates kunnen plaatsvinden zonder de hoofdwerking te blokkeren.

- **PostService**: Verstuurt berichten naar de Event Bus wanneer posts worden aangemaakt, aangepast, goedgekeurd of afgewezen.
- **ReviewService**: Stuurt meldingen naar de Event Bus wanneer posts worden goedgekeurd of afgewezen.
- **CommentService**: Stuurt berichten wanneer er nieuwe reacties worden geplaatst of bestaande reacties worden aangepast, zodat andere services, zoals de PostService, notificaties kunnen versturen.

## LogBack

LogBack wordt ingezet in elke microservice voor het vastleggen van loggegevens, zowel in de console als in logbestanden. Dit helpt ontwikkelaars om problemen sneller te identificeren, prestaties te analyseren en het systeem effectief te monitoren.








