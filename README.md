[![Build Status](https://travis-ci.com/iFaxity/js-projekt-client.svg?branch=master)](https://travis-ci.com/iFaxity/js-projekt-client)
[![Build Status](https://scrutinizer-ci.com/g/iFaxity/js-projekt-client/badges/build.png?b=master)](https://scrutinizer-ci.com/g/iFaxity/js-projekt-client/build-status/master)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/iFaxity/js-projekt-client/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/iFaxity/js-projekt-client/?branch=master)
[![Code Coverage](https://scrutinizer-ci.com/g/iFaxity/js-projekt-client/badges/coverage.png?b=master)](https://scrutinizer-ci.com/g/iFaxity/js-projekt-client/?branch=master)


# Chnc16 projekt i kursen jsramverk

## Installera moduler

För att installera modulerna kör:

`npm install`

Du kanske får en varning om att ett paket är osäkert (serialize-to-js).
Det är eftersom ett paket som bundlar alla filer (parcel-bundler) har inte uppdaterat paketet som felar, men det är inga problem.
Borde dock vara fixat i den senaste versionen.



## Starta hemsidan

För att starta servern kör:

`npm run serve`

Sedan ska hemsidan öppnas via din standardwebbläsare.
Annars står det i konsollen vilken URL hemsidan har.




## Frontend

Själva byggstenen i projektet är Vue som rendererar och hanterar all data på sidan.
Sidan använder sig även av socket.io för att enkelt koppla en websocket till en API-server som skickar prisförändringar som sedan ska presenteras på sidan.
För att visa dessa prisförändringar använde jag mig av Chart.js som ritan upp en graf.
För att rita graferna för prisjusteringar valde jag Chart.js eftersom det verkade enkelt att få fungera med Vue. Det var även enkelt till att konfigurera Chart.js så att grafen ser bra ut.

Valde Parcel för att bundla mina filer eftersom det ger mig mer frihet i hur min applikation ska se ut och vad för plugins jag vill använda. Som t.ex om jag vill ha Pug i mina Vue mallar.



## Realtid

Frontenden kopplar upp sig mot API servern och lyssnar på ett event som uppdaterar priserna på sidan.
Med detta eventet uppdateras även en graf som ritar upp de senaste priserna på sidan.
Så man kan se vart priser tar vägen och hjälpa användaren att ta beslut.



## Tester frontend

Use cases:

1. Användaren skall kunna klicka på "Login" för att komma till login sidan.

2. Användaren skall kunna klicka på "Registrera" för att komma till registrera sidan.

3. Användaren skall kunna klicka på "Login" för att komma till login sidan och logga in, efter det klicka på Betalmedel och sätta in pengar på sitt konto.

4. Användaren skall kunna klicka på "Login" för att komma till login sidan och logga in, efter det kunna köpa ett bakverk på förstasidan.

5. Användaren skall kunna klicka på "Login" för att komma till login sidan och logga in, efter det kunna sälja ett bakverk på förstasidan.
