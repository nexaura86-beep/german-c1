import json
import os

topics = [
    {
        "id": "hv1-wikipedia",
        "themeTitle": "Wikipedia",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Wikipedia im akademischen und gesellschaftlichen Diskurs.
Moderator: Willkommen zu unserer Diskussionsrunde über die freie Online-Enzyklopädie Wikipedia. Acht Personen schildern ihre persönlichen Meinungen und Erfahrungen.

Sprecherin 1: Als Dozentin an der Universität muss ich ganz klar sagen: Für das Verfassen wissenschaftlicher Arbeiten wie Seminar- oder Bachelorarbeiten ist Wikipedia schlicht ungeeignet. Die Artikel können von jedermann editiert werden, Quellen sind oft lückenhaft und wissenschaftliche Standards werden selten garantiert. Man darf Wikipedia keinesfalls als zitierfähige Quelle heranziehen.

Sprecher 2: In der ganzen Debatte um die angebliche Unzuverlässigkeit geht es doch gar nicht wirklich um die Qualität der Texte. Viele Kritiker aus der traditionellen Verlagswelt und Wissenschaft nutzen die Diskussion über inhaltliche Mängel nur als Vorwand. In Wirklichkeit stört sie der Verlust ihres Deutungsmonopols auf Wissen.

Sprecherin 3: Ich halte ein pauschales Verbot von Wikipedia an Schulen und Universitäten für völlig verfehlt. Universitäten und Hochschulen haben vielmehr die didaktische Pflicht, Studierenden einen reflektierten, kritischen Umgang mit Wikipedia beizubringen – wie man Quellen verifiziert und Artikel historisch einordnet.

Sprecher 4: Mich fasziniert vor allem die unglaubliche Hingabe der vielen freiwilligen Autoren und Editoren weltweit. Menschen investieren zahllose unbezahlte Stunden, recherchieren akribisch und korrigieren Fehler. Diese gemeinschaftliche Leidenschaft und der selbstlose Einsatz verdienen unseren größten Respekt.

Sprecherin 5: Letztlich liegt die Verantwortung beim mündigen Leser selbst. Jeder Internetnutzer muss die Fähigkeit entwickeln, Informationen selbstständig abzuwägen und zu entscheiden, wie weit er einem bestimmten Artikel vertraut. Ein blindes Vertrauen ist nirgendwo angebracht, aber eine bevormundende Zensur erst recht nicht.

Sprecher 6: Schauen wir uns die Realität an: Wikipedia ist heute die meistbesuchte Wissensplattform der Menschheit. Kein gedrucktes Lexikon der Welt kann mit dieser Reichweite und Dynamik konkurrieren. Der weltweite Triumphzug von Wikipedia ist unaufhaltsam und hat das Informationszeitalter dauerhaft geprägt.

Sprecherin 7: Was mich an Wikipedia zutiefst begeistert, ist der demokratische Grundgedanke: Freies Wissen für ausnahmslos alle Menschen, unabhängig von sozialer Herkunft, Geldbeutel oder Bildungsgrad. Wikipedia leistet einen unschätzbaren Beitrag zu weltweiter Bildungsgerechtigkeit und Chancengleichheit.

Sprecher 8: Viele werfen Wikipedia mangelnde Neutralität vor. Aber Hand aufs Herz: Auch traditionelle Zeitungen, wissenschaftliche Fachzeitschriften und Schulbücher sind nie völlig frei von subjektiven Tendenzen und Interessenkonflikten. Ein Mangel an absoluter Objektivität ist ein generelles Problem aller Medien, nicht nur von Wikipedia.""",
        "optionsStatements": [
            {"key": "a", "text": "Wikipedia sichert gleichberechtigten Zugang zu Wissen."},
            {"key": "b", "text": "Der Siegeszug von Wikipedia ist nicht zu stoppen."},
            {"key": "c", "text": "Ein wichtiger Vorteil von Wikipedia ist die Aktualität der Informationen."},
            {"key": "d", "text": "In der Diskussion um Wikipedia ist die inhaltliche Beschaffenheit der Artikel nur ein Scheinargument."},
            {"key": "e", "text": "Mangelnde Objektivität stellt nicht nur bei Wikipedia ein Problem dar."},
            {"key": "f", "text": "User sollten selbst entscheiden, wie weit sie den Inhalten von Wikipedia vertrauen möchten."},
            {"key": "g", "text": "Wikipedia ist als Quelle für wissenschaftliches Arbeiten nicht verlässlich genug."},
            {"key": "h", "text": "Akademische Ausbildungsstätten sollten zu einer durchdachten Verwendung von Wikipedia erziehen."},
            {"key": "i", "text": "Wikipedia-Verfasser zeugen von einem bewunderungswürdigen Einsatz."},
            {"key": "j", "text": "Wikipedia wird auf Dauer nicht ohne Nutzungsbeiträge funktionieren."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecherin 1", "correctAnswer": "g", "explanation": "Sprecherin 1 betont, dass Wikipedia für Seminar- und wissenschaftliche Arbeiten ungeeignet und nicht zitierfähig ist."},
            {"id": "48", "prompt": "Sprecher 2", "correctAnswer": "d", "explanation": "Sprecher 2 meint, die Diskussion um Mängel sei nur ein Vorwand (Scheinargument) von Kritikern, die ihr Monopol verlieren."},
            {"id": "49", "prompt": "Sprecherin 3", "correctAnswer": "h", "explanation": "Sprecherin 3 fordert Hochschulen auf, Studierende zu einem kritischen und durchdachten Umgang mit Wikipedia anzuleiten."},
            {"id": "50", "prompt": "Sprecher 4", "correctAnswer": "i", "explanation": "Sprecher 4 bewundert den ehrenamtlichen und leidenschaftlichen Einsatz der vielen Wikipedia-Autoren."},
            {"id": "51", "prompt": "Sprecherin 5", "correctAnswer": "f", "explanation": "Sprecherin 5 argumentiert, dass jeder Nutzer eigenverantwortlich abwägen und entscheiden muss, wie weit er den Inhalten vertraut."},
            {"id": "52", "prompt": "Sprecher 6", "correctAnswer": "b", "explanation": "Sprecher 6 stellt fest, dass der Siegeszug und weltweite Erfolg von Wikipedia unaufhaltsam ist."},
            {"id": "53", "prompt": "Sprecherin 7", "correctAnswer": "a", "explanation": "Sprecherin 7 lobt, dass Wikipedia jedem Menschen unabhängig von Herkunft und Geldbeutel gleichen Zugang zu Bildung sichert."},
            {"id": "54", "prompt": "Sprecher 8", "correctAnswer": "e", "explanation": "Sprecher 8 erklärt, dass mangelnde Objektivität nicht nur Wikipedia betrifft, sondern ein generelles Problem aller Medien darstellt."}
        ]
    },
    {
        "id": "hv1-eltern-studium",
        "themeTitle": "Eltern und Studium",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Elternschaft während des Studiums.
Moderator: Studium und Familie miteinander verbinden: Ist das machbar oder eine Überforderung? Hören Sie acht Stimmen.

Sprecher 1: Eine Gesellschaft, die zukunftsfähig sein will, darf junge Eltern im Studium nicht im Stich lassen. Es ist eine grundlegende Pflicht der gesellschaftlichen Solidarität, studierende Mütter und Väter finanziell, organisatorisch und sozial bestmöglich zu unterstützen.

Sprecherin 2: Für mich war von vornherein klar: Ein Vollzeitstudium an einer Universität ist derart arbeitsintensiv und anspruchsvoll mit Prüfungen und Vorlesungen, dass man es unmöglich parallel zur Erziehung eines kleinen Kindes erfolgreich bewältigen kann. Das schließt sich schlichtweg aus.

Sprecherin 3: Das größte Problem sind die starren Anwesenheitspflichten bei Seminaren und Laborpraktika. Wenn das Kind plötzlich erkrankt, darf man Fehlzeiten nicht ausgleichen und wird zwangsweise benachteiligt. Diese rigiden Präsenzregeln diskriminieren studierende Eltern enorm.

Sprecher 4: Man muss den Tatsachen ins Auge sehen: Wer schon während des Studiums eine Familie gründet, hat danach auf dem Arbeitsmarkt oft schlechtere Karten. Arbeitgeber befürchten mangelnde Flexibilität und Fehlzeiten, was die Einstiegschancen spürbar schmälert.

Sprecherin 5: Unsere Hochschule bietet glücklicherweise viele maßgeschneiderte Angebote: Es gibt Uni-Kitas direkt auf dem Campus, flexible Eltern-Kind-Zimmer und spezielle Beratungsstellen für studierende Eltern, die eine enorme Entlastung darstellen.

Sprecher 6: Ich bin selbst während meines Masterstudiums Vater geworden und würde mich jederzeit wieder so entscheiden! Die zeitliche Flexibilität des Studienalltags hat es mir ermöglicht, viel mehr Zeit mit meinem neugeborenen Kind zu verbringen, als es in einem starren Berufsalltag je möglich gewesen wäre.

Sprecherin 7: Wer so jung und mitten in der akademischen Ausbildung ein Kind bekommt, muss enorme Abstriche machen. Man hat kaum noch Zeit für Auslandsaufenthalte, Praktika, Hobbys oder persönliche Selbstverwirklichung; die persönliche Entwicklung bleibt völlig auf der Strecke.

Sprecher 8: Wenn man ambitionierte Karrierepläne verfolgt, ist die Studienzeit paradoxerweise das beste Zeitfenster für Kinder. Später im Beruf, in der intensiven Einstiegsphase mit 60-Stunden-Wochen, hat man erst recht keine Zeit mehr für die Familienplanung.""",
        "optionsStatements": [
            {"key": "a", "text": "Aus eigener Erfahrung kann ich das Studium mit Kind nur befürworten."},
            {"key": "b", "text": "Die Universitäten unterstützen Studierende mit Kindern durch unterschiedliche Einrichtungen."},
            {"key": "c", "text": "Die verpflichtende Teilnahme an Lehrveranstaltungen benachteiligt Studierende mit Kind."},
            {"key": "d", "text": "Ein Kind während des Studiums verringert die beruflichen Aussichten."},
            {"key": "e", "text": "Ein Studium ist so aufwendig, dass es sich mit einem Kind nicht vereinbaren lässt."},
            {"key": "f", "text": "Jüngste Erhebungen zeigen vermehrte Studienabbrüche bei Studierenden mit Kind."},
            {"key": "g", "text": "Studierende Eltern zu unterstützen ist ein Gebot der gesellschaftlichen Solidarität."},
            {"key": "h", "text": "Studentenvertreter fordern mehr Fördermaßnahmen für studierende Eltern."},
            {"key": "i", "text": "Wenn man Karriere machen möchte, ist es besser, die Kinder während des Studiums zu bekommen."},
            {"key": "j", "text": "Wer während des Studiums ein Kind bekommt, hat kaum Möglichkeiten, sich persönlich weiterzuentwickeln."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "g", "explanation": "Sprecher 1 sieht die Unterstützung studierender Eltern als ein zentrales Gebot gesellschaftlicher Solidarität."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "e", "explanation": "Sprecherin 2 hält den Studienaufwand für so hoch, dass er mit der Betreuung eines Kindes nicht vereinbar ist."},
            {"id": "49", "prompt": "Sprecherin 3", "correctAnswer": "c", "explanation": "Sprecherin 3 kritisiert, dass Anwesenheitspflichten Studierende mit Kindern systematisch benachteiligen."},
            {"id": "50", "prompt": "Sprecher 4", "correctAnswer": "d", "explanation": "Sprecher 4 warnt davor, dass Kinder im Studium die späteren Berufsaussichten und Einstiegschancen mindern."},
            {"id": "51", "prompt": "Sprecherin 5", "correctAnswer": "b", "explanation": "Sprecherin 5 lobt universitäre Hilfseinrichtungen wie Campus-Kitas und Beratungsstellen für Eltern."},
            {"id": "52", "prompt": "Sprecher 6", "correctAnswer": "a", "explanation": "Sprecher 6 hat selbst positive persönliche Erfahrungen gemacht und befürwortet das Studium mit Kind ausdrücklich."},
            {"id": "53", "prompt": "Sprecherin 7", "correctAnswer": "j", "explanation": "Sprecherin 7 meint, dass junge Eltern kaum noch Möglichkeiten haben, sich persönlich weiterzuentwickeln."},
            {"id": "54", "prompt": "Sprecher 8", "correctAnswer": "i", "explanation": "Sprecher 8 findet, dass die Studienzeit für spätere Karriereorientierte der beste Zeitpunkt für Kinder ist."}
        ]
    },
    {
        "id": "hv1-gentechnik",
        "themeTitle": "Gentechnik",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Chancen und Risiken der Gentechnik in Landwirtschaft und Ernährung.
Moderator: Gentechnik polarisiert die Gemüter weltweit. Acht Personen teilen ihre Einschätzungen.

Sprecher 1: Für mich steht fest: Die Grüne Gentechnik ist primär eine Rationalisierungstechnologie der Agrarkonzerne. Sie dient der Automatisierung und Einsparung von Arbeitskräften und vernichtet letztlich unzählige Arbeitsplätze in der traditionellen Landwirtschaft.

Sprecherin 2: Was mir am meisten Sorgen bereitet, ist der eklatante Mangel an unabhängigen wissenschaftlichen Langzeitstudien. Nahezu alle Studien, die behaupten, gentechnisch veränderte Pflanzen seien absolut unbedenklich, werden direkt oder indirekt von den Chemie- und Saatgutriesen finanziert.

Sprecher 3: Durch den massiven Anbau homogener Gen-Pflanzen in gigantischen Monokulturen werden einheimische Sorten, Insekten und Bodenorganismen verdrängt. Das bedroht und zerstört die biologische Vielfalt unserer Ökosysteme nachhaltig.

Sprecherin 4: Angesichts der fortschreitenden Erderwärmung, extremer Dürreperioden und versalzter Böden kommen wir ohne widerstandsfähige, gentechnisch angepasste Pflanzensorten schlicht nicht aus, um den Klimafolgen wirksam zu begegnen.

Sprecher 5: Die Biotechnologie und Genforschung ist eine der zentralen Schlüsseltechnologien des 21. Jahrhunderts. Sie treibt wissenschaftliche Innovationen voran, schafft hochqualifizierte Arbeitsplätze und dient als essenzieller Wachstumsmotor für die gesamte Volkswirtschaft.

Sprecherin 6: Es ist ein Mythos zu glauben, Gen-Food könne den Hunger der Welt stillen. Welthunger entsteht durch ungerechte Verteilung, Kriege und Armut, nicht durch Mangel an Technologie. Gentechnik leistet überhaupt keinen substanziellen Beitrag zur Sicherung der weltweiten Ernährung.

Sprecher 7: Eine gesunde und vollwertige menschliche Ernährung basiert auf naturbelassenen, ökologisch erzeugten Lebensmitteln. Wir brauchen absolut keine gentechnisch modifizierten Produkte auf unseren Tellern, um uns ausgewogen zu ernähren.

Sprecherin 8: Einmal im Freiland ausgebracht, lassen sich genveränderte Pollen durch Wind und Insekten nicht mehr aufhalten. Es besteht die akute Gefahr, dass sich gentechnisch manipulierte Pflanzen unkontrolliert in die freie Natur ausbreiten und wilde Arten unumkehrbar kontaminieren.""",
        "optionsStatements": [
            {"key": "a", "text": "Wir brauchen Gentechnik-Pflanzen, um den Problemen des Klimawandels begegnen zu können."},
            {"key": "b", "text": "Gentechnik ist eine Rationalisierungstechnologie, die Stellen vernichtet."},
            {"key": "c", "text": "Gentechnik in der Landwirtschaft gefährdet die biologische Vielfalt."},
            {"key": "d", "text": "Es gibt keine unabhängige Forschung, die belegt, dass Gentechnik-Pflanzen sicher sind."},
            {"key": "e", "text": "Es besteht die Gefahr, dass gentechnisch veränderte Pflanzen sich unkontrolliert verbreiten."},
            {"key": "f", "text": "Eine gesunde Ernährung braucht kein Gen-Food."},
            {"key": "g", "text": "Durch Gentechnik können Landwirte den Einsatz von Spritzmitteln verringern."},
            {"key": "h", "text": "Die Gentechnik trägt nicht zur Sicherung der Welternährung bei."},
            {"key": "i", "text": "Die Gentechnik ist ein Innovations- und Wachstumsmotor."},
            {"key": "j", "text": "Der Anbau von Gentechnik-Pflanzen trägt dazu bei, den Hunger in der Welt zu bekämpfen."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "b", "explanation": "Sprecher 1 argumentiert, dass Gentechnik primär als Rationalisierung dient und Arbeitsplätze in der Landwirtschaft vernichtet."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "d", "explanation": "Sprecherin 2 beklagt, dass fast alle Sicherheitsstudien von Konzernen bezahlt werden und unabhängige Forschung fehlt."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "c", "explanation": "Sprecher 3 warnt vor Monokulturen und der Gefährdung der Artenvielfalt und biologischen Vielfalt."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "a", "explanation": "Sprecherin 4 hält trockenheitsresistente Gen-Pflanzen für unerlässlich im Kampf gegen den Klimawandel."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "i", "explanation": "Sprecher 5 sieht in der Gentechnologie einen zentralen Innovations- und Wachstumsmotor für die Wirtschaft."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "h", "explanation": "Sprecherin 6 widerlegt das Argument der Welternährung: Hunger sei ein Verteilungsproblem, das Gentechnik nicht löst."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "f", "explanation": "Sprecher 7 plädiert für naturbelassene Nahrung und stellt klar, dass gesunde Ernährung kein Gen-Food benötigt."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "e", "explanation": "Sprecherin 8 warnt vor der unkontrollierten Ausbreitung modifizierter Pollen und Samen in die freie Natur."}
        ]
    },
    {
        "id": "hv1-internet",
        "themeTitle": "Internet",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Die Rolle des Internets in unserem Alltag.
Moderator: Das Internet bestimmt Alltag, Beruf und Freizeit. Acht Personen erzählen von ihren Gewohnheiten.

Sprecher 1: Für mich ist das Internet seit über zwanzig Jahren aus meinem Alltag überhaupt nicht mehr wegzudenken. Ich bin wirklich jeden einzelnen Tag online, sei es privat, beruflich oder zur Information. Es ist zu einer täglichen Selbstverständlichkeit geworden.

Sprecherin 2: Wenn ich mich über das aktuelle Tagesgeschehen informieren will, schaue ich sofort ins Netz. Gedruckte Tageszeitungen drucken die Meldungen von gestern, während Onlinemedien im Minutentakt live aktualisiert werden. Das Internet ist schlichtweg viel aktueller.

Sprecher 3: Ein riesiger persönlicher Segen des Internets ist für mich der weltweite Kontakt: Meine Geschwister und viele enge Freunde leben verstreut in Kanada und Australien. Dank Videotelefonie und Messengern fühlt sich die enorme räumliche Distanz überhaupt nicht mehr so an.

Sprecherin 4: Wenn ich aus dem Urlaub oder von einem freien Wochenende zurückkomme, schalte ich ganz bewusst nicht direkt den Rechner an. Ich brauche erst einmal ein, zwei Tage Ruhe, bevor ich wieder in den digitalen Strom eintauche.

Sprecher 5: Im geschäftlichen und privaten Alltag hat die E-Mail die Post fast vollständig abgelöst. Sie ist rasend schnell, spart Papier und Porto und Dokumente lassen sich weltweit in Sekundenschnelle weiterleiten. Die Vorteile gegenüber dem klassischen Briefverkehr sind immens.

Sprecherin 6: Für Studierende und Forschende ist das Internet eine bahnbrechende Erleichterung. Früher musste man wochenlang Fernleihen beantragen und Bibliothekskataloge wälzen; heute sind weltweite wissenschaftliche Datenbanken und Fachaufsätze mit einem Klick zugänglich.

Sprecher 7: In der modernen Wirtschaft gilt: Wer digital nicht präsent und vernetzt ist, geht unter. Ohne cloudbasierte Prozesse, digitalen Vertrieb und permanente Online-Erreichbarkeit kann heutzutage kaum noch ein Unternehmen am Markt überleben.

Sprecherin 8: Ich habe in letzter Zeit gemerkt, wie sehr die permanente Reizüberflutung meine Konzentration ruiniert hat. Deshalb habe ich meine Online-Zeiten drastisch eingeschränkt. Ich nutze das Internet heute bewusst viel seltener und dosierter als noch vor einigen Jahren.""",
        "optionsStatements": [
            {"key": "a", "text": "Das Internet ist aktueller als die Tageszeitung."},
            {"key": "b", "text": "Ich gehe seit vielen Jahren jeden Tag ins Internet."},
            {"key": "c", "text": "E-Mails haben Vorteile gegenüber Briefverkehr."},
            {"key": "d", "text": "Das Internet ist für ein Unternehmen überlebenswichtig."},
            {"key": "e", "text": "Ich nutze das Internet jetzt weniger als früher."},
            {"key": "f", "text": "Ich verzichte seit Wochen auf das Internet und vermisse nichts."},
            {"key": "g", "text": "Ich will im Urlaub nicht auf das Internet verzichten."},
            {"key": "h", "text": "Meine Freunde und Verwandten leben auf anderen Kontinenten."},
            {"key": "i", "text": "Wenn ich aus dem Urlaub nach Hause komme, gehe ich nicht sofort an den Computer."},
            {"key": "j", "text": "Wissenschaftliche Recherche wird durch das Internet deutlich erleichtert."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "b", "explanation": "Sprecher 1 nutzt das Internet seit vielen Jahren tagtäglich als festen Bestandteil seines Lebens."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "a", "explanation": "Sprecherin 2 schätzt die Minutenschnelligkeit und höhere Aktualität gegenüber gedruckten Zeitungen."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "h", "explanation": "Sprecher 3 nutzt das Internet, um den engen Kontakt zu Freunden und Verwandten auf anderen Kontinenten zu halten."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "i", "explanation": "Sprecherin 4 setzt sich nach der Rückkehr aus dem Urlaub bewusst nicht gleich an den Computer."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "c", "explanation": "Sprecher 5 hebt Schnelligkeit und Effizienz von E-Mails im Vergleich zur traditionellen Post hervor."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "j", "explanation": "Sprecherin 6 erläutert, wie digital verfügbare Datenbanken die wissenschaftliche Recherche revolutioniert haben."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "d", "explanation": "Sprecher 7 unterstreicht, dass das Internet für das Überleben und den Erfolg jedes Unternehmens unerlässlich ist."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "e", "explanation": "Sprecherin 8 hat ihre Internetnutzung bewusst reduziert und surft nun deutlich weniger als früher."}
        ]
    },
    {
        "id": "hv1-studiengebuehren",
        "themeTitle": "Studiengebühren",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Sollten Universitäten Studiengebühren verlangen?
Moderator: Studiengebühren entfachen in Deutschland immer wieder hitzige Debatten. Acht Befragte äußern sich.

Sprecher 1: Wir sehen ganz deutliche Wanderungsbewegungen unter den Abiturienten: Wer ein Studium aufnehmen will, schaut ganz genau hin und meidet Bundesländer mit Abgaben. Studieninteressierte bewerben sich bevorzugt dort, wo keine Gebühren erhoben werden.

Sprecherin 2: Wenn Studierende jedes Semester hunderte Euro an Gebühren aufbringen müssen, sind sie gezwungen, nebenher deutlich mehr zu jobben. Dadurch bleibt weniger Zeit fürs Lernen und das Studium zieht sich unnötig in die Länge.

Sprecher 3: Viele junge Menschen können die Kosten nicht allein stemmen, weshalb letztlich die Mütter und Väter einspringen müssen. Für Familien aus der Mittelschicht bedeuten zusätzliche Studiengebühren eine spürbare finanzielle Mehrbelastung.

Sprecherin 4: Die Politik versprach damals, durch Gebühren würden Seminare kleiner, Bibliotheken moderner und die Lehre besser. Die Realität hat gezeigt: Die Studienbedingungen haben sich trotz der Zahlungen keineswegs nennenswert verbessert.

Sprecher 5: Nicht nur die Studierenden spüren den Druck: Die Universitätsverwaltung und das akademische Personal sind durch die bürokratische Erfassung, Mahnverfahren und Konflikte massiv belastet. Auch Hochschulmitarbeiter bekommen die Folgen unmittelbar zu spüren.

Sprecherin 6: Wenn ein Studium Geld kostet, überlegen sich junge Leute viel reiflicher, welches Fach sie wählen und ob sie motiviert sind. Das könnte dazu führen, dass weniger Studierende ihr Studium leichtfertig beginnen und die Abbrecherquote sinkt.

Sprecher 7: Das ständige Hin und Her zwischen den verschiedenen Bundesländern führt zu einem unfairen Flickenteppich. Ich bin zuversichtlich, dass sich die Ministerpräsidenten bald zusammensetzen und eine bundesweit einheitliche Regelung beschließen werden.

Sprecherin 8: Teure Labore, chemische Reagenzien und hochmoderne Messgeräte kosten ein Vermögen. Wenn überhaupt Gebühren erhoben werden, dann machen sie allenfalls in kostenintensiven natur- und ingenieurwissenschaftlichen Studiengängen Sinn.""",
        "optionsStatements": [
            {"key": "a", "text": "Auch Beschäftigte der Universität bekommen die Auswirkungen der Studierenden zu spüren."},
            {"key": "b", "text": "Studiengebühren können auch von sozial schwächeren Studierenden getragen werden."},
            {"key": "c", "text": "Die Bundesländer werden in nächster Zeit eine gemeinsame Lösung suchen."},
            {"key": "d", "text": "Eltern sollten ihren Kindern das Studium und damit auch die Gebühren finanzieren."},
            {"key": "e", "text": "Studiengebühren haben die Studienbedingungen nicht zum Positiven verändert."},
            {"key": "f", "text": "Gebühren könnten möglicherweise die Quote der Studienabbrecher senken."},
            {"key": "g", "text": "Studiengebühren sind zumindest in Naturwissenschaften sinnvoll."},
            {"key": "h", "text": "Studiengebühren sind eine zusätzliche Belastung für die Eltern von Studierenden."},
            {"key": "i", "text": "Studieninteressierte bevorzugen Bundesländer ohne Studiengebühren."},
            {"key": "j", "text": "Studiengebühren verlängern die Studiendauer."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "i", "explanation": "Sprecher 1 belegt, dass Abiturienten bevorzugt in Bundesländer abwandern, in denen keine Studiengebühren anfallen."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "j", "explanation": "Sprecherin 2 argumentiert, dass Studierende durch Nebenjobs weniger Lernzeit haben und sich das Studium verlängert."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "h", "explanation": "Sprecher 3 betont die finanzielle Belastung, die Studiengebühren für Eltern darstellen."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "e", "explanation": "Sprecherin 4 stellt klar, dass Gebühren zu keiner spürbaren Verbesserung der Studienbedingungen geführt haben."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "a", "explanation": "Sprecher 5 beschreibt die bürokratischen und organisatorischen Belastungen für das Universitätspersonal."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "f", "explanation": "Sprecherin 6 vermutet, dass finanzielle Eigenbeteiligung zu überlegteren Studienentscheidungen und weniger Abbrüchen führt."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "c", "explanation": "Sprecher 7 rechnet damit, dass die Bundesländer in naher Zukunft einen gemeinsamen Konsens finden werden."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "g", "explanation": "Sprecherin 8 sieht Gebühren allenfalls in apparateintensiven Naturwissenschaften als gerechtfertigt an."}
        ]
    },
    {
        "id": "hv1-tempolimit",
        "themeTitle": "Tempolimit",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Tempolimit auf deutschen Autobahnen.
Moderator: Sollte auf deutschen Autobahnen eine Richtgeschwindigkeit oder ein festes Tempolimit von 130 km/h gelten? Acht Bürger nehmen Stellung.

Sprecher 1: Wenn Autos nicht mehr für irrwitzige Spitzengeschwindigkeiten jenseits der 200 km/h konstruiert werden müssen, können Hersteller viel leichtere, aerodynamischere und sparsamere Fahrzeuge bauen. Ein Tempolimit wäre ein gewaltiger Innovationsimpuls für zukunftsfähigen Autobau.

Sprecherin 2: Viele Aktivisten behaupten, ein Tempolimit rette das Klima. Wenn man sich die wissenschaftlichen Emissionsdaten neutral ansieht, stellt man fest: Der CO2-Einspareffekt ist verschwindend gering. Ein Tempolimit leistet keinen nennenswerten Beitrag zum Klimaschutz.

Sprecher 3: Jeder, der im Ausland unterwegs war, weiß: Bei 120 oder 130 km/h gibt es kein ständiges abruptes Bremsen und Beschleunigen. Der Verkehrsfluss wird wesentlich harmonischer, es entstehen viel weniger Staus und das Vorankommen ist entspannter.

Sprecherin 4: Für mich geht es hier ums Prinzip persönlicher Freiheit. Wir leben in einem freien Land und ich verwehre mich gegen einen übergriffigen, bevormundenden Staat, der seinen Bürgern bis ins kleinste Detail vorschreiben will, wie schnell sie sich fortbewegen dürfen.

Sprecher 5: Die Statistiken belegen eindeutig: Deutsche Autobahnen gehören auch ohne generelles Tempolimit zu den sichersten Straßen der Welt. Die meisten schweren Unfälle passieren auf Landstraßen. Ein starres Limit auf Bundesautobahnen brächte für die Verkehrssicherheit keinerlei Mehrwert.

Sprecherin 6: Eine Mehrheit der Bevölkerung befürwortet laut Umfragen seit Jahren ein Tempolimit. Dass es dennoch nie Gesetz wird, liegt einzig und allein an der übermächtigen Automobil-Lobby und deren engem Einfluss auf die Bundespolitik.

Sprecher 7: Anstatt ein starres, pauschales Limit zu verhängen, sollten wir moderne Telematik und digitale Verkehrsbeeinflussungsanlagen nutzen. Eine flexible Geschwindigkeitsbegrenzung je nach Wetter, Verkehrsaufkommen und Tageszeit ist viel sinnvoller als ein stures Tempolimit.

Sprecherin 8: Auswertungen von Autobahnabschnitten, auf denen testweise 130 km/h eingeführt wurde, zeigen dramatische Erfolge: Die Zahl der schweren und tödlichen Verkehrsunfälle sinkt dort nachweislich um rund ein Drittel.""",
        "optionsStatements": [
            {"key": "a", "text": "Aus gesamtwirtschaftlicher Sicht dürfte ein Tempolimit positiv zu beurteilen sein."},
            {"key": "b", "text": "Der Verkehr läuft bei einer Geschwindigkeitsbegrenzung flüssiger."},
            {"key": "c", "text": "Die Durchsetzung des Tempolimits scheitert an der starken deutschen Autolobby."},
            {"key": "d", "text": "Eine allgemeine Geschwindigkeitsbegrenzung ist wirkungslose Symbolpolitik."},
            {"key": "e", "text": "Eine flexible, situationsgerechte Geschwindigkeitsregelung ist sinnvoller als ein Tempolimit."},
            {"key": "f", "text": "Ein generelles Tempolimit auf den Bundesautobahnen wäre kein Gewinn für die Verkehrssicherheit."},
            {"key": "g", "text": "Ein Tempolimit würde neue Impulse für einen effizienten Autobau setzen."},
            {"key": "h", "text": "Ich will keinen bevormundenden Staat, der vorschreibt, wie wir uns fortbewegen."},
            {"key": "i", "text": "Ein Tempolimit leistet keinen spürbaren Beitrag zum Klimaschutz."},
            {"key": "j", "text": "Unfälle mit Personenschäden würden durch eine Geschwindigkeitsbegrenzung um ein Drittel zurückgehen."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "g", "explanation": "Sprecher 1 sieht im Tempolimit einen technologischen Anreiz für effizientere und leichtere Automobile."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "i", "explanation": "Sprecherin 2 hält den tatsächlichen Beitrag des Tempolimits zur CO2-Reduktion für vernachlässigbar gering."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "b", "explanation": "Sprecher 3 verweist auf den gleichmäßigeren Verkehrsfluss und weniger Staus bei konstanter Geschwindigkeit."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "h", "explanation": "Sprecherin 4 wehrt sich gegen staatliche Bevormundung und pocht auf individuelle Fahrfreiheit."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "f", "explanation": "Sprecher 5 argumentiert mit Unfallstatistiken, wonach die Autobahnen auch ohne Limit bereits sehr sicher sind."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "c", "explanation": "Sprecherin 6 macht die starke politische Einflussnahme der Automobillobby für das Ausbleiben eines Limits verantwortlich."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "e", "explanation": "Sprecher 7 favorisiert dynamische, wetter- und verkehrsabhängige Geschwindigkeitsanzeigen statt starre Regeln."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "j", "explanation": "Sprecherin 8 zitiert Zahlen, wonach Unfälle mit Personenschaden um etwa ein Drittel reduziert werden."}
        ]
    },
    {
        "id": "hv1-umweltschutz",
        "themeTitle": "Umweltschutz",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Individueller und gesellschaftlicher Umweltschutz.
Moderator: Wie schützen wir unsere Umwelt wirksam? Acht Menschen äußern ihre Meinung.

Sprecher 1: Ökologisches Handeln und wirtschaftlicher Erfolg sind kein Widerspruch mehr. Wer heute in Energieeffizienz, Wärmedämmung und Solaranlagen investiert, spart langfristig gewaltige Kosten. Umweltbewusstes Verhalten zahlt sich finanziell voll aus.

Sprecherin 2: Viele Menschen haben die Konsequenzen ihres Handelns noch gar nicht begriffen. Wir müssen im Alltag viel offensiver aufklären und das ökologische Verständnis in unserer Familie, im Freundeskreis und am Arbeitsplatz schärfen.

Sprecher 3: Wenn ich als Einzelner auf den Strohhalm verzichte, rettet das das Klima nicht, während Kreuzfahrtschiffe und Industrie gigantische Mengen Schadstoffe ausstoßen. Isolierte Maßnahmen vereinzelter Bürger verpuffen wirkungslos; wir brauchen verbindliche staatliche Regeln.

Sprecherin 4: Die Textilindustrie gehört zu den größten Umweltverschmutzern überhaupt. Wir kaufen viel zu viele billige Wegwerf-Klamotten. Beim Kauf von Kleidung sollte man extrem bewusst handeln: lieber langlebige Second-Hand-Mode oder zertifizierte Naturfasern wählen.

Sprecher 5: Vergleicht man die Situation mit den 1980er-Jahren, sieht man gewaltige Fortschritte. Das Umweltbewusstsein in der deutschen Bevölkerung hat sich über die letzten Jahrzehnte extrem positiv entwickelt; Mülltrennung und Bio-Lebensmittel sind gesellschaftlicher Standard.

Sprecherin 6: Der Wandel hin zu erneuerbaren Energien, nachhaltiger Kreislaufwirtschaft und E-Mobilität ist die größte Jobmaschine unserer Zeit. Der ökologische Umbau vernichtet keine Wirtschaft, sondern schafft hunderttausende neue, zukunftssichere Arbeitsplätze.

Sprecher 7: Mir geht dieser ständige Verzichtswahn gehörig auf die Nerven. Wenn man bei jedem Einkauf, jedem Wochenendausflug und jedem Stück Fleisch ein schlechtes Gewissen eingeredet bekommt, verliert das Leben jede Spontaneität und Freude.

Sprecherin 8: Niemand hat das Recht, anderen seine Lebensweise aufzudrängen. Jeder Bürger muss ganz individuell für sich selbst entscheiden dürfen, in welchem Bereich und in welchem Umfang er bereit ist, einen Beitrag zum Umweltschutz zu leisten.""",
        "optionsStatements": [
            {"key": "a", "text": "Beim Konsum von Kleidung sollte man bewusst handeln."},
            {"key": "b", "text": "Der Umweltschutz trägt zur Entstehung neuer Arbeitsplätze bei."},
            {"key": "c", "text": "Die Einstellung der Deutschen zum Umweltschutz hat sich positiv entwickelt."},
            {"key": "d", "text": "Fleischverzicht hat keine positiven Effekte auf die Umwelt."},
            {"key": "e", "text": "Jeder muss individuell für sich entscheiden, welchen Beitrag zum Umweltschutz er leisten möchte."},
            {"key": "f", "text": "Man sollte das ökologische Bewusstsein seiner Mitmenschen schärfen."},
            {"key": "g", "text": "Umweltschutzmaßnahmen einzelner Akteure sind nicht sehr effektiv."},
            {"key": "h", "text": "Viele Unternehmen vermeiden nachhaltige Maßnahmen aus Kostengründen."},
            {"key": "i", "text": "Umweltbewusster Konsum mindert die Lebensfreude."},
            {"key": "j", "text": "Umweltfreundliches Verhalten zahlt sich auch in ökonomischer Hinsicht aus."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "j", "explanation": "Sprecher 1 unterstreicht die monetären Einsparungen und ökonomischen Vorteile umweltbewussten Handelns."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "f", "explanation": "Sprecherin 2 fordert dazu auf, im Umfeld Aufklärungsarbeit zu leisten und das Umweltbewusstsein zu schärfen."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "g", "explanation": "Sprecher 3 hält Taten einzelner Konsumenten für ineffektiv, solange die Großindustrie nicht reguliert wird."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "a", "explanation": "Sprecherin 4 kritisiert Fast Fashion und verlangt einen überlegten und nachhaltigen Textilkonsum."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "c", "explanation": "Sprecher 5 hebt die positive historische Entwicklung der Umwelt- und Nachhaltigkeitseinstellung in Deutschland hervor."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "b", "explanation": "Sprecherin 6 betont den Beschäftigungsboom und neue Arbeitsplätze durch grüne Technologien."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "i", "explanation": "Sprecher 7 empfindet den ständigen Verzicht und Konsumdruck als Minderung seiner persönlichen Lebensfreude."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "e", "explanation": "Sprecherin 8 plädiert dafür, dass jeder Mensch eigenständig über das Ausmaß seines Umweltengagements entscheidet."}
        ]
    },
    {
        "id": "hv1-studienwahl",
        "themeTitle": "Studienwahl",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Wie wählt man den richtigen Studiengang?
Moderator: Vor dem Studienbeginn stehen viele vor der Qual der Wahl. Acht Personen schildern ihre Sicht.

Sprecher 1: Bevor man sich kopfüber für ein Studienfach einschreibt, muss man ehrlich in sich hineinhorchen. Man muss sich intensiv mit den eigenen Talenten, Schwächen und Neigungen auseinandersetzen, anstatt nur Trends hinterherzulaufen.

Sprecherin 2: Bei uns zu Hause war das quasi vorbestimmt: Mein Großvater war Mediziner, meine Mutter ist Ärztin und für die Familie stand außer Frage, dass auch ich Medizin studiere. Der berufliche Lebensweg wird oft ganz maßgeblich von Familientraditionen geprägt.

Sprecher 3: Ich habe mir mein Studienfach ganz gezielt nach Karriereaussichten ausgesucht: Wer im Berufsleben Führungsverantwortung übernehmen und im oberen Management landen will, muss von Anfang an Fächer wie Wirtschaftsingenieurwesen oder Management wählen.

Sprecherin 4: Idealismus ist schön und gut, aber von Luft und Liebe kann man keine Miete zahlen. Es ist absolut legitim und klug, bei der Studienwahl auch die späteren Verdienstchancen und Einstiegsgehälter zu berücksichtigen.

Sprecher 5: Viele lassen sich von vermeintlich sicheren Jobprognosen leiten. Doch Arbeitsmärkte ändern sich rasant. Das Wichtigste ist Leidenschaft für das Thema; die Jobaussichten sollten bei der Wahl des Studiums eine eher untergeordnete Rolle spielen.

Sprecherin 6: Man sollte sich nicht zu starr auf ein einziges Traumfach versteifen. Selbst wenn man einen klaren Berufswunsch hat, lohnt es sich immer, den Blick weit zu halten und offen für alternative Studiengänge zu bleiben, die ähnliche Kompetenzen vermitteln.

Sprecher 7: Wer nicht bereit oder finanziell in der Lage ist, für das Studium weit wegzuziehen, wählt meistens das, was die örtliche Hochschule bietet. Die Wahl des Faches wird in der Praxis stark durch das Studienangebot der Heimatregion determiniert.

Sprecherin 8: In überfüllten Hörsälen mit 800 Kommilitonen in BWL oder Germanistik ist man nur eine anonyme Matrikelnummer. Die Dozenten haben keine Zeit und die Betreuung ist mangelhaft. Das Studieren solch riesiger Massenfächer ist keineswegs erstrebenswert.""",
        "optionsStatements": [
            {"key": "a", "text": "Bei der Studienwahl können durchaus auch finanzielle Aspekte berücksichtigt werden."},
            {"key": "b", "text": "Das Studienangebot im ländlichen Raum sollte erweitert werden."},
            {"key": "c", "text": "Das Studium sollte so gewählt werden, dass man eine Führungsposition erlangen kann."},
            {"key": "d", "text": "Das Studium von Massenfächern ist alles andere als erstrebenswert."},
            {"key": "e", "text": "Die Studienwahl wird wahrscheinlich auch von den Möglichkeiten in der Region bestimmt."},
            {"key": "f", "text": "Für die Zulassung zum Studium sollten nicht nur die Noten ausschlaggebend sein."},
            {"key": "g", "text": "Jobaussichten sollten bei der Wahl des Studiums eine untergeordnete Rolle spielen."},
            {"key": "h", "text": "Manchmal ist der berufliche Werdegang in der Familie vorgezeichnet."},
            {"key": "i", "text": "Selbst bei einer festen Berufsvorstellung sollte man offen bleiben für Alternativen."},
            {"key": "j", "text": "Vor der Wahl eines Studiums muss man sich mit seinen persönlichen Fähigkeiten auseinandersetzen."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "j", "explanation": "Sprecher 1 betont die Notwendigkeit der Selbstreflexion über die eigenen Stärken vor der Studienentscheidung."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "h", "explanation": "Sprecherin 2 schildert, wie ihre Studienwahl durch familiäre Traditionen praktisch vorgezeichnet war."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "c", "explanation": "Sprecher 3 wählte das Studium gezielt mit dem Ziel, später Führungsaufgaben und Managementpositionen einzunehmen."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "a", "explanation": "Sprecherin 4 hält es für vernünftig, finanzielle Einkommensaussichten bei der Studienwahl einzubeziehen."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "g", "explanation": "Sprecher 5 meint, Freude am Fach sei wichtiger und künftige Arbeitsmarktaussichten sollten sekundär sein."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "i", "explanation": "Sprecherin 6 rät dazu, flexibel zu bleiben und alternative Studiengänge nicht von vornherein auszuschließen."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "e", "explanation": "Sprecher 7 weist darauf hin, dass viele Studierende an das Studienangebot ihrer Heimatregion gebunden sind."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "d", "explanation": "Sprecherin 8 rät wegen Überfüllung und schlechter Betreuung von klassischen Massenfächern ab."}
        ]
    },
    {
        "id": "hv1-pendeln",
        "themeTitle": "Pendeln",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Pendeln zur Universität oder Hochschule.
Moderator: Immer mehr Studierende pendeln täglich zwischen Heimatort und Universität. Acht Betroffene berichten.

Sprecher 1: Ich fahre jeden Tag zwei Stunden mit dem Zug, aber nur, weil die Mieten in der Universitätsstadt für mich unbezahlbar sind. Für mich ist das tägliche Pendeln keinesfalls eine freie Wahl, sondern eine reine Notlösung.

Sprecherin 2: Wenn man pendelt, muss man den Tag militärisch durchtakten. Welcher Zug fährt, wann beginnen Seminare, wo sind Zwischenpausen? Man muss sein gesamtes Studium minutiös planen, sonst verpasst man Anschlüsse oder Vorlesungen.

Sprecher 3: Das Pendeln schneidet einen vom Studentenleben ab. Abends mal spontan mit Kommilitonen in die Kneipe oder am Wochenende zu Uni-Partys gehen, fällt flach, weil der letzte Zug schon um 22 Uhr abfährt. Das soziale Leben leidet massiv.

Sprecherin 4: Natürlich ist die Fahrerei anstrengend, aber wenn ich abends nach Hause komme, kochen meine Eltern, die Wäsche ist gemacht und ich habe den familiären Rückhalt. Das wiegt den zeitlichen Verlust durch das Fahren mehr als auf.

Sprecher 5: Ich halte es für einen großen Fehler, wenn junge Menschen beim Studienstart zu früh ausziehen. Solange es irgendwie per Bahn machbar ist, sollten Studierende im Elternhaus bleiben, um sich in vertrauter Umgebung voll auf die Noten zu konzentrieren.

Sprecherin 6: Zwei bis drei Stunden täglich in überfüllten Zügen und Bussen zu sitzen, raubt einem jegliche Energie. Nach der langen Heimfahrt bin ich so erschöpft, dass ich abends kein Buch mehr aufschlagen kann. Das ist extrem kräftezehrend.

Sprecher 7: Das Pendeln verhindert das Erwachsenwerden. Wer eine eigene Bude am Studienort bezieht, lernt Verantwortung, Selbstorganisation, Kochen und Budgetieren. Eine eigene Wohnung fördert die Selbstständigkeit junger Menschen ungemein.

Sprecherin 8: Ein Studentenzimmer kostet locker 600 bis 800 Euro warm. Indem ich bei meinen Eltern wohne und pendele, spare ich in drei Jahren Bachelorstudium fast 25.000 Euro, mit denen ich wertvolle finanzielle Rücklagen bilden kann.""",
        "optionsStatements": [
            {"key": "a", "text": "An das tägliche Fahren gewöhnt man sich schnell."},
            {"key": "b", "text": "Der Zeitverlust beim Pendeln wird durch den familiären Rückhalt ausgeglichen."},
            {"key": "c", "text": "In der Unistadt zu wohnen kann sich negativ auf die Leistungen auswirken."},
            {"key": "d", "text": "Lange Fahrtzeiten können sehr kräftezehrend sein."},
            {"key": "e", "text": "Pendeln hat Auswirkungen auf das soziale Leben der Studenten."},
            {"key": "f", "text": "Pendeln ist für mich nur eine Notlösung."},
            {"key": "g", "text": "Die eigene Wohnung fördert die Selbstständigkeit der Studenten."},
            {"key": "h", "text": "Studenten sollten möglichst weiter im Elternhaus bleiben."},
            {"key": "i", "text": "Durch die wegfallenden Mietkosten kann ich Rücklagen bilden."},
            {"key": "j", "text": "Ich muss mein Studium genau planen, weil ich pendele."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "f", "explanation": "Sprecher 1 pendelt nur aus finanzieller Not wegen hoher Mieten und sieht darin eine reine Notlösung."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "j", "explanation": "Sprecherin 2 muss ihren Studienalltag wegen Fahrplänen und Takten extrem präzise und genau planen."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "e", "explanation": "Sprecher 3 beklagt, dass das Pendeln ihn vom gemeinsamen Freizeit- und Sozialleben der Studierenden isoliert."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "b", "explanation": "Sprecherin 4 findet, dass Geborgenheit und Hilfe im Elternhaus den zeitlichen Aufwand des Pendelns kompensieren."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "h", "explanation": "Sprecher 5 befürwortet, dass Studierende während des Studiums im vertrauten Elternhaus wohnen bleiben sollten."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "d", "explanation": "Sprecherin 6 beschreibt die permanente körperliche und geistige Erschöpfung durch stundenlange Fahrten."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "g", "explanation": "Sprecher 7 betont den Wert einer eigenen Wohnung für persönliche Reife und Selbstständigkeit."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "i", "explanation": "Sprecherin 8 spart die gesamten Mietkosten ein und kann so beträchtliche finanzielle Ersparnisse aufbauen."}
        ]
    },
    {
        "id": "hv1-wohnkredit",
        "themeTitle": "Wohnkredit und Immobilienkauf",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Wohneigentum finanzieren: Wohnkredit oder Miete?
Moderator: Viele träumen vom Eigenheim auf Kredit. Acht Stimmen beleuchten Vor- und Nachteile.

Sprecher 1: Bevor man einen Darlehensvertrag über 30 Jahre unterschreibt, muss man einen schonungslosen Kassensturz machen. Man muss seine tatsächlichen Einnahmen, Ersparnisse und künftigen Lebensrisiken genau analysieren. Ohne diese nüchterne Bestandsaufnahme droht der Ruin.

Sprecherin 2: Viele Menschen kaufen Häuser nicht mit dem Taschenrechner, sondern mit dem Herzen. Sie verlieben sich in den Garten oder das Erkerzimmer. Emotionen und Bauchgefühl sind beim Immobilienkauf fast immer der entscheidende Auslöser.

Sprecher 3: Angesichts der Inflation und unsicherer Finanzmärkte gibt es für mich nichts Solideres als Betongold. Ein werthaltiges Eigenheim behält seinen realen Wert über Jahrzehnte und eignet sich daher hervorragend als langfristige Kapitalanlage.

Sprecher 4: Wer jeden Monat Miete an fremde Vermieter überweist, wirft sein Geld zum Fenster hinaus. Zahlt man stattdessen die Kreditrate für das eigene Haus ab, baut man Monat für Monat Vermögen auf, das im Ruhestand mietfreies Wohnen garantiert.

Sprecherin 5: Ich will flexibel bleiben, spontan den Job wechseln und in andere Städte ziehen können. Ein millionenschwerer Kredit bindet einen für Jahrzehnte an einen Ort fest. Mir persönlich ist persönliche Freiheit und Mobilität viel wichtiger als ein Haus.

Sprecher 6: Die Hochglanzbroschüren und Fernsehwerbung der Banken suggerieren, ein Eigenheim sei kinderleicht zu finanzieren. Viele leichtgläubige Käufer lassen sich durch diese bunten Werbeversprechen zu völlig überdimensionierten Krediten verführen.

Sprecherin 7: Beim Hauskauf ist mit dem Kaufpreis längst nicht Schluss. Wer eine Immobilie besitzt, muss sich auf ständige Instandhaltungskosten, Grundsteuern, Heizungserneuerungen und Sonderumlagen einstellen, die finanziell enorm zu Buche schlagen.

Sprecher 8: Für uns als Familie ist das eigene Haus die Erfüllung unseres Lebenstraums. Es bietet unseren Kindern einen geschützten Raum, Sicherheit und Geborgenheit, die einem keine Mietwohnung jemals geben kann.""",
        "optionsStatements": [
            {"key": "a", "text": "Banken sind bei der Vergabe von Wohnkrediten in letzter Zeit sehr zurückhaltend."},
            {"key": "b", "text": "Die Investition in ein eigenes Haus dient der Altersvorsorge."},
            {"key": "c", "text": "Durch Mieteinnahmen kann man sich im Alter die Rente aufbessern."},
            {"key": "d", "text": "Ein eigenes Haus bietet Sicherheit und Geborgenheit für die ganze Familie."},
            {"key": "e", "text": "Häufig sind Gefühle beim Kauf einer Immobilie ausschlaggebend."},
            {"key": "f", "text": "Immobilien eignen sich bestens als langfristige Geldanlage."},
            {"key": "g", "text": "Unabhängigkeit ist wichtiger als der Besitz eines eigenen Hauses."},
            {"key": "h", "text": "Viele lassen sich durch die Werbung von Banken zum Kauf von Immobilien verleiten."},
            {"key": "i", "text": "Vor dem Kauf eines Eigenheims muss die kritische Beurteilung der eigenen Vermögensverhältnisse stehen."},
            {"key": "j", "text": "Wer eine Immobilie besitzt, muss sich auf finanzielle Belastungen einstellen."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "i", "explanation": "Sprecher 1 fordert vor dem Kauf eine schonungslose Analyse der eigenen finanziellen Vermögensverhältnisse."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "e", "explanation": "Sprecherin 2 erklärt, dass emotionale Faktoren und Verliebtheit oft den Ausschlag beim Immobilienkauf geben."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "f", "explanation": "Sprecher 3 lobt Immobilien als wertstabile, inflationsgeschützte und ideale langfristige Geldanlage."},
            {"id": "50", "prompt": "Sprecher 4", "correctAnswer": "b", "explanation": "Sprecher 4 sieht im Wohneigentum das Fundament für mietfreies Wohnen und effektive Altersvorsorge."},
            {"id": "51", "prompt": "Sprecherin 5", "correctAnswer": "g", "explanation": "Sprecherin 5 schätzt Flexibilität und persönliche Unabhängigkeit höher ein als den Besitz eines Hauses."},
            {"id": "52", "prompt": "Sprecher 6", "correctAnswer": "h", "explanation": "Sprecher 6 warnt vor geschönter Bankwerbung, die Käufer zu riskanten Kreditabschlüssen verleitet."},
            {"id": "53", "prompt": "Sprecherin 7", "correctAnswer": "j", "explanation": "Sprecherin 7 weist auf unvermeidbare finanzielle Folgekosten und Instandhaltungsbelastungen hin."},
            {"id": "54", "prompt": "Sprecher 8", "correctAnswer": "d", "explanation": "Sprecher 8 betont das familiäre Geborgenheitsgefühl und die emotionale Sicherheit im Eigenheim."}
        ]
    },
    {
        "id": "hv1-glueck",
        "themeTitle": "Glück",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Was bedeutet Glück und wie entsteht es?
Moderator: Was macht Menschen wirklich glücklich? Acht Menschen reflektieren über das Glücksempfinden.

Sprecher 1: Glück ist kein Zufall, sondern eine Frage der inneren Haltung. Ob wir zufrieden durchs Leben gehen, hängt maßgeblich davon ab, mit welcher Brille wir auf die Welt und unsere Mitmenschen blicken. Wer optimistisch auf das Leben schaut, empfindet mehr Glück.

Sprecherin 2: Wenn eine Krise eintritt, zeigt sich, wie glücklich man bleibt. Entscheidend ist die Art und Weise, wie man konstruktiv Probleme anpackt und Widerstände meistert. Unser Problemlösungsstil beeinflusst unser Wohlbefinden nachhaltig.

Sprecher 3: Alle psychologischen Langzeitstudien belegen: Weder Reichtum noch Berühmtheit machen dauerhaft glücklich. Das absolut Wichtigste für ein erfülltes Leben sind tiefe, vertrauensvolle Beziehungen zu Familie, Partnern und Freunden.

Sprecherin 4: Wir leben in einer Gesellschaft mit enormen Erwartungshaltungen: Man soll perfekt aussehen, Karriere machen, reich sein. Diese ständigen gesellschaftlichen Zwänge und der Leistungsdruck ersticken das persönliche Glück vieler Menschen im Keim.

Sprecher 5: Die moderne Gehirnforschung zeigt, dass ein großer Teil unseres Grundtemperaments genetisch vorprogrammiert ist. Manche Menschen sind von Natur aus eher heiter, andere melancholisch. Wir können unser Glücksempfinden nur in begrenztem Maße willentlich steuern.

Sprecherin 6: Ich engagiere mich seit Jahren ehrenamtlich bei der Tafel. Anderen Menschen selbstlos zu helfen und für eine gute Sache einzustehen, gibt dem Leben Sinn, steigert das eigene Wohlbefinden und schenkt eine zutiefst optimistische Grundhaltung.

Sprecher 7: Man kann noch so spirituell eingestellt sein: Wenn man jeden Cent dreimal umdrehen muss und Angst vor der nächsten Stromrechnung hat, kann man nicht glücklich sein. Ein solides finanzielles Auskommen ist das unabdingbare Fundament für echtes Lebensglück.

Sprecherin 8: Wir verbringen den größten Teil unseres wachen Lebens am Arbeitsplatz. Wenn man dort weder Wertschätzung noch Respekt von Kollegen und Vorgesetzten erfährt, macht einen das auf Dauer unglücklich. Berufliche Anerkennung ist für mich unverzichtbar.""",
        "optionsStatements": [
            {"key": "a", "text": "Die Art und Weise, wie man Probleme löst, spielt eine Rolle für das Glücksempfinden."},
            {"key": "b", "text": "Ein solides finanzielles Auskommen ist die Grundlage für Glück."},
            {"key": "c", "text": "Gesellschaftliche Zwänge können das Glück des Einzelnen beeinträchtigen."},
            {"key": "d", "text": "Glück bedeutet, dass man sich selbst verwirklicht, wenn nötig auch auf Kosten anderer."},
            {"key": "e", "text": "Man kann nur glücklich sein, wenn man seine besonderen Talente ausleben kann."},
            {"key": "f", "text": "Ob wir uns glücklich fühlen, können wir nur in begrenztem Maße beeinflussen."},
            {"key": "g", "text": "Soziale Beziehungen sind die wichtigste Voraussetzung für Glück."},
            {"key": "h", "text": "Soziales Engagement führt zu mehr Wohlbefinden und einer optimistischeren Lebenseinstellung."},
            {"key": "i", "text": "Um glücklich zu sein, braucht man im beruflichen Umfeld Anerkennung."},
            {"key": "j", "text": "Unser Glücksempfinden hängt von unserer Sicht auf die Welt ab."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "j", "explanation": "Sprecher 1 sieht die subjektive Sichtweise und Lebenseinstellung als Ursprung des Glücksempfindens."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "a", "explanation": "Sprecherin 2 betont die Bedeutung von Bewältigungsstrategien und lösungsorientiertem Handeln."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "g", "explanation": "Sprecher 3 hält intakte Freundschaften und soziale Bindungen für das Fundament allen Glücks."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "c", "explanation": "Sprecherin 4 kritisiert gesellschaftliche Zwänge und Leistungsnormen, die das Wohlbefinden schmälern."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "f", "explanation": "Sprecher 5 verweist auf genetische Veranlagung und die begrenzte Steuerbarkeit unseres Glücksgefühls."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "h", "explanation": "Sprecherin 6 erfährt persönliches Wohlbefinden und Optimismus durch ehrenamtlichen Einsatz."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "b", "explanation": "Sprecher 7 argumentiert, dass eine solide materielle und finanzielle Basis für Glück zwingend notwendig ist."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "i", "explanation": "Sprecherin 8 benötigt Anerkennung und Wertschätzung im Beruf, um sich rundum glücklich zu fühlen."}
        ]
    },
    {
        "id": "hv1-studienfinanzierung",
        "themeTitle": "Studienfinanzierung",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Wie soll ein Hochschulstudium finanziert werden?
Moderator: BAföG, Eltern oder Nebenjob? Acht Personen diskutieren über Studienfinanzierung.

Sprecher 1: Bildung ist ein Menschenrecht. Wenn wir wollen, dass kluge Köpfe aus allen sozialen Schichten studieren können, muss der Staat durch Stipendien und bedarfsdeckendes BAföG dafür sorgen, dass jeder Mensch gleichberechtigten Zugang zur Universität erhält.

Sprecherin 2: Ich habe mein ganzes Studium über in einer Buchhandlung gearbeitet. Das hat mir nicht geschadet, im Gegenteil: Durch das selbstverdiente Geld lernt man Organisation, Verantwortungsbewusstsein und wird frühzeitig selbstständig.

Sprecher 3: Vielen Erstsemestern fehlt jegliches Grundwissen über Haushaltsführung, Mietverträge und Steuern. Wir müssen Schülern und Jugendlichen schon in der Schule fundiertes Finanzwissen beibringen, damit sie im Studium nicht in Schuldenfallen geraten.

Sprecherin 4: Die Wirtschaft profitiert enorm von erstklassig ausgebildeten Fachkräften. Deshalb sollten Großunternehmen und Wirtschaftsverbände viel mehr in duale Studienmodelle und eigene Stipendienprogramme für ihre künftigen Mitarbeiter investieren.

Sprecher 5: Es kann nicht sein, dass der Staat mit Steuergeldern Studienfächer finanziert, für die es auf dem Arbeitsmarkt überhaupt keinen Bedarf gibt. Staatliche Fördermittel sollten gezielt auf Fächer konzentriert werden, die gesellschaftlich dringend nachgefragt sind.

Sprecherin 6: Akademiker verdienen im Laufe ihres Berufslebens im Schnitt hunderttausende Euro mehr als Menschen ohne Hochschulabschluss. Daher ist es nur gerecht, wenn Akademiker die Kosten für ihre akademische Ausbildung später selbst über Beiträge tragen.

Sprecher 7: Wir reden jungen Leuten ein, dass man ohne Studium nichts wert ist. Das ist Unsinn. Handwerker und qualifizierte Facharbeiter werden händeringend gesucht und verdienen oft exzellent. Man sollte Schülern aufzeigen, dass man auch ohne Studium sehr gut verdienen kann.

Sprecherin 8: Laut Gesetz sind Eltern zwar unterhaltspflichtig, aber in der Realität weigern sich viele Eltern schlichtweg, ihre volljährigen Kinder finanziell zu unterstützen oder verlangen unzumutbare Gegenleistungen.""",
        "optionsStatements": [
            {"key": "a", "text": "Da Akademiker mehr verdienen, sollten sie die Kosten für ihr Studium selbst tragen."},
            {"key": "b", "text": "Der jungen Generation sollte frühzeitig finanzielle Bildung vermittelt werden."},
            {"key": "c", "text": "Durch staatliche Förderung soll Zugang zur Hochschulbildung für alle hergestellt werden."},
            {"key": "d", "text": "Es fördert die Selbstständigkeit, wenn Studierende ihren Lebensunterhalt durch Nebenjobs bestreiten."},
            {"key": "e", "text": "Es sollten nur Studiengänge, die auf dem Arbeitsmarkt gefragt sind, gefördert werden."},
            {"key": "f", "text": "Für die Finanzierung des Studiums sind in erster Linie die Eltern verantwortlich."},
            {"key": "g", "text": "Man sollte Schulabgänger darauf aufmerksam machen, dass sie auch ohne Studium gute Verdienstmöglichkeiten haben können."},
            {"key": "h", "text": "Nicht alle Eltern sind bereit, ihren Kindern das Studium zu finanzieren."},
            {"key": "i", "text": "Staatliche Förderung darf nicht vom Studienfach abhängig sein."},
            {"key": "j", "text": "Unternehmen sollten mehr Fördermöglichkeiten für ihre zukünftigen Arbeitskräfte zur Verfügung stellen."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "c", "explanation": "Sprecher 1 plädiert für staatliche Unterstützung, um Chancengleichheit und Hochschulzugang für alle zu sichern."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "d", "explanation": "Sprecherin 2 sieht im Eigenverdienst durch Nebenjobs eine wichtige Schulung von Selbstständigkeit."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "b", "explanation": "Sprecher 3 fordert frühzeitige ökonomische und finanzielle Bildung bereits während der Schulzeit."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "j", "explanation": "Sprecherin 4 nimmt Unternehmen in die Pflicht, ihren Nachwuchs durch Stipendien gezielt zu fördern."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "e", "explanation": "Sprecher 5 will Fördergelder an die tatsächliche Arbeitsmarktnachfrage der jeweiligen Studiengänge koppeln."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "a", "explanation": "Sprecherin 6 argumentiert mit höheren Akademikergehältern für eine spätere Eigenbeteiligung der Absolventen."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "g", "explanation": "Sprecher 7 verweist auf hervorragende Verdienstmöglichkeiten in Ausbildungsberufen auch ganz ohne Studium."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "h", "explanation": "Sprecherin 8 weist auf die Realität hin, dass manche Eltern die Studienfinanzierung ihrer Kinder verweigern."}
        ]
    },
    {
        "id": "hv1-gruenflaechen-gaerten",
        "themeTitle": "Grünflächen und Gärten",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Urbane Grünflächen und Gemeinschaftsgärten.
Moderator: Städte brauchen mehr Grün. Acht Bürger diskutieren über Grünflächen, Parks und Gärten.

Sprecher 1: Wenn von Grünflächen die Rede ist, denken alle nur an Parks. Aber moderne Städte bieten viel kreativere Nischen: begrünte Bushaltestellen, bepflanzte Fassaden, Urban Gardening auf Parkhausdächern und grüne Straßenbahngleise. Es gibt weit mehr unkonventionelle Optionen als gedacht.

Sprecherin 2: Der Trend zum Gemüseanbau mitten in der Großstadt ist völlig übertrieben. Bei Feinstaub, Reifenabrieb und Schwermetallen in der Stadtluft ist der Boden schlicht ungeeignet für gesunde Nutzpflanzen. Städte sind keine gesunde Umgebung für Gemüse.

Sprecher 3: Das Schönste an unserem Stadtteilgarten ist das Miteinander. Plötzlich kommen Nachbarn verschiedenster Nationalitäten und Altersgruppen zusammen, helfen sich und trinken Tee. Diese Gärten stärken das Gemeinschaftsgefühl im Viertel enorm.

Sprecherin 4: Gemeinschafts- und Schulgärten sind fantastische Lernorte für Kinder. Stadtkinder lernen dort praxisnah, wie Karotten wachsen, wie wichtig Bienen sind und wie Ökosysteme funktionieren. Man kann sie exzellent für pädagogische Zwecke nutzen.

Sprecher 5: Durch versiegelten Asphalt heizen sich Innenstädte im Sommer wie Backöfen auf. Bäume, begrünte Dächer und Rasenflächen wirken wie natürliche Klimaanlagen, kühlen das Mikroklima spürbar ab und verbessern die Luftqualität.

Sprecherin 6: Angesichts dramatischer Wohnungsnot sollten wir realistisch bleiben: Wir brauchen dringend bezahlbaren Wohnraum für Familien. Bezahlbare Wohnungen zu bauen hat absolute Priorität vor idyllischen Blumenbeeten mitten im Zentrum.

Sprecher 7: Wenn ich nach einem stressigen Tag im Büro durch den Park jogge oder mich ins Gras setze, verfliegt die innere Unruhe sofort. Zahlreiche Studien belegen, dass der Kontakt zur Natur das psychische Wohlbefinden und die seelische Gesundheit massiv stärkt.

Sprecherin 8: Schauen Sie sich unsere Parks nach dem Wochenende doch mal an: Überquellende Mülleimer, herumliegende Plastikverpackungen und Glasscherben. Städtische Grünanlagen sind leider oft alles andere als ein Aushängeschild für Sauberkeit.""",
        "optionsStatements": [
            {"key": "a", "text": "Gemeinschaftsgärten können auch zu pädagogischen Zwecken eingesetzt werden."},
            {"key": "b", "text": "Städtische Grünflächen sind oft kein Musterbeispiel an Sauberkeit."},
            {"key": "c", "text": "Gemeinschaftsgärten stärken den Zusammenhalt im Stadtviertel."},
            {"key": "d", "text": "Eine Stadt bietet mehr unkonventionelle Möglichkeiten, Grünflächen zu schaffen, als gedacht."},
            {"key": "e", "text": "Die Begrünung von Städten hat positive Auswirkungen auf das Stadtklima."},
            {"key": "f", "text": "Lehrgärten in Bildungseinrichtungen sind zu kostenintensiv."},
            {"key": "g", "text": "Städte sind keine gute Umgebung für den Anbau von Gemüse."},
            {"key": "h", "text": "Das Dach über dem Kopf ist wichtiger als die selbstgezogene Mohrrübe in der Hand."},
            {"key": "i", "text": "Grünflächen wirken sich positiv auf die psychische Gesundheit aus."},
            {"key": "j", "text": "Projekte für mehr Grünflächen stoßen auf Widerstand bei Politikern."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "d", "explanation": "Sprecher 1 weist auf originelle urbane Begrünungsmöglichkeiten wie Dach- und Gleisbepflanzungen hin."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "g", "explanation": "Sprecherin 2 sieht wegen Schadstoffen und städtischer Luftverschmutzung Städte als ungeeignet für Nutzpflanzen."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "c", "explanation": "Sprecher 3 hebt den sozialen Zusammenhalt und nachbarschaftlichen Kontakt im Stadtgarten hervor."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "a", "explanation": "Sprecherin 4 betont den pädagogischen Nutzen von Gärten für die Umweltbildung von Kindern."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "e", "explanation": "Sprecher 5 erklärt den kühlenden und regulierenden Effekt von städtischem Grün auf das Mikroklima."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "h", "explanation": "Sprecherin 6 priorisiert den Bau bezahlbaren Wohnraums vor dem Erhalt innerstädtischer Beete."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "i", "explanation": "Sprecher 7 beschreibt den stressmildernden und gesundheitsfördernden Einfluss von Natur auf die Psyche."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "b", "explanation": "Sprecherin 8 beanstandet Müll und mangelnde Sauberkeit in vielen städtischen Parkanlagen."}
        ]
    },
    {
        "id": "hv1-hausarbeiten",
        "themeTitle": "Hausarbeiten",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Der Stellenwert wissenschaftlicher Hausarbeiten im Studium.
Moderator: Sind schriftliche Hausarbeiten noch zeitgemäß? Acht Hochschulangehörige äußern sich.

Sprecher 1: Kaum ein Absolvent muss im späteren Berufsleben jemals eine 20-seitige Abhandlung nach Uni-Standards verfassen. Viel wichtiger wäre es, prägnante Berichte, Projektanträge und verständliche E-Mails zu trainieren. Klassische Hausarbeiten sollten durch berufsrelevante Schreibübungen ersetzt werden.

Sprecherin 2: Nicht nur die Studierenden stöhnen über den Arbeitsaufwand. Für Dozenten bedeutet die Korrektur dutzender Hausarbeiten einen gigantischen, oft unbezahlten Berg an Korrekturzeit. Auch für die Lehrenden stellen Hausarbeiten eine erhebliche Belastung dar.

Sprecher 3: Viele Erstsemester kommen direkt von der Schule und haben nie gelernt, wie man eine methodisch saubere Forschungsfrage formuliert und sauber zitiert. Der akademische Anspruch von Hausarbeiten überfordert viele Studierende völlig.

Sprecherin 4: Die Modularisierung im Bologna-System hat den Studienkalender extrem verdichtet. Wenn man in den Semesterferien parallel drei Hausarbeiten einreichen muss, erzeugt das massiven Prüfungsdruck. Hausarbeiten verursachen unnötigen Stress.

Sprecher 5: Hausarbeiten sind eine wunderbare Möglichkeit, in die Tiefe zu gehen, aber die Prüfungsordnungen lassen oft schlicht keinen Raum dafür. Die Studiengänge müssten dringend so reformiert werden, dass Studierende ausreichend Zeit haben, um gründlich zu recherchieren.

Sprecherin 6: Nur wer selbst einmal Quellen recherchiert, Hypothesen aufgestellt und eine kohärente Argumentation zu Papier gebracht hat, versteht Wissenschaft wirklich. Hausarbeiten sind unverzichtbar, um wissenschaftliches Arbeiten von Grund auf zu erlernen.

Sprecher 7: Im Zeitalter von Ghostwriting und KI-Tools wie ChatGPT ist eine Kontrolle der Eigenständigkeit kaum noch möglich. Da Hausarbeiten zu massiven Täuschungsversuchen einladen, sollte man lieber auf mündliche Prüfungen und Klausuren ausweichen.

Sprecherin 8: In den Geistes- und Sozialwissenschaften sind Essays und Hausarbeiten das Fundament. Aber in Fächern wie Mathematik, Informatik oder Physik machen sie wenig Sinn. Hausarbeiten sollten nur in bestimmten Disziplinen als Leistungsnachweis verlangt werden.""",
        "optionsStatements": [
            {"key": "a", "text": "Der mit Hausarbeiten verbundene wissenschaftliche Anspruch überfordert Studierende."},
            {"key": "b", "text": "Dozenten sollten sich mehr Zeit nehmen, um die Hausarbeiten mit den Studierenden zu besprechen."},
            {"key": "c", "text": "Die Studiengänge sollten so gestaltet werden, dass die Studierenden mehr Zeit für Hausarbeiten haben."},
            {"key": "d", "text": "Der wichtigste Zweck von Hausarbeiten ist es, das Durchhaltevermögen der Studierenden zu stärken."},
            {"key": "e", "text": "Da Hausarbeiten Betrugsversuche ermöglichen, sollte auf andere Leistungsnachweise ausgewichen werden."},
            {"key": "f", "text": "Auch für Lehrkräfte stellen Hausarbeiten eine Belastung dar."},
            {"key": "g", "text": "Hausarbeiten sollten nur in bestimmten Fächern als Leistungsnachweis verwendet werden."},
            {"key": "h", "text": "Um zu lernen, wissenschaftlich zu arbeiten, sind Hausarbeiten unverzichtbar."},
            {"key": "i", "text": "Da Studierende einen engen Zeitplan haben, verursachen Hausarbeiten unnötigen Stress."},
            {"key": "j", "text": "Wissenschaftliche Hausarbeiten sollten durch beruflich relevante Schreibübungen ersetzt werden."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "j", "explanation": "Sprecher 1 fordert praxisnähere, berufsorientierte Schreibformate anstelle theoretischer Hausarbeiten."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "f", "explanation": "Sprecherin 2 verweist auf den enormen Korrekturaufwand, der Dozenten und Lehrkräfte belastet."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "a", "explanation": "Sprecher 3 sieht in den hohen wissenschaftlichen Standards eine Überforderung junger Studierender."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "i", "explanation": "Sprecherin 4 kritisiert die zeitliche Überfrachtung, die durch Hausarbeiten zu Dauerstress führt."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "c", "explanation": "Sprecher 5 fordert mehr Freiräume und Zeitfenster im Curriculum für fundierte Hausarbeiten."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "h", "explanation": "Sprecherin 6 hält das Verfassen eigener Hausarbeiten für das zentrale Werkzeug wissenschaftlichen Lernens."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "e", "explanation": "Sprecher 7 warnt vor Betrug und Plagiaten und plädiert für alternative Prüfungsformen."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "g", "explanation": "Sprecherin 8 befürwortet Hausarbeiten ausschließlich in Fächern, zu denen sie fachlich passen."}
        ]
    },
    {
        "id": "hv1-nebenjobs",
        "themeTitle": "Nebenjobs im Studium",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Arbeiten neben dem Studium: Fluch oder Segen?
Moderator: Viele Studierende verdienen sich ihren Lebensunterhalt selbst. Acht Meinungen dazu.

Sprecher 1: Wenn man jeden Monat von den Eltern finanziert wird und sich um nichts kümmern muss, nimmt man das Studium oft auf die leichte Schulter. Das Wissen, dass man selbst für seine Zukunft zahlt, motiviert viel mehr. Vollfinanzierung durch Eltern kann die Motivation spürbar senken.

Sprecherin 2: Ein Nebenjob lehrt einen Dinge, die kein Seminar der Welt vermitteln kann: Konfliktfähigkeit, Verlässlichkeit und Teamgeist. Durch die Arbeitserfahrung entwickelt man sich menschlich und charakterlich enorm weiter.

Sprecher 3: Viele meiner Mitstudierenden arbeiten 20 Stunden pro Woche und fallen dann durch Klausuren. Man kann nicht gleichzeitig vollzeit studieren und nebenher arbeiten; die Konzentration und Fokussierung auf die Inhalte leidet dramatisch.

Sprecherin 4: Meine Devise lautet: Wer das Glück hat, dass die Familie das Studium finanzieren kann, sollte sich voll auf die Noten und einen schnellen Abschluss konzentrieren. Wer nicht zwingend auf Geld angewiesen ist, sollte neben dem Studium lieber nicht jobben.

Sprecher 5: Ich arbeite als Werkstudent in einem IT-Unternehmen. Das Praxiswissen, das ich dort erwerbe, hilft mir direkt bei meinen Vorlesungen und Klausuren an der Uni. Gezielte Nebenjobs können den Lernerfolg im Studium spürbar steigern.

Sprecherin 6: Für mich ist die eigene Unabhängigkeit das Wichtigste. Wenn ich mein eigenes Geld verdiene, bin ich niemandem Rechenschaft schuldig, weder über meine Ausgaben noch über meine Studienentscheidungen. Das eigene Geld schenkt echte Freiheit.

Sprecher 7: Noten sind bei einer Bewerbung längst nicht alles. Personaler schauen ganz genau darauf, ob ein Bewerber schon echte Arbeitsluft geschnuppert hat. Durch Praxiserfahrung aus Nebenjobs hat man bei der späteren Jobsuche einen riesigen Vorsprung.

Sprecherin 8: Das Studentenleben soll doch die schönste Zeit im Leben sein: Reisen, Konzerte, Sport und Kultur. Aber all das kostet Geld. Um seine freie Zeit wirklich genießen und auskosten zu können, braucht man schlichtweg ein solides Budget.""",
        "optionsStatements": [
            {"key": "a", "text": "Nebenjobs können sich positiv auf den Lernerfolg auswirken."},
            {"key": "b", "text": "Um seine Freizeit genießen zu können, braucht man ausreichend finanzielle Mittel."},
            {"key": "c", "text": "Wenn man dauerhaft neben dem Studium arbeitet, könnten Stress und Leistungsdruck zu gesundheitlichen Problemen führen."},
            {"key": "d", "text": "Wer nebenbei arbeitet, kann sich nicht genug auf das Studium konzentrieren."},
            {"key": "e", "text": "Wer nicht finanziell darauf angewiesen ist, sollte neben dem Studium nicht arbeiten."},
            {"key": "f", "text": "Wer sein Studium selbst finanziert, gewinnt Freiheit und muss seine Entscheidungen nicht vor anderen rechtfertigen."},
            {"key": "g", "text": "Bei der Suche nach einer Arbeitsstelle kann es nützlich sein, durch Nebenjobs Praxiserfahrung gesammelt zu haben."},
            {"key": "h", "text": "Man sollte einen Nebenjob während des Studiums nutzen, um Kontakte zu Unternehmen zu knüpfen."},
            {"key": "i", "text": "Es kann die Motivation für das Studium negativ beeinflussen, wenn dieses von den Eltern finanziert wird."},
            {"key": "j", "text": "Jobs neben dem Studium tragen dazu bei, dass man sich persönlich weiterentwickeln kann."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "i", "explanation": "Sprecher 1 sieht ein Motivationsrisiko, wenn Studierende komplett von den Eltern alimentiert werden."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "j", "explanation": "Sprecherin 2 betont die persönliche Reifung und Weiterentwicklung durch Praxiserfahrung im Nebenjob."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "d", "explanation": "Sprecher 3 warnt vor Konzentrationsmangel und schlechteren Studienleistungen durch Nebenarbeit."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "e", "explanation": "Sprecherin 4 rät finanziell abgesicherten Studierenden vom Jobben ab, um sich ganz aufs Studium zu fokussieren."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "a", "explanation": "Sprecher 5 berichtet von Synergieeffekten zwischen Werkstudententätigkeit und universitärem Lernerfolg."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "f", "explanation": "Sprecherin 6 genießt die Unabhängigkeit und Freiheit, sich vor niemandem rechtfertigen zu müssen."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "g", "explanation": "Sprecher 7 hebt den Vorteil gesammelter Praxiserfahrung bei späteren Bewerbungen hervor."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "b", "explanation": "Sprecherin 8 betont, dass man für eine genussvolle Freizeitgestaltung schlichtweg finanzielle Mittel benötigt."}
        ]
    },
    {
        "id": "hv1-mahlzeit-ernaehrung",
        "themeTitle": "Mahlzeit und Ernährung",
        "difficulty": "C1 Hochschule",
        "audioTranscript": """Thema: Ernährungsgewohnheiten und Leistungsfähigkeit im Alltag.
Moderator: Wie ernähren sich Studierende und Berufstätige heute? Acht Stimmen zur Ernährung.

Sprecher 1: Zwischen langen Vorlesungen, Prüfungen und Pendeln greift man schnell zum Schokoriegel oder zur Tiefkühlpizza. Der stressige, durchgetaktete Alltag und akuter Zeitmangel sind die größten Barrieren für eine ausgewogene, gesunde Ernährung.

Sprecherin 2: In unserer WG essen wir abends fast immer zusammen. Man tauscht sich aus, lacht und lässt den Tag Revue passieren. Das gemeinsame Kochen und Essen ist Balsam für die Seele und steigert das psychische Wohlbefinden enorm.

Sprecher 3: Gesundes Essen muss überhaupt nicht teuer sein. Wer am Wochenende plant, auf dem Wochenmarkt saisonales Gemüse kauft und vorkocht, ernährt sich extrem vollwertig, auch wenn man jeden Euro zweimal umdrehen muss.

Sprecherin 4: Was viele unterschätzen: Unser Gehirn braucht hochwertige Nährstoffe wie Omega-3-Fettsäuren, Nüsse und Vollkornprodukte. Durch die richtige Lebensmittelauswahl kann man die Konzentration und geistige Lernfähigkeit direkt ankurbeln.

Sprecher 5: Ständig Kalorien zählen, Superfoods suchen und stundenlang in der Küche stehen: Der immense Aufwand, der heute um gesunde Ernährung betrieben wird, steht für mich in keinem Verhältnis zum tatsächlichen Nutzen.

Sprecherin 6: Man muss nicht von heute auf morgen sein ganzes Leben umkrempeln. Es reicht, erst einmal ein Ernährungstagebuch zu führen und sich ehrlich anzusehen, wann und warum man zu Ungesundem greift. Selbstreflexion ist der erste Schritt zur Besserung.

Sprecher 7: Viele denken, gesund zu essen bedeute freudlosen Verzicht auf alles Leckere. Das ist völliger Unsinn! Eine frische mediterrane Küche mit gutem Olivenöl und frischen Kräutern beweist, dass kulinarischer Genuss und gesunde Ernährung Hand in Hand gehen.

Sprecherin 8: Wenn man sich die Preise für Bio-Produkte, frische Beeren und hochwertige Fette ansieht, wird klar: Gesunde Ernährung ist heute leider auch eine Klassenfrage. Ob man sich wirklich ausgewogen ernähren kann, hängt stark vom Geldbeutel ab.""",
        "optionsStatements": [
            {"key": "a", "text": "Es erfordert nicht viel Mühe, auf eine ausgewogene Ernährung zu achten."},
            {"key": "b", "text": "Durch die Wahl gesunder Nahrungsmittel lässt sich die Lernfähigkeit positiv beeinflussen."},
            {"key": "c", "text": "Zeitmangel und ein anstrengender Alltag sind Hindernisse für eine gesunde Ernährung."},
            {"key": "d", "text": "Die Vorteile gesunder Ernährung wiegen den damit verbundenen Aufwand nicht auf."},
            {"key": "e", "text": "Der erste Schritt zu einer gesünderen Ernährung ist es, die eigenen Gewohnheiten zu überprüfen."},
            {"key": "f", "text": "Gemeinsame Mahlzeiten wirken sich positiv auf das Wohlbefinden aus."},
            {"key": "g", "text": "Es hängt auch von den eigenen finanziellen Möglichkeiten ab, ob man sich gesund ernähren kann."},
            {"key": "h", "text": "Wenn man die Mahlzeiten vorausplant und selbst kocht, kann man sich auch mit kleinem Geldbeutel gesund ernähren."},
            {"key": "i", "text": "Um in Lernphasen nicht zu ermüden, sollte man vor allem darauf achten, nicht übermäßig große Portionen zu essen."},
            {"key": "j", "text": "Genuss beim Essen und ein ausgeglichenes Essverhalten schließen einander nicht aus."}
        ],
        "items": [
            {"id": "47", "prompt": "Sprecher 1", "correctAnswer": "c", "explanation": "Sprecher 1 macht Hektik und Zeitnot für ungesunde Ernährungsgewohnheiten verantwortlich."},
            {"id": "48", "prompt": "Sprecherin 2", "correctAnswer": "f", "explanation": "Sprecherin 2 hebt den positiven seelischen Effekt gemeinsamer Mahlzeiten im Freundes- oder WG-Kreis hervor."},
            {"id": "49", "prompt": "Sprecher 3", "correctAnswer": "h", "explanation": "Sprecher 3 zeigt auf, dass Vorausplanung und Selbstkochen gesunde Ernährung auch bei geringem Budget ermöglichen."},
            {"id": "50", "prompt": "Sprecherin 4", "correctAnswer": "b", "explanation": "Sprecherin 4 verknüpft nährstoffreiche Kost direkt mit gesteigerter Lern- und Gehirnleistung."},
            {"id": "51", "prompt": "Sprecher 5", "correctAnswer": "d", "explanation": "Sprecher 5 findet, dass der betriebene Zeit- und Aufwand die gesundheitlichen Vorteile nicht rechtfertigt."},
            {"id": "52", "prompt": "Sprecherin 6", "correctAnswer": "e", "explanation": "Sprecherin 6 empfiehlt als ersten Schritt eine ehrliche Überprüfung der eigenen Essgewohnheiten."},
            {"id": "53", "prompt": "Sprecher 7", "correctAnswer": "j", "explanation": "Sprecher 7 unterstreicht, dass Genuss und ausgewogene Ernährung sich keineswegs ausschließen."},
            {"id": "54", "prompt": "Sprecherin 8", "correctAnswer": "g", "explanation": "Sprecherin 8 verweist auf hohe Lebensmittelpreise und sieht finanzielle Mittel als maßgeblichen Faktor."}
        ]
    }
]

out_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'hv1_topics.json')
with open(out_path, 'w', encoding='utf-8') as f:
    json.dump(topics, f, ensure_ascii=False, indent=2)

print(f"Successfully generated {len(topics)} topics in {out_path}")
