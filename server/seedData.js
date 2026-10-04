import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadJsonSafe(relPath, fallback = []) {
  try {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }
  } catch (e) {
    console.error('Failed to load JSON from ' + relPath, e);
  }
  return fallback;
}

const extraLv1 = loadJsonSafe('data/lv1_topics.json');
const extraLv2 = loadJsonSafe('data/lv2_topics.json');
const extraLv3 = loadJsonSafe('data/lv3_topics.json');
const extraSb = loadJsonSafe('data/sb_topics.json');
const extraHv1 = loadJsonSafe('data/hv1_topics.json');
const extraHv2 = loadJsonSafe('data/hv2_topics.json');

export const seedTopics = {
  leseverstehen: {
    title: "Leseverstehen",
    description: "Original telc Deutsch C1 Hochschule Prüfungsaufgaben.",
    durationMinutes: 90,
    points: 48,
    teil1: {
      title: "Lesen Teil 1: Rekonstruktion eines Textes",
      subtitle: "Welche der Sätze a–h gehören in die Lücken 1–6? Zwei Sätze passen nicht.",
      topics: [
        {
          id: "telc-official-lv-t1",
          themeTitle: "Vom Abakus bis zur Z3 (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          readingTime: "ca. 20 Min",
          instructions: "Lesen Sie den folgenden Text. Welche der Sätze a–h gehören in die Lücken 1–6? Es gibt jeweils nur eine richtige Lösung. Zwei Sätze können nicht zugeordnet werden.",
          text: `Vom Abakus bis zur Z3

Im Jahre 1623 entwickelte Wilhelm Schickard, deutscher Astronom und Mathematiker, die erste Rechenmaschine. [Beispiel 0: Mit ihr ließen sich Operationen in den vier Grundrechenarten durchführen.] Nicht viel später, im Jahre 1644, stellte der französische Mathematiker und Philosoph Blaise Pascal ebenfalls eine Rechenmaschine fertig. [LÜCKE_1] Sein Modell war Ende des 17. Jahrhunderts funktionsfähig.

Charles Babbage – auf dem Weg zur Programmierung

Mit diesen ersten Rechenmaschinen konnte man jedoch nur diejenigen Rechenoperationen durchführen, für die die Maschinen konstruiert worden waren. [LÜCKE_2] Erst viel später konnte Charles Babbage, Erfinder und Professor in Cambridge, diese Lücke zunächst theoretisch schließen. Er entwickelte 1833 erstmals konkrete Pläne für einen vollständig programmierbaren Rechenautomaten und nannte ihn „Analytical Engine“.

[LÜCKE_3] Mit Hilfe von Lochkarten konnten beliebige Befehle in ebenfalls beliebiger Reihenfolge und beliebigem Umfang ausgeführt werden. Neben den einzelnen Lochkarten sollten Kombinationskarten eingesetzt werden. [LÜCKE_4] Neben den vier Grundrechenarten sollte auch das Wurzelziehen möglich sein. Die Maschine war so konstruiert, dass sich vierzigstellige Zahlen mit ihr berechnen lassen konnten. Babbage konnte seine Pläne aus finanziellen Gründen jedoch niemals in die Realität umsetzen.

[LÜCKE_5] Dennoch waren Babbages Konstruktionen so klar und überzeugend, dass aus heutiger Sicht gesagt werden kann, dass diese Pläne der Grundstein für unsere Computer waren.

Babbages Theorie wird Realität

Es dauerte nochmals fast 100 Jahre, bis Babbages Vorstellungen umgesetzt und das Zeitalter der mechanischen Rechenmaschinen überwunden werden konnte. [LÜCKE_6] Es war Konrad Zuse, der mit der Z3 den ersten funktionsfähigen digitalen Rechner konstruierte und baute – der erste Computer überhaupt. Die Z3 wurde im Jahre 1941 fertiggestellt. Jedoch wurde die Maschine nur zwei Jahre später zerstört. Dennoch kann man die Z3 auch heute noch besichtigen: Das Deutsche Museum in München stellt einen kompletten Nachbau der Z3 aus.`,
          options: [
            { key: "a", text: "Diese Konstruktion aus dem 19. Jahrhundert kann als der direkte Vorläufer unserer heutigen Computer angesehen werden." },
            { key: "b", text: "Diese sollten die Anzahl der Wiederholungen steuern, die jede einzelne Lochkarte durchläuft." },
            { key: "c", text: "Wenn eine Nadel durch die Karte ging, wurde ein Stromkreis geschlossen und ein elektrischer Zähler bedient." },
            { key: "d", text: "Dann war der erste Rechner, der programmgesteuert funktionierte, reif." },
            { key: "e", text: "Nachträgliche Änderungen waren also nicht möglich, denn die hochkomplexe Mechanik ließ diese nicht zu." },
            { key: "f", text: "Noch größere Zahlen konnten im Speicher aufbewahrt werden, um sie anschließend z. B. zu dividieren und als vierzigstellige Zahl auszugeben." },
            { key: "g", text: "Schließlich arbeitete im selben Jahrhundert auch der deutsche Universalgelehrte Gottfried Wilhelm Leibniz an einer Rechenmaschine." },
            { key: "h", text: "Seine Rechenmaschine blieb also ein theoretisches Konstrukt, dessen Funktionsfähigkeit sich nicht empirisch überprüfen ließ." }
          ],
          correctAnswers: {
            "1": "g",
            "2": "e",
            "3": "a",
            "4": "b",
            "5": "h",
            "6": "d"
          },
          explanations: {
            "1": "Satz g knüpft an Schickard und Pascal im 17. Jahrhundert an ('Schließlich arbeitete im selben Jahrhundert auch Leibniz...').",
            "2": "Satz e erklärt die Unflexibilität der ersten Rechenmaschinen ('Nachträgliche Änderungen waren also nicht möglich...').",
            "3": "Satz a bezieht sich direkt auf Babbages 1833 entwickelte 'Analytical Engine' aus dem 19. Jahrhundert.",
            "4": "Satz b schließt an die 'Kombinationskarten' an ('Diese sollten die Anzahl der Wiederholungen steuern...').",
            "5": "Satz h fasst zusammen, dass die Maschine wegen Geldmangels ein theoretisches Konstrukt blieb.",
            "6": "Satz d leitet über zu Konrad Zuses programmierbarem Rechner Z3 ('Dann war der erste Rechner, der programmgesteuert funktionierte, reif.')."
          }
        },
        ...extraLv1
      ]
    },
    teil2: {
      title: "Lesen Teil 2: Selektives Verstehen",
      subtitle: "In welchem Textabsatz a–e finden Sie die Antworten auf die Fragen 7–12?",
      topics: [
        {
          id: "telc-official-lv-t2",
          themeTitle: "Seniorenstudium: Fürs Lernen ist es nie zu spät (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          readingTime: "ca. 20 Min",
          instructions: "Lesen Sie den folgenden Text. In welchem Textabsatz a–e finden Sie die Antworten auf die Fragen 7–12? Es gibt jeweils nur eine richtige Lösung. Jeder Absatz kann Antworten auf mehrere Fragen enthalten.",
          texts: [
            {
              id: "a",
              author: "Absatz a",
              text: `Als mitten in der Vorlesung ein älterer Herr aufsteht, ist das kein gutes Zeichen. Der Geschichtsprofessor spricht gerade über die Zeit des Wirtschaftswunders. Sein Zuhörer, ein ehemaliger Chefarzt, ruft ihm zu: „Junger Mann, das muss ich jetzt noch mal klarstellen. Sie waren ja gar nicht dabei. Ich hingegen hab das damals live erlebt!“ Viele Dozenten kennen solche Momente: wenn der Seniorenstudent als belehrender Zeitzeuge auftritt, als Besserwisser, der seine Erinnerung an lange Zurückliegendes für unbestechlich hält. Der Zeitzeuge ist der natürliche Feind des Historikers, so könnte man es überspitzt und etwas bissig formulieren. Daher ist er in geschichtswissenschaftlichen Veranstaltungen nicht unbedingt ein gerngesehener Gast. Junge Studenten berichten dagegen von handfesteren Schwierigkeiten mit den älteren Kommilitonen. Senioren blockierten mit als Frage getarnten Monologen ganze Veranstaltungen, beklagen sie. Und gewiss sorgt es auch für Verdruss, wenn die aus Frühaufstehern bestehenden „grauen Blöcke“ frühmorgens in der ersten Vorlesung regelmäßig die besten Plätze besetzen, Pauschaltouristen ähnlich, die am Pool ihre Handtücher auf den Liegestühlen verteilen. Dass Alt und Jung zusammen und voneinander lernen sollen, klingt also in der Theorie besser, als es in der Praxis funktioniert. Was Anfang der achtziger Jahre innovativ war, weckt heute bei so manchen jungen Studenten und Dozenten Unmut, besonders wenn – wie gelegentlich in den Geisteswissenschaften – ältere Gasthörer in den Vorlesungen die Mehrheit bilden.`
            },
            {
              id: "b",
              author: "Absatz b",
              text: `Denn die Zahl der Senioren unter den derzeit rund 34.000 Gasthörern an deutschen Universitäten steigt. Mehr als die Hälfte von ihnen sind über 60 Jahre alt. Frauen sind fast so häufig vertreten wie Männer, und ihr Anteil wächst. Dazu kommen noch diejenigen, die nicht nur als gelegentliche oder regelmäßige Gäste in den Vorlesungen sitzen, sondern in Vollzeit studieren, promovieren oder einen Studiengang für Senioren absolvieren. Zusammen macht das nach Angaben des Akademischen Vereins der Senioren in Deutschland (AVDS) rund 55.000 Ältere – bei etwa 2,7 Millionen Studierenden insgesamt. Das mit Abstand beliebteste Fach ist seit Jahren Geschichte, gefolgt von Philosophie und Wirtschaftswissenschaften. Der AVDS beziffert die Zahl der Älteren, die sich auch oder ausschließlich mit Geschichte beschäftigen, auf 10.000.`
            },
            {
              id: "c",
              author: "Absatz c",
              text: `Die geschichtsinteressierten älteren Semester zieht es in der Tat besonders zu den Epochen hin, die sie selbst oder zumindest ihre Eltern noch miterlebt haben. Was also tun, wenn ein Seniorstudent dem „jungen Mann“ am Pult die Kompetenz abspricht? Als Reaktion darauf könnte dieser scharf intervenieren, auch wenn es möglicherweise arrogant wirkt, wenn ein jüngerer Wissenschaftler ältere Hörer ignoriert oder gar zur Ordnung ruft. Besonders schwierig wird es, wenn es um die bei Senioren besonders beliebte zeitgenössische Geschichte geht – ein Problem, das auch Martin Sabrow sehr gut kennt: „Die Geschichte des 20. Jahrhunderts berührt uns persönlich. In jedem von uns kämpfen Zeitzeuge und Zeithistoriker miteinander.“ Der 60-Jährige ist Co-Direktor des Zentrums für Zeithistorische Forschung in Potsdam und Professor für Neueste Geschichte und Zeitgeschichte an der Humboldt-Universität zu Berlin. Weder der Dozent noch der Student dürfe auf seiner Sicht beharren, erklärt er. Und der Dozent muss das Ganze moderieren – die fachliche Auseinandersetzung ebenso wie das Miteinander von Älteren und Jüngeren im Hörsaal. Nur wie?`
            },
            {
              id: "d",
              author: "Absatz d",
              text: `Denn oft entstehen im Dialog zwischen den Generationen Verständnisschwierigkeiten. Für die Dozenten ist es keine leichte Übung, sich Jüngeren und Älteren gleichermaßen verständlich zu machen – zu unterschiedlich sind Wissensstand und Erfahrungshintergrund. Und wenn schon die Vermittlung fachlicher Inhalte an so unterschiedliche Hörer Probleme bereitet, liegt es auf der Hand, dass diese auch einander oft rätselhaft bleiben. So besteht die Gefahr, dass es zu Konflikten kommt und junge und alte Studenten zwar nebeneinander, aber nicht miteinander lernen, was der ursprünglichen Idee des Seniorenstudiums widerspricht. Daher ist es für beide Seiten ratsam, unvoreingenommen aufeinander zuzugehen und sich die Sicht des Anderen zu erschließen.`
            },
            {
              id: "e",
              author: "Absatz e",
              text: `Denn dann erkennen Jüngere, dass sie vom Erfahrungsschatz der Älteren durchaus profitieren können, während die Älteren durch den Kontakt mit den Jüngeren ganz neue Perspektiven kennenlernen. Dass nicht immer alles ganz reibungslos abläuft, spricht jedenfalls keinesfalls gegen das Seniorenstudium. Außerdem: Wer möchte schon im Alter nur zuhause sitzen? Es ist doch leicht nachvollziehbar, dass viele Senioren in ihrer freien Zeit ihren Wissensdurst stillen wollen, vor allem, wenn ihnen in der Jugend Bildungschancen verwehrt wurden. Schon die demographische Entwicklung lässt vermuten, dass das Studium im Alter immer wichtiger werden wird. Die Universitäten werden sich dadurch gewiss verändern – aber auch die Seniorenstudenten selbst. Eine Chance wird darin für beide Seiten liegen.`
            }
          ],
          statements: [
            { id: "7", text: "drückt sich der Autor polemisch aus?" },
            { id: "8", text: "gibt der Autor eine Empfehlung?" },
            { id: "9", text: "gibt der Autor eine fremde Einschätzung wieder?" },
            { id: "10", text: "möchte der Autor zur Belustigung beitragen?" },
            { id: "11", text: "spricht der Autor eine Warnung aus?" },
            { id: "12", text: "stellt der Autor eine Prognose?" }
          ],
          correctAnswers: {
            "7": "a",
            "8": "d",
            "9": "c",
            "10": "a",
            "11": "d",
            "12": "e"
          },
          explanations: {
            "7": "In Absatz a: 'Der Zeitzeuge ist der natürliche Feind des Historikers...'",
            "8": "In Absatz d: 'Daher ist es für beide Seiten ratsam, unvoreingenommen aufeinander zuzugehen...'",
            "9": "In Absatz c: Zitat von Martin Sabrow ('In jedem von uns kämpfen Zeitzeuge und Zeithistoriker miteinander...').",
            "10": "In Absatz a: Vergleich der Senioren mit Pauschaltouristen, die Handtücher am Pool verteilen.",
            "11": "In Absatz d: 'So besteht die Gefahr, dass es zu Konflikten kommt...'",
            "12": "In Absatz e: 'Schon die demographische Entwicklung lässt vermuten, dass das Studium im Alter immer wichtiger werden wird...'"
          }
        },
        ...extraLv2
      ]
    },
    teil3: {
      title: "Lesen Teil 3: Detailverstehen & Globalverstehen",
      subtitle: "Aufgaben 13–23 (richtig / falsch / nicht im Text) und Aufgabe 24 (Überschrift)",
      topics: [
        {
          id: "telc-official-lv-t3",
          themeTitle: "Mehrsprachigkeit & Immersion in Kitas (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          readingTime: "ca. 25 Min",
          instructions: "Lesen Sie den folgenden Text und die Aussagen 13–23 (richtig (+), falsch (–) oder nicht im Text enthalten (x)) sowie Aufgabe 24 (passendste Überschrift).",
          text: `Mehrsprachigkeit ist in der zunehmend globalisierten Welt ein Muss. Lernen Kinder in der frühkindlichen Phase Sprachen besonders leicht oder können Erwachsene dies ebenso gut? Forscher streiten sich.

Mit Immersion tauchen Kinder schon im Alter von zwei bis sechs Jahren in Fremdsprachen ein. Ohne Schulunterricht beherrschen sie diese später wie eine zweite Muttersprache. Bei Immersion wird die zu lernende Sprache als Arbeitssprache eingesetzt, so dass die Kinder sich die Sprache auf natürliche Weise aneignen können. Wissenschaftlich ist nachgewiesen, dass Immersion ein sehr erfolgreiches Modell zum Erlernen von Fremdsprachen ist.

„This little light of mine, I’m gonna let it shine. Let it shine, let it shine, let it shine“, singen die zwei- bis sechsjährigen Kinder lauthals und beschreiben mit ausgestreckten Zeigefingern einen Kreis in der Luft. „Hide it under a bushel? No! I’m gonna let it shine“. – Ihr Englisch müssen diese Kinder wahrlich nicht unter den Scheffel stellen! Man könnte meinen, man sei einige hundert Kilometer weiter westlich auf den britischen Inseln gelandet, doch wir befinden uns im Norden Deutschlands, in der Kindertagesstätte der Arbeiterwohlfahrt in Altenholz bei Kiel. Mit Leichtigkeit singen die Kinder den Liedtext in englischer Sprache, die eigentlich eine Fremdsprache für sie ist.

In Altenholz wird seit 1996 das Immersionskonzept angewandt. In Kanada schon seit vielen Jahrzehnten bewährt, ist diese frühkindliche und natürliche Vermittlung von Fremdsprachen in Deutschland bislang noch sehr selten. Der aus dem Englischen abgeleitete Begriff der Immersion bedeutet, dass die Kinder in die fremde Sprache regelrecht „eintauchen“. „Man eignet sich die Sprache ganz eigenständig an und wird nicht korrigiert oder verbessert wie in der Schule“, sagt Sprachwissenschaftler Prof. Dr. Henning Wode von der Universität Kiel, der das Projekt in Altenholz wissenschaftlich begleitet hat. Ähnlich wie beim Erwerb der Muttersprache wird der Sinn des Gehörten aus dem Zusammenhang erschlossen.

Für eine Kita bedeutet dies, dass Englisch „Verkehrssprache“ und nicht „Lernsprache“ ist. Entscheidend ist dabei, dass die Sprache von den pädagogischen Kräften im Kontext alltäglicher Situationen verwendet wird, so dass die Kinder sie sich ohne Erklärungen erschließen können. In der Kita Altenholz geschieht dies nicht nur im Englischen, sondern fächerübergreifend. „Immersion fordert die Aufmerksamkeit der Kinder mehr“, sagt Wode. „Sie haben dadurch eine andere Lernhaltung und folgen den gemeinsamen Gruppenaktivitäten insgesamt aufmerksamer.“ Eine besondere Begabung sei für die Immersion nicht erforderlich. Die Kinder in Altenholz seien in dieser Hinsicht ganz normal.

In der Kita kümmern sich elf pädagogische Kräfte, unter ihnen drei Englisch-Muttersprachler, um 103 Kinder in fünf Gruppen. In drei Gruppen findet der Alltag auf Englisch statt. Hier wird möglichst ausschließlich Englisch mit den Kindern gesprochen. Dabei reagieren diese auf die fremde Sprache zunächst recht unterschiedlich. „Einige Kinder, beispielsweise mit einem mehrsprachigen familiären Hintergrund, haben gar keine Berührungsängste“, sagt Kita-Leiterin Sabine Devich-Henningsen, die selbst eine dänische Immersions-Kita besucht hat. „Andere Kinder, für die das neu ist, orientieren sich erst an den deutschsprachigen Mitarbeitern.“ Nach drei Wochen sei in dieser Hinsicht jedoch schon kein Unterschied mehr zwischen den Kindern festzustellen und nach maximal sechs Wochen verstünden die Kinder alles, was ihnen gesagt werde.

Mit dem aktiven Sprechen klappt es häufig noch nicht so gut. Wenn sie auf Englisch angesprochen werden, antworten die Kleinen in der Regel auch am Ende der Kita-Zeit noch auf Deutsch. Dies erwies sich zum Teil als problematisch, sobald die Kinder eingeschult wurden. Um dieser Passivität entgegenzuwirken, wird auf Wunsch der Leitung der Claus-Rixen-Schule seit Sommer 2006 an einem Vormittag in der Woche in der Kita ausschließlich Englisch gesprochen, wobei die Kinder zum aktiven Sprachgebrauch aufgefordert werden.

Immersion wird schon im Kindergarten durchgeführt, um genügend Zeit zu gewinnen, damit die Kinder während ihrer Schulzeit drei Sprachen auf einem funktional angemessenen Niveau lernen können. Wenn bereits in der Kita im Alter von drei Jahren mit der ersten Fremdsprache begonnen wird, so beherrschen die Kinder bis zum Ende der Grundschule die erste auf einem derart hervorragenden Niveau, dass genug Zeit bleibt, auch eine weitere Sprache intensiv zu lernen. Nur mit der Immersionsmethode lassen sich die Ziele der EU, die ja die Dreisprachigkeit fordert, erreichen.

Von schulischen Vorgaben und Zwängen sind die Kinder der Kita in Altenholz indes noch weit entfernt. Sie lernen die englische Sprache spielerisch kennen und entscheiden selbst, wie viel Englisch sie sich aneignen und ob sie sich lieber an den deutschen oder englischen Pädagogen orientieren wollen. Bis morgens um halb zehn können sie in der Kita frei spielen, so dass auch die Kinder der deutschsprachigen Gruppen regelmäßig mit der englischen Sprache in Kontakt kommen. Wahlweise bedienen sie sich in den Gruppenräumen an den Frühstücks- oder „breakfast“-Tischen.

Für ihren weiteren Lebensweg profitieren die Kleinen nicht nur von den ausgezeichneten Englischkenntnissen, die sie hier kindgerecht erwerben und die in einer globalisierten Arbeitswelt immer notwendiger werden. Bilinguale Kita- und Schulprojekte zeigen auch, dass damit die interkulturelle Kompetenz gestärkt wird. Die Kinder sind insgesamt aufgeschlossener und toleranter gegenüber anderssprachigen Menschen und fremden Kulturen.

Um halb zehn versammeln sich dann alle zum „morning circle“. Im täglichen Wechsel bereitet jede der fünf Gruppen Gesangseinlagen, Theateraufführungen und Geburtstagsfeiern vor. Und meistens wird dann Englisch gesprochen. Heute wird gesungen. „This little light of mine, I’m gonna let it shine“, wiederholen die Kinder den Refrain immer wieder. Man möchte meinen, man sei in Newcastle oder Edinburgh und nicht in der Nähe der Kieler Förde, so zwanglos und doch sicher gehen die Kleinen mit der englischen Sprache um.

Einige Hirnforscher meinen, dass die ersten vier Lebensjahre für den Fremdsprachenerwerb entscheidend seien. Aber dies ist nicht die Mehrheitsmeinung, und es ist auch zu einseitig. Es wird der Eindruck erweckt, dass man eine Fremdsprache nur dann erfolgreich erlernen kann, wenn dies während der ersten drei bis vier Lebensjahre einsetzt. Das ist falsch.

Aus linguistischer Perspektive hat das Projekt in Altenholz gezeigt, dass das Englische hervorragend gelernt wird. Gleichzeitig leidet das Deutsche keineswegs. Lesetests im Deutschen haben gezeigt, dass die immersiv in Englisch beschulten Kinder im Schnitt 10 bis 15 Prozent über den Leistungen von ausschließlich auf Deutsch unterrichteten Kindern liegen. Darüber hinaus ist ein nicht zu vernachlässigender Vorteil der Immersionsmethode, dass sie keine zusätzlichen Personalkosten verursacht, weil eine Pädagogin ihre Zeit sozusagen doppelt einbringt.`,
          questions: [
            { id: "13", question: "Immersion ist eine Methode zur Förderung der zweiten Muttersprache.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "b", explanation: "Falsch: Immersion dient dem Fremdsprachenerwerb, nicht der Förderung der zweiten Muttersprache." },
            { id: "14", question: "Die Kinder singen in dem norddeutschen Kindergarten auch deutsche Lieder.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "c", explanation: "Nicht im Text: Es wird nur erwähnt, dass englische Lieder gesungen werden." },
            { id: "15", question: "Die Immersionsmethode funktioniert anders als der Sprachunterricht in der Schule.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "a", explanation: "Richtig: 'Man eignet sich die Sprache ganz eigenständig an und wird nicht korrigiert oder verbessert wie in der Schule'." },
            { id: "16", question: "In deutschen Kitas wird immer mehr Englisch unterrichtet.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "c", explanation: "Nicht im Text: Es wird lediglich gesagt, dass Immersions-Kitas in Deutschland noch sehr selten sind." },
            { id: "17", question: "Einsprachig aufgewachsenen Kindern fällt es auch nach vielen Wochen schwer, Englisch zu verstehen.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "b", explanation: "Falsch: Nach maximal sechs Wochen verstehen die Kinder alles, was ihnen gesagt wird." },
            { id: "18", question: "Die Immersionsmethode wird von der EU auch für Erwachsene empfohlen.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "c", explanation: "Nicht im Text: Die EU fordert Dreisprachigkeit, eine Empfehlung für Erwachsene wird nicht erwähnt." },
            { id: "19", question: "Die Kinder der Kita Altenholz müssen alle Englisch lernen.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "b", explanation: "Falsch: Die Kinder entscheiden selbst, wie viel Englisch sie sich aneignen (nur 3 von 5 Gruppen sind englischsprachig)." },
            { id: "20", question: "Die Immersionsmethode vermittelt auch interkulturelle Kompetenz.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "a", explanation: "Richtig: 'Bilinguale Kita- und Schulprojekte zeigen auch, dass damit die interkulturelle Kompetenz gestärkt wird'." },
            { id: "21", question: "Jeden Morgen singen die Kinder ein englischsprachiges Lied.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "b", explanation: "Falsch: Im täglichen Wechsel bereitet jede Gruppe Gesang, Theater oder Geburtstage vor; heute wird gesungen." },
            { id: "22", question: "Studien zeigen, dass das Erlernen einer Fremdsprache auch später noch auf muttersprachlichem Niveau möglich ist.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "c", explanation: "Nicht im Text: Es wird nur gesagt, dass erfolgreicher Spracherwerb auch nach dem vierten Lebensjahr möglich ist." },
            { id: "23", question: "Wenn man als Kleinkind eine Fremdsprache lernt, macht man in der Muttersprache weniger Fortschritte.", options: [{ key: "a", text: "richtig" }, { key: "b", text: "falsch" }, { key: "c", text: "nicht im Text" }], correctAnswer: "b", explanation: "Falsch: Lesetests im Deutschen zeigten Leistungen 10 bis 15 Prozent über dem Durchschnitt." },
            {
              id: "24",
              question: "Welche der Überschriften a, b oder c trifft die Aussage des Textes am besten?",
              options: [
                { key: "a", text: "Fremdsprachenunterricht in deutschen Kindergärten" },
                { key: "b", text: "„Sprachbad“ im Kindergarten" },
                { key: "c", text: "Der Begriff der Immersion" }
              ],
              correctAnswer: "b",
              explanation: "Richtig: 'Sprachbad' im Kindergarten fasst das Eintauchen in die Sprache (Immersion) im Kita-Alltag am treffendsten zusammen."
            }
          ]
        },
        ...extraLv3
      ]
    }
  },

  sprachbausteine: {
    title: "Sprachbausteine",
    description: "Original telc Deutsch C1 Hochschule Sprachbausteine.",
    durationMinutes: 30,
    points: 22,
    teil1: {
      title: "Sprachbausteine (Aufgaben 25–46)",
      subtitle: "22 Lücken zur Grammatik und Lexik im Fachtext",
      topics: [
        {
          id: "telc-official-sb",
          themeTitle: "Neue Ergebnisse aus der Altersforschung (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          readingTime: "ca. 30 Min",
          instructions: "Lesen Sie den folgenden Text. Welche Lösung (a, b, c oder d) ist jeweils richtig? Lücke (0) ist ein Beispiel: [0: in den Industrieländern].",
          textTemplate: `Neue Ergebnisse aus der Altersforschung

Die Lebenserwartung in [0: den] Industrieländern steigt rasant. Hält dieser Trend [25], wird jedes [26] Baby über hundert Jahre alt werden, prognostizieren Forscher. Auch die Gesundheit [27] wird sich demnach stark verbessern.

Im 20. Jahrhundert stieg die Lebenserwartung in den meisten Industrieländern [28] 30 Jahre. Selbst wenn diese Entwicklung stagnieren [29], werden drei von vier heute geborenen Babys mindestens 75 Jahre alt. [30] zum längeren Leben jedoch unvermindert an, werden die meisten seit [31] sogar ihren 100. Geburtstag erleben, berichten deutsche und dänische Forscher im Fachblatt „The Lancet“.

„Ein sehr langes Leben ist nicht das Privileg von Generationen [32]“, sagte Kaare Christensen vom dänischen Altersforschungszentrum. Eine hohe Lebenserwartung [33] das Schicksal der meisten heute in entwickelten Ländern lebenden Menschen. Jedes zweite [34] in Deutschland zur Welt gekommenen Babys wird [35] der Forscher 102 Jahre alt, in Japan sogar 107 Jahre.

Eine Drosselung dieser Tendenz halten die Altersforscher der Universität Rostock und der Universität von Süddänemark in Odense [36] unwahrscheinlich. „Der lineare Anstieg der Lebenserwartung seit mehr als 165 Jahren deutet nicht [37] ein Limit der menschlichen Lebensspanne hin“, schreiben sie. Es gibt aber auch weniger optimistische Stimmen: „Die bisherige Entwicklung des Lebensalters wird sich [38] verlangsamen.“

Die meisten Forscher vermuten aber, dass die Menschen in Zukunft auch in sehr hohem Alter [39] Diabetes und Arthritis noch gesünder sind und sich eher selbst versorgen können als [40]. Dafür seien frühere Diagnosen und bessere medizinische Behandlungsmöglichkeiten [41].

Die Sterblichkeit in der Altersgruppe zwischen 80 [42] 90 Jahren sinkt in den Industrieländern. [43] im Jahr 1950 nur jede siebte Frau und jeder achte Mann, der 80 Jahre alt wurde, auch den 90. Geburtstag noch erlebte, sind es [44] jede dritte Frau und jeder vierte Mann.

Aber allen Prognosen [45]: Der Rekord für das längste Leben ist seit zwölf Jahren ungebrochen. [46] starb die Französin Jeanne Calment im Alter von 122 Jahren.`,
          items: [
            { id: "25", options: [{ key: "a", text: "an" }, { key: "b", text: "bei" }, { key: "c", text: "durch" }, { key: "d", text: "fest" }], correctAnswer: "a", explanation: "'anhalten' (Hält dieser Trend an...)" },
            { id: "26", options: [{ key: "a", text: "derzeit geborene zweite" }, { key: "b", text: "derzeit zweite geborene" }, { key: "c", text: "geborene derzeit zweite" }, { key: "d", text: "zweite derzeit geborene" }], correctAnswer: "d", explanation: "Wortstellung: 'jedes zweite derzeit geborene Baby'" },
            { id: "27", options: [{ key: "a", text: "im Altern" }, { key: "b", text: "im hohen Alter" }, { key: "c", text: "in Alter" }, { key: "d", text: "in hohen Alter" }], correctAnswer: "b", explanation: "Feste Fügung: 'im hohen Alter'" },
            { id: "28", options: [{ key: "a", text: "als mehr um" }, { key: "b", text: "mehr als um" }, { key: "c", text: "mehr um als" }, { key: "d", text: "um mehr als" }], correctAnswer: "d", explanation: "Präpositionalphrase: 'stieg ... um mehr als 30 Jahre'" },
            { id: "29", options: [{ key: "a", text: "könne" }, { key: "b", text: "könnte" }, { key: "c", text: "solle" }, { key: "d", text: "sollte" }], correctAnswer: "d", explanation: "Konditionalgefüge: 'Selbst wenn diese Entwicklung stagnieren sollte...'" },
            { id: "30", options: [{ key: "a", text: "Dauert der Trend" }, { key: "b", text: "Dauert ein Trend" }, { key: "c", text: "Der Trend dauert" }, { key: "d", text: "Ein Trend dauert" }], correctAnswer: "a", explanation: "Uneingeleiteter Konditionalsatz: 'Dauert der Trend ... an'" },
            { id: "31", options: [{ key: "a", text: "dem Jahr 2000 geborenen Kinder" }, { key: "b", text: "im Jahr 2000 geborenen Kinder" }, { key: "c", text: "in Jahr 2000 geborenen Kinder" }, { key: "d", text: "2000 Jahren geborenen Kinder" }], correctAnswer: "a", explanation: "Partizipialattribut: 'seit dem Jahr 2000 geborenen Kinder'" },
            { id: "32", options: [{ key: "a", text: "in der fernen Zukunft" }, { key: "b", text: "in Zukunft" }, { key: "c", text: "in die ferne Zukunft" }, { key: "d", text: "in die Zukunft" }], correctAnswer: "a", explanation: "Präpositionalgefüge: 'Generationen in der fernen Zukunft'" },
            { id: "33", options: [{ key: "a", text: "sei" }, { key: "b", text: "wurde" }, { key: "c", text: "wäre" }, { key: "d", text: "würde" }], correctAnswer: "a", explanation: "Indirekte Rede (Konjunktiv I): 'Eine hohe Lebenserwartung sei das Schicksal...'" },
            { id: "34", options: [{ key: "a", text: "der im Jahr 2007" }, { key: "b", text: "der ins Jahr 2007" }, { key: "c", text: "des im Jahr 2007" }, { key: "d", text: "des Jahres 2007" }], correctAnswer: "a", explanation: "Genitivattribut Plural: 'Jedes zweite der im Jahr 2007...'" },
            { id: "35", options: [{ key: "a", text: "Angaben zufolge" }, { key: "b", text: "folgenden Angaben" }, { key: "c", text: "nach Angaben" }, { key: "d", text: "nach folgenden Angaben" }], correctAnswer: "c", explanation: "Präposition: 'nach Angaben der Forscher'" },
            { id: "36", options: [{ key: "a", text: "–" }, { key: "b", text: "für" }, { key: "c", text: "von" }, { key: "d", text: "zu" }], correctAnswer: "b", explanation: "Feste Verb-Präposition-Verbindung: 'halten für' (+ Adjektiv: unwahrscheinlich)" },
            { id: "37", options: [{ key: "a", text: "–" }, { key: "b", text: "an" }, { key: "c", text: "auf" }, { key: "d", text: "für" }], correctAnswer: "c", explanation: "Verb-Präposition: 'hindeuten auf' (+ Akkusativ)" },
            { id: "38", options: [{ key: "a", text: "vermeidbar" }, { key: "b", text: "vermeidlich" }, { key: "c", text: "vermeintlich" }, { key: "d", text: "vermutlich" }], correctAnswer: "d", explanation: "Adverb: 'wird sich vermutlich verlangsamen'" },
            { id: "39", options: [{ key: "a", text: "mit" }, { key: "b", text: "obgleich" }, { key: "c", text: "trotz" }, { key: "d", text: "wegen" }], correctAnswer: "c", explanation: "Präposition mit Genitiv/Dativ: 'trotz Diabetes und Arthritis'" },
            { id: "40", options: [{ key: "a", text: "heut Zutage" }, { key: "b", text: "Heutzutage" }, { key: "c", text: "heutzutage" }, { key: "d", text: "heut zu Tage" }], correctAnswer: "c", explanation: "Rechtschreibung: Adverb 'heutzutage'" },
            { id: "41", options: [{ key: "a", text: "verantwortbar" }, { key: "b", text: "verantwortet" }, { key: "c", text: "verantwortlich" }, { key: "d", text: "verantwortungsvoll" }], correctAnswer: "c", explanation: "Prädikatives Adjektiv: 'Dafür seien ... Behandlungsmöglichkeiten verantwortlich.'" },
            { id: "42", options: [{ key: "a", text: "bis" }, { key: "b", text: "gegen" }, { key: "c", text: "oder" }, { key: "d", text: "und" }], correctAnswer: "d", explanation: "Fügung: 'zwischen 80 und 90 Jahren'" },
            { id: "43", options: [{ key: "a", text: "Indem" }, { key: "b", text: "Nachdem" }, { key: "c", text: "Obwohl" }, { key: "d", text: "Während" }], correctAnswer: "d", explanation: "Adversative Konjunktion: 'Während im Jahr 1950...'" },
            { id: "44", options: [{ key: "a", text: "inzwischen" }, { key: "b", text: "nachdem" }, { key: "c", text: "seitdem" }, { key: "d", text: "vorher" }], correctAnswer: "a", explanation: "Temporales Adverb: 'sind es inzwischen jede dritte Frau...'" },
            { id: "45", options: [{ key: "a", text: "zu trotz" }, { key: "b", text: "zu Trotz" }, { key: "c", text: "zum Trotz" }, { key: "d", text: "zumtrotz" }], correctAnswer: "c", explanation: "Feste Redewendung: 'allen Prognosen zum Trotz'" },
            { id: "46", options: [{ key: "a", text: "Damals" }, { key: "b", text: "Danach" }, { key: "c", text: "Dennoch" }, { key: "d", text: "Deshalb" }], correctAnswer: "a", explanation: "Zeitadverb: 'Damals starb die Französin Jeanne Calment...'" }
          ]
        },
        ...extraSb
      ]
    }
  },

  hoerverstehen: {
    title: "Hörverstehen",
    description: "Original telc Deutsch C1 Hochschule Hörverstehen.",
    durationMinutes: 40,
    points: 48,
    teil1: {
      title: "Hören Teil 1: Globalverstehen (Aufgaben 47–54)",
      subtitle: "Meinungen von 8 Personen zum Thema 'Studentische Lebensformen' (Aussagen a–j)",
      topics: [
        {
          id: "telc-official-hv-t1",
          themeTitle: "Studentische Lebensformen (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          audioTranscript: `Thema: „Studentische Lebensformen“
Sprecherin 1: Ich war zu Beginn meines Studiums ziemlich naiv... Ich wollte unbedingt alleine wohnen! Aber in Köln waren die Mieten zu hoch. Also bin ich notgedrungen in eine WG gezogen. Heute kann ich mir gar nicht mehr vorstellen, alleine zu wohnen.
Sprecher 2: Seit drei Semestern bin ich an der Uni... Ich wohne lieber alleine. Für mich war entscheidend, dass ich mir eine Wohnung wirklich selbst aussuchen kann: die Lage, die Größe, den Vermieter.
Sprecherin 3: Ich wohnte im ersten Semester in einem Vierbettzimmer im Wohnheim. Irgendwie hat mir einfach die Privatsphäre gefehlt. Mir wäre ein Zimmer nur für mich lieber gewesen.
Sprecher 4: Wir von der Zimmer- und Wohnungsvermittlung an der Uni Zürich vermitteln Zimmer und Wohnungen. In den letzten Jahren hat die Anzahl der Studierenden, die ein Zimmer alleine suchen, abgenommen. Es gibt wieder mehr WGs.
Sprecherin 5: Im letzten Jahr habe ich ein Auslandssemester in den USA gemacht und auf dem Campus gelebt. Hier in Deutschland wohne ich bei den Eltern. Seit Amerika fehlt es mir, mit anderen Studierenden zusammenzuwohnen.
Sprecher 6: Ich habe als Erstes nach einer Wohnung für mich gesucht. Ich wollte auf keinen Fall mein Zimmer teilen. Mein älterer Bruder hat in einer WG gewohnt und da gab es immer Streit ums Aufräumen und Einkaufen.
Sprecherin 7: Ich untervermiete ein kleines Zimmer an Studierende. So halte ich Kontakt zur jüngeren Generation und bleibe geistig fit. Beide Seiten profitieren voneinander.
Sprecher 8: Als Student habe ich mir mit einem Freund ein Zimmer bei einer älteren Dame geteilt. Es war anstrengend, weil sie sich dauernd beschwert hat, aber es war einfach unschlagbar günstig.`,
          optionsStatements: [
            { key: "a", text: "Viele Studierende wohnen lieber allein, obwohl es relativ teuer ist." },
            { key: "b", text: "Für mich gehört es zu einem Studium dazu, mit anderen Studierenden zusammenzuwohnen." },
            { key: "c", text: "In einem Mehrbettzimmer ist praktisch kein Raum für Privates." },
            { key: "d", text: "In einer Wohngemeinschaft sind Konflikte vorprogrammiert." },
            { key: "e", text: "Man hat in einem Mehrbettzimmer noch genügend Raum für sich, wenn nicht alle Betten belegt sind." },
            { key: "f", text: "Man hat mehr Entscheidungsfreiheit, wenn man eine Wohnung für sich selbst sucht." },
            { key: "g", text: "Manchmal hilft der Zufall dabei, die richtige Wohnform für sich selbst zu finden." },
            { key: "h", text: "Sowohl Ältere als auch Jüngere können vom Zusammenleben profitieren." },
            { key: "i", text: "Unter Studierenden geht der Trend eher weg von Singlewohnungen." },
            { key: "j", text: "Wenn mehrere Generationen zusammenwohnen, gehören Konflikte zum Alltag." }
          ],
          items: [
            { id: "47", prompt: "Sprecherin 1", correctAnswer: "g", explanation: "Sprecherin 1 fand durch Zufall/Notgedrungen zur WG und ist heute glücklich damit." },
            { id: "48", prompt: "Sprecher 2", correctAnswer: "f", explanation: "Sprecher 2 wollte Entscheidungsfreiheit bei Lage, Größe und Vermieter." },
            { id: "49", prompt: "Sprecherin 3", correctAnswer: "c", explanation: "Sprecherin 3 fehlte im Mehrbettzimmer die Privatsphäre." },
            { id: "50", prompt: "Sprecher 4", correctAnswer: "i", explanation: "Sprecher 4 berichtet, dass der Trend von Singlewohnungen weg zu WGs geht." },
            { id: "51", prompt: "Sprecherin 5", correctAnswer: "b", explanation: "Sprecherin 5 findet, dass Zusammenwohnen mit Kommilitonen zum Studium dazugehört." },
            { id: "52", prompt: "Sprecher 6", correctAnswer: "d", explanation: "Sprecher 6 verweist auf Konflikte beim Saubermachen/Einkaufen in WGs." },
            { id: "53", prompt: "Sprecherin 7", correctAnswer: "h", explanation: "Sprecherin 7 betont den beidseitigen Nutzen von Alt und Jung." },
            { id: "54", prompt: "Sprecher 8", correctAnswer: "j", explanation: "Sprecher 8 berichtet von Konflikten mit der älteren Vermieterin im Alltag." }
          ]
        },
        ...extraHv1
      ]
    },
    teil2: {
      title: "Hören Teil 2: Detailverstehen (Aufgaben 55–64)",
      subtitle: "Interview mit Prof. Albrecht Beutelspacher zum 'Jahr der Mathematik'",
      topics: [
        {
          id: "telc-official-hv-t2",
          themeTitle: "Interview: Jahr der Mathematik (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          audioTranscript: `Interview mit Prof. Albrecht Beutelspacher zum 'Jahr der Mathematik' (Auszug):
Interviewerin: Herr Beutelspacher, 'Mathe macht glücklich' ist ein Satz von Ihnen. Welchen Glücksmoment hat Ihnen die Mathematik zuletzt beschert?
Beutelspacher: Solche Glücksmomente habe ich täglich... wenn man sieht, dass es letztlich ganz einfach ist und es 'klick' macht...
Interviewerin: Was genau ist schön beispielsweise an einem Fünfeck?
Beutelspacher: Fünfecke sind gar nicht so einfach. Ein Dreieck oder Quadrat kann jeder freihändig zeichnen, aber beim Fünfeck scheitern die meisten.
Interviewerin: Ihre Lieblingszahl ist die Acht...
Beutelspacher: Die Acht ist zwei mal zwei mal zwei – die Symmetrie der Symmetrie der Symmetrie. Sie gibt fast ein bisschen an...
Im Unterricht können Schüler bei Mathe im Gegensatz zu Deutsch von Anfang an selbst nachvollziehen, ob ein Ergebnis richtig ist.
Woran liegt der Mangel an Begeisterung? An der Tradition nach Gauß: alles hundertprozentig, aber der Zugang fehlt. Man muss Mathe selbst entdecken.`,
          items: [
            {
              id: "55",
              question: "Herr Beutelspacher ist",
              options: [
                { key: "a", text: "begeistert, wenn er die Lösung eines Problems begreift." },
                { key: "b", text: "fasziniert von Menschen, die die Grundlagen der Welt verstehen." },
                { key: "c", text: "glücklich, wenn er Menschen Mathematik erklären kann." }
              ],
              correctAnswer: "a",
              explanation: "Richtig ist a: Beutelspacher beschreibt den 'Klick'-Moment des Verstehens als tägliches Glücksgefühl."
            },
            {
              id: "56",
              question: "Ein Fünfeck",
              options: [
                { key: "a", text: "gelingt Herrn Beutelspacher nur selten spontan." },
                { key: "b", text: "ist auch ohne Hilfsmittel einfach zu konstruieren." },
                { key: "c", text: "kann jeder Mensch freihändig ganz gut zeichnen." }
              ],
              correctAnswer: "a",
              explanation: "Richtig ist a: Er muss Fünfecke an der Tafel meistens korrigieren."
            },
            {
              id: "57",
              question: "Die Zahl Acht",
              options: [
                { key: "a", text: "kommt Herrn Beutelspacher fast schon prahlerisch vor." },
                { key: "b", text: "kommt in einer Mozart-Oper vor." },
                { key: "c", text: "macht Herrn Beutelspacher große Angst." }
              ],
              correctAnswer: "a",
              explanation: "Richtig ist a: Die Acht gibt mit ihrer dreifachen Symmetrie 'fast ein bisschen an'."
            },
            {
              id: "58",
              question: "Im Unterrichtsfach Mathematik",
              options: [
                { key: "a", text: "entscheiden die Lehrer, welche Lösung richtig ist." },
                { key: "b", text: "haben Lehrer mehr Macht als im Fach Deutsch." },
                { key: "c", text: "können Schüler die Ergebnisse und Fehler selbst nachvollziehen." }
              ],
              correctAnswer: "c",
              explanation: "Richtig ist c: In Mathe können Schüler selbst logisch erkennen, ob gerechnet wurde."
            },
            {
              id: "59",
              question: "Mit Mathematik",
              options: [
                { key: "a", text: "begreift man auch seine Gefühle besser." },
                { key: "b", text: "gelangt man an die Grenzen des eigenen Denkvermögens." },
                { key: "c", text: "kann man auch Dinge jenseits der Vernunft beschreiben." }
              ],
              correctAnswer: "b",
              explanation: "Richtig ist b: Man stößt in Unendlichkeiten an die Grenzen menschlicher Erkenntnis."
            },
            {
              id: "60",
              question: "Mathematik mit Bezug zum Alltag",
              options: [
                { key: "a", text: "spielt im Schulunterricht nur selten eine Rolle." },
                { key: "b", text: "wird in traditionellen Lehrmethoden stark berücksichtigt." },
                { key: "c", text: "wird zukünftigen Mathematiklehrern gezielt vermittelt." }
              ],
              correctAnswer: "a",
              explanation: "Richtig ist a: Reale Alltagserfahrungen kommen im traditionellen Unterricht kaum vor."
            },
            {
              id: "61",
              question: "Mathematiklehrer",
              options: [
                { key: "a", text: "beschränken sich bei der Darstellung der Mathematik meist auf das Wesentliche." },
                { key: "b", text: "müssten sich mehr als Künstler fühlen." },
                { key: "c", text: "sind nicht so engagiert wie andere Lehrer." }
              ],
              correctAnswer: "a",
              explanation: "Richtig ist a: Die mathematische Tradition nach Gauß beschränkt sich strikt auf das Wesentliche."
            },
            {
              id: "62",
              question: "Um Mathematik zu lernen,",
              options: [
                { key: "a", text: "sollte jeder seinen eigenen Zugang zur Mathematik finden." },
                { key: "b", text: "sollten die Schüler Lehrer haben, die sich besser mit der Mathematik identifizieren." },
                { key: "c", text: "sollten die Schüler Lernangebote außerhalb der Schule nutzen." }
              ],
              correctAnswer: "a",
              explanation: "Richtig ist a: Lernende müssen ihren eigenen Zugang finden und Mathe selbst entdecken."
            },
            {
              id: "63",
              question: "Das Interessante an der Mathematik sind vor allem",
              options: [
                { key: "a", text: "die aktuellen technischen Anwendungen." },
                { key: "b", text: "die Themen, unabhängig von einer Anwendung." },
                { key: "c", text: "geometrische Formen." }
              ],
              correctAnswer: "b",
              explanation: "Richtig ist b: Das Tolle sind die Themen an sich, unabhängig von reinen Anwendungen."
            },
            {
              id: "64",
              question: "Der Nutzen der Mathematik",
              options: [
                { key: "a", text: "ist im alltäglichen Leben nicht immer präsent." },
                { key: "b", text: "liegt in ihrer Bedeutung für den Schulunterricht." },
                { key: "c", text: "rechtfertigt Bildungsinvestitionen." }
              ],
              correctAnswer: "c",
              explanation: "Richtig ist c: Unser technischer Fortschritt hängt von Mathe ab, weshalb Investitionen nötig sind."
            }
          ]
        },
        ...extraHv2
      ]
    },
    teil3: {
      title: "Hören Teil 3: Informationstransfer (Aufgaben 65–74)",
      subtitle: "Fachdidaktikseminar 'Literatur im Unterricht DaF' (Dr. Vera Thürmer)",
      topics: [
        {
          id: "telc-official-hv-t3",
          themeTitle: "Fachdidaktik: Literatur im Unterricht DaF (Offizieller telc Modellsatz 1)",
          difficulty: "C1 Hochschule",
          audioTranscript: `Gastvortrag: Literatur im Unterricht Deutsch als Fremdsprache (Dr. Vera Thürmer)
Stiftung Lesen Studie: 'Jeder Vierte liest keine Bücher.'
Medienpädagogischer Forschungsverbund: Beruhigende Nachricht: Bücher werden weiterhin/in Zukunft gelesen.
IGLU-Studie: Anregende Formen des Unterrichts wie das Verfassen eigener Texte oder kreative Verarbeitung des Gelesenen.
LitAfrika Lesesafari: Kreative Präsentationen in Form von Liedern, Theaterstücken, Interviews oder Hörspielen.
Rahmenplan DaF: Früher dominierte Alltagskommunikation und Textinterpretation; neuer Rahmenplan: kreatives Schreiben und neue Lust am Lesen.
Jugendbuchmarkt: 6000 Neuerscheinungen jährlich mit Identifikationsthemen wie erste Liebe, Freundschaft, Familie.
Unterrichtsideen: Verfassen eines neuen Endes einer Geschichte oder Brief an die Hauptfigur.
Textauswahl: Gute Erfahrungen mit Texten, die sprachlich verständlich, aber doppelsinnig oder lustig sind.
Enzensberger nannte Lektüre einen anarchischen Akt – besser trifft aber zu: Autonomie des Lesers / der Leser soll selbst entscheiden.`,
          items: [
            { id: "65", prompt: "Umfrage Stiftung Lesen – Zentrale Aussage:", answerKey: "Jeder Vierte liest keine Bücher", explanation: "Lösung: jeder Vierte / 4. liest keine / nicht Bücher" },
            { id: "66", prompt: "Medienpädagogischer Forschungsverbund – Beruhigende Nachricht:", answerKey: "Bücher werden weiterhin gelesen", explanation: "Lösung: Bücher werden weiterhin / immer noch / in Zukunft gelesen" },
            { id: "67", prompt: "IGLU Anregende Formen des Unterrichts:", answerKey: "Verfassen eigener Texte / kreative Verarbeitung des Gelesenen", explanation: "Lösung: Schreiben eigener Texte / kreative Methoden" },
            { id: "68", prompt: "LitAfrika Übungsformen & kreative Präsentationen:", answerKey: "Lieder / Theaterstücke / Interviews / Hörspiele", explanation: "Lösung: Lieder, Theaterstücke, Interviews oder Hörspiele" },
            { id: "69", prompt: "Neuer Rahmenplan DaF – Alte Methode:", answerKey: "Alltagskommunikation / Textinterpretation", explanation: "Lösung: Alltagskommunikation / Literaturinterpretationen" },
            { id: "70", prompt: "Neuer Rahmenplan DaF – Neue Methode:", answerKey: "Kreatives Schreiben / Lust am Lesen", explanation: "Lösung: Kreatives Schreiben / literarisches Kunstwerk nicht mehr allein im Mittelpunkt" },
            { id: "71", prompt: "Kinder- und Jugendbuchmarkt – Identifikationsthemen:", answerKey: "Erste Liebe / Freundschaft / Familie", explanation: "Lösung: (erste) Liebe, Freundschaft, Familie" },
            { id: "72", prompt: "Kinder- und Jugendbuchmarkt – Unterrichtsideen:", answerKey: "Neues Ende verfassen / Brief an die Hauptfigur schreiben", explanation: "Lösung: Verfassen eines neuen Endes / Brief an Hauptfigur" },
            { id: "73", prompt: "Textauswahl: Gut verständlich, dabei aber:", answerKey: "doppelsinnig oder lustig", explanation: "Lösung: doppelsinnig / lustig" },
            { id: "74", prompt: "Enzensberger: 'Lektüre ist anarchischer Akt.' Eher trifft zu:", answerKey: "Autonomie des Lesers / Leser entscheidet selbst", explanation: "Lösung: Autonomie des Lesers / Leser soll selbst entscheiden" }
          ]
        }
      ]
    }
  },

  schriftlicherAusdruck: {
    title: "Schriftlicher Ausdruck",
    description: "Original telc Deutsch C1 Hochschule Schreibaufgaben (70 Min, mind. 350 Wörter).",
    durationMinutes: 70,
    points: 48,
    topics: [
      {
        id: "telc-official-sa-set1",
        themeTitle: "Schriftlicher Ausdruck (Übungstest 1: Thema 1 oder Thema 2)",
        instructions: "Wählen Sie eines der folgenden zwei Themen. Schreiben Sie einen Text, in dem Sie Ihren eigenen Standpunkt dazu erarbeiten und argumentativ darlegen. Ihr Text soll mindestens 350 Wörter umfassen. Sie haben 70 Minuten Zeit.",
        theme1: {
          id: "thema-1",
          title: "Thema 1: Literatur",
          category: "Kultur & Wissenschaft",
          prompt: `In einer Seminararbeit sollen Sie das Thema „Literatur“ aus unterschiedlichen Perspektiven beleuchten.

Sie können die unten stehenden Zitate zur Orientierung verwenden, aber auch andere Aspekte des Themas darlegen.
Argumentieren Sie überzeugend, führen Sie Beispiele an und gliedern Sie Ihren Text in Einleitung, Hauptteil und Schluss.

Zitate zur Orientierung:
• „Literatur hat nie etwas Negatives verhindern können.“
• „Literatur bietet mehr Orientierung als alles andere.“`
        },
        theme2: {
          id: "thema-2",
          title: "Thema 2: Gruppenarbeit",
          category: "Hochschuldidaktik & Arbeitswelt",
          prompt: `In einer Seminararbeit sollen Sie das Thema „Gruppenarbeit“ aus unterschiedlichen Perspektiven beleuchten.

Sie können die unten stehenden Zitate zur Orientierung verwenden, aber auch andere Aspekte des Themas darlegen.
Argumentieren Sie überzeugend, führen Sie Beispiele an und gliedern Sie Ihren Text in Einleitung, Hauptteil und Schluss.

Zitate zur Orientierung:
• „Gruppenarbeit kostet doch nur Zeit, weil man alles ausdiskutieren muss.“
• „Teamarbeit bietet dem Einzelnen viel mehr Möglichkeiten.“`
        }
      }
    ]
  },

  muendlicherAusdruck: {
    title: "Mündlicher Ausdruck",
    description: "Original telc Deutsch C1 Hochschule Sprechaufgaben (Teil 1A, 1B, 2).",
    durationMinutes: 20,
    points: 48,
    teil1A: {
      title: "Teil 1A: Präsentation (3 Minuten)",
      topics: [
        { id: "telc-ma-1", title: "Welche Erfindung halten Sie für besonders wichtig? Hat diese Erfindung nur Vorteile oder auch Nachteile?" },
        { id: "telc-ma-2", title: "Beschreiben Sie das System der universitären Ausbildung in einem Land Ihrer Wahl." },
        { id: "telc-ma-3", title: "Beschreiben Sie, welche Erfahrungen oder bisherigen Tätigkeiten Sie zu Ihrer Studien- oder Berufswahl bewogen haben." },
        { id: "telc-ma-4", title: "Welche künstlerischen Fächer (Kunst, Musik, Tanz, Theater) sollten im Schulunterricht gelehrt werden?" },
        { id: "telc-ma-5", title: "Wie man Fremdsprachen lernt und lehrt im internationalen Vergleich (Lehrer, Lehrbücher)." },
        { id: "telc-ma-6", title: "Welche Fächer sind für die Menschheit wichtiger: Natur- oder Geisteswissenschaften?" }
      ]
    },
    teil1B: {
      title: "Teil 1B: Zusammenfassung & Anschlussfragen (2 Minuten)",
      topics: [
        { id: "telc-ma-1b", title: "Präsentation des Partners zusammenfassen und vertiefende Anschlussfragen stellen." }
      ]
    },
    teil2: {
      title: "Teil 2: Diskussion (6 Minuten)",
      topics: [
        {
          id: "telc-ma-disk-1",
          title: "„Die beste Bildung findet ein kluger Mensch auf Reisen.“ (Goethe)",
          prompts: [
            "Wie verstehen Sie diese Aussage?",
            "Inwiefern teilen Sie diese Ansicht?",
            "Geben Sie dazu Gründe und Beispiele an.",
            "Gehen Sie auch auf die Argumente Ihres Partners ein."
          ]
        },
        {
          id: "telc-ma-disk-2",
          title: "„Am Mut hängt der Erfolg.“ (Theodor Fontane)",
          prompts: [
            "Bedeutung von Wagnis und Risikobereitschaft in Wissenschaft und Karriere",
            "Grenzen von mutigen Entscheidungen und Notwendigkeit von Besonnenheit"
          ]
        },
        {
          id: "telc-ma-disk-3",
          title: "„Auf Kinder wirkt das Vorbild, nicht die Kritik.“ (Heinrich Thiersch)",
          prompts: [
            "Rolle von Vorbildern in Erziehung und Hochschule",
            "Funktion konstruktiver Kritik im Lernprozess"
          ]
        },
        {
          id: "telc-ma-disk-4",
          title: "„Ohne Leiden bildet sich kein Charakter.“ (Ernst von Feuchtersleben)",
          prompts: [
            "Bedeutung von Rückschlägen für die persönliche Reife",
            "Möglichkeiten positiver Motivation ohne Leidenserfahrungen"
          ]
        }
      ]
    }
  }
};
