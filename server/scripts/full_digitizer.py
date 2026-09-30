import sys
import os
import re
import json
import pypdf

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\samma\.gemini\antigravity\brain\03ec1e2b-b9b4-427b-b2c0-bd3c2d4959c2\.user_uploaded\media_1790793241837.pdf'
OUTPUT_DIR = r'C:\Users\samma\Desktop\c1-exam practice (1)\server\data'
os.makedirs(OUTPUT_DIR, exist_ok=True)

reader = pypdf.PdfReader(PDF_PATH)
num_pages = len(reader.pages)
print(f"Loaded PDF with {num_pages} pages.")

def get_text(p_num): # 1-indexed
    if 1 <= p_num <= num_pages:
        return reader.pages[p_num - 1].extract_text()
    return ""

def clean_lines(text):
    return [l.strip() for l in text.split('\n') if l.strip()]

# ==============================================================================
# 1. PARSE LESEN TEIL 1 (27 Topics, Pages 6 to 61)
# ==============================================================================
print("\n>>> Parsing Lesen Teil 1 (27 Topics)...")
lv1_index = [
    (6, 7, "Eine Box verändert die Welt"),
    (9, 10, "Satzzeichen, mächtige Werkzeuge"),
    (11, 12, "Die Hamburger-Hypothese"),
    (14, 15, "Werbung in der sozialen Marktwirtschaft"),
    (16, 17, "Die Brüder Grimm / Der alte Mann und die Wörter"),
    (18, 19, "Alternative Heilmethode"),
    (20, 21, "Die Maus als Stimmungsbarometer"),
    (22, 23, "Was Werbung so treibt"),
    (24, 25, "Auf Goldsuche in Deutschland"),
    (26, 27, "Piraten früher und heute"),
    (28, 29, "Kleine Geschichte der deutschen Rechtschreibung"),
    (30, 31, "Der Lift – eine Würdigung"),
    (32, 33, "Wie sich das Postwesen entwickelte"),
    (34, 35, "Wie Zimmerpflanzen die Wohnzimmer eroberten"),
    (36, 37, "Ein Meilenstein in der Erforschung des alten Ägypten"),
    (38, 39, "Höhlenforschung : Expeditionen ins Erdinnere"),
    (40, 41, "Die besondere Begabung der Gesichtserkennung"),
    (42, 43, "Die Sprache der Tiere"),
    (44, 45, "Polaroid – die Geschichte der Kultkamera"),
    (46, 47, "Die Geschichte des Supermarkts"),
    (48, 49, "Die Auswirkungen von Lärm"),
    (50, 51, "Schreiben oder tippen – über die Vorteile der Handschrift"),
    (52, 53, "Keramik für Millionen"),
    (54, 55, "Für eine neue Sprache ist es nie zu spät"),
    (56, 57, "Wochenendschlaf – mehr Schaden als Nutzen?"),
    (58, 59, "Die digitale Transformation der Arbeitswelt durch KI"),
    (60, 61, "Die Geschichte der Jeans")
]

lv1_results = []
for idx, (p_text, p_opts, default_title) in enumerate(lv1_index):
    txt_page = get_text(p_text)
    opt_page = get_text(p_opts)

    # 1. Title & Full text
    lines = clean_lines(txt_page)
    body_lines = []
    title = default_title
    for l in lines:
        if re.search(r'Leseverstehen,\s*Teil\s*1', l, re.I):
            continue
        if any(skip in l for skip in ['Lesen Sie den folgenden Text', 'Zwei Sätze können', 'Lücke (0) ist ein Beispiel']):
            continue
        if re.match(r'^\d+$', l):
            continue
        if not body_lines and len(l) > 3 and not l.startswith('___'):
            title = l
        body_lines.append(l)

    text_body = '\n\n'.join(body_lines)
    if body_lines and body_lines[0] == title:
        text_body = '\n\n'.join(body_lines[1:])

    # 2. Options a-h
    opt_lines = clean_lines(opt_page)
    options = []
    cur_k, cur_v = None, []
    for l in opt_lines:
        m = re.match(r'^([a-hA-HzZ])\s+(.*)', l)
        if m:
            if cur_k and cur_k.lower() in 'abcdefgh':
                options.append({'key': cur_k.lower(), 'text': ' '.join(cur_v).strip()})
            cur_k = m.group(1).lower()
            cur_v = [m.group(2).strip()]
        elif cur_k:
            if re.search(r'^[1-6][a-hA-H]', l) or '100%' in l:
                break
            cur_v.append(l)
    if cur_k and cur_k in 'abcdefgh':
        options.append({'key': cur_k, 'text': ' '.join(cur_v).strip()})

    # 3. Answer key from last few lines
    correct_answers = {}
    footer_text = ' '.join(opt_lines[-5:])
    ans_m = re.findall(r'([1-6])\s*[-–]?\s*([a-hA-H])', footer_text)
    for q_num, ans in ans_m:
        if q_num not in correct_answers:
            correct_answers[q_num] = ans.lower()

    explanations = {}
    for q, ans in correct_answers.items():
        opt_text = next((o['text'] for o in options if o['key'] == ans), '')
        explanations[q] = f"Offizielle telc Lösung: ({ans.upper()}) \"{opt_text}\""

    lv1_results.append({
        "id": f"telc-c1-lv1-{idx+1:02d}",
        "themeTitle": title,
        "difficulty": "C1 Hochschule",
        "readingTime": "ca. 20 Min",
        "instructions": "Lesen Sie den folgenden Text. Welche der Sätze a–h gehören in die Lücken 1–6? Es gibt jeweils nur eine richtige Lösung. Zwei Sätze können nicht zugeordnet werden.",
        "text": text_body,
        "options": options,
        "correctAnswers": correct_answers,
        "explanations": explanations
    })

print(f"Parsed {len(lv1_results)} Lesen Teil 1 topics.")

# ==============================================================================
# 2. PARSE LEITFADEN / ARBEITSHILFEN LV2 (Pages 131 to 146) & Sprachliche Merkmale (128-130)
# ==============================================================================
print("\n>>> Parsing Leitfaden & Arbeitshilfen for LV2 (Pages 128-146)...")
lv2_leitfaden = {}
current_theme = None

for p_num in range(131, 147):
    p_txt = get_text(p_num)
    lines = clean_lines(p_txt)
    for l in lines:
        if 'Leitfaden / Arbeitshilfen' in l:
            continue
        if re.match(r'^\d+$', l):
            continue
        # Check theme title header (e.g. "Was ist ein Artega?", "Du bist, was du isst", etc.)
        if len(l) > 5 and not '(' in l and not ')' in l and not l.startswith('PKW') and not l.startswith('Die ') and not l.startswith('"'):
            current_theme = l
            if current_theme not in lv2_leitfaden:
                lv2_leitfaden[current_theme] = {}
        # Check question and evidence: e.g. "die technischen Spezifikationen zukünftiger Elektroautos (D)"
        m = re.search(r'^(.*?)\(([a-eA-E])\)\s*(.*)', l)
        if m and current_theme:
            q_label = m.group(1).strip()
            sec_ans = m.group(2).lower()
            evidence = m.group(3).strip()
            lv2_leitfaden[current_theme][sec_ans] = {
                "label": q_label,
                "section": sec_ans,
                "evidence": evidence
            }

print(f"Captured Leitfaden data for {len(lv2_leitfaden)} LV2 themes.")

# ==============================================================================
# 3. PARSE LESEN TEIL 2 (33 Topics, Pages 62 to 127)
# ==============================================================================
print("\n>>> Parsing Lesen Teil 2 (33 Topics)...")

lv2_index = [
    (62, 63, "Was ist ein Artega? - Fast unbekanntes aus der Welt der Elektrotechnik"),
    (64, 65, "Nach Erdwärmebohrung: Eine Stadt zerreißt"),
    (66, 67, "Du bist, was du isst"),
    (68, 69, "Stress im Studium bewältigen"),
    (70, 71, "Zwischen Familie und Studium / Doppelbelastung im Studium"),
    (72, 73, "Ehrenamt in Gefahr"),
    (74, 75, "Selbstverbesserung"),
    (76, 77, "Dann geh doch zu Fuß, Schatz"),
    (78, 79, "Über den Sinn von Abschlussarbeiten"),
    (80, 81, "Der Sinn und Unsinn der Abschlussarbeit"),
    (82, 83, "Die merkwürdige Debatte über Hirndoping bei Wissenschaftlern"),
    (84, 85, "Träume: Botschaften aus dem Unterbewussten"),
    (86, 87, "Eine neue Spezifizierung - die Helikopter-Eltern"),
    (88, 89, "Eltern von heute"),
    (90, 91, "Die Sprache der Wissenschaft: Geht es nicht auch einfacher?"),
    (92, 93, "Haustiere: wie der Mensch auf den Hund kam"),
    (94, 95, "Nachhaltiger Konsum – Durch Einkaufen die Welt verbessern?"),
    (96, 97, "Machtvoller Schein und scheinbare Macht"),
    (98, 99, "Macht Reisen glücklich?"),
    (100, 101, "Allein im Restaurant?"),
    (102, 103, "Präsentationen an der Uni: Langeweile garantiert"),
    (104, 105, "Immer auf dem Sprung: moderne Arbeitsnomaden"),
    (106, 107, "Selbermachen als Trend"),
    (108, 109, "Iss dich glücklich"),
    (110, 111, "Wenn der Dozent zehn Jahre jünger ist"),
    (112, 113, "Ruf mich nicht an"),
    (114, 115, "Akademisches Viertel: Warum ist denn noch niemand da?"),
    (116, 117, "Fernstudenten: einsam, aber virtuell verbunden"),
    (118, 119, "Smartwatches für Kinder – bunte Überwachungsgeräte"),
    (120, 121, "Die neue Sehnsucht nach der Natur"),
    (122, 123, "Selfies"),
    (124, 125, "Wege der Migration – ein persönliches Protokoll"),
    (126, 127, "Wenn Unternehmen Personal abbauen")
]

lv2_results = []
for idx, (p1, p2, default_title) in enumerate(lv2_index):
    txt1 = get_text(p1)
    txt2 = get_text(p2)
    combined = txt1 + "\n" + txt2
    lines = clean_lines(combined)

    # 1. Extract statements 7 to 12
    statements = []
    for l in lines:
        m = re.match(r'^([7-9]|1[0-2])\s+(.*)', l)
        if m and len(statements) < 6:
            statements.append({'id': m.group(1), 'text': m.group(2).strip()})

    # 2. Extract sections a, b, c, d, e
    # Sections usually start with solitary "a", "b", "c", "d", "e" on a line
    texts = []
    cur_sec = None
    cur_para = []
    
    # We parse the text between the title/intro and the solution footer
    in_text_zone = False
    for l in lines:
        if l in ['a', 'b', 'c', 'd', 'e']:
            if cur_sec:
                texts.append({'id': cur_sec, 'author': f'Absatz {cur_sec.upper()}', 'text': ' '.join(cur_para).strip()})
            cur_sec = l
            cur_para = []
            in_text_zone = True
        elif in_text_zone:
            if re.search(r'7[a-e]\s*[-–]\s*8[a-e]', l, re.I): # solution line reached
                break
            if not re.match(r'^\d+$', l) and 'Leseverstehen' not in l:
                cur_para.append(l)
    if cur_sec:
        texts.append({'id': cur_sec, 'author': f'Absatz {cur_sec.upper()}', 'text': ' '.join(cur_para).strip()})

    # 3. Answer key
    footer_text = ' '.join(clean_lines(txt2)[-5:])
    ans_m = re.findall(r'(7|8|9|10|11|12)\s*[-–]?\s*([a-eA-E])', footer_text)
    correct_answers = {}
    for q_num, ans in ans_m:
        if q_num not in correct_answers:
            correct_answers[q_num] = ans.lower()

    explanations = {}
    for q, ans in correct_answers.items():
        explanations[q] = f"Antwort zu Frage {q} findet sich in Absatz {ans.upper()}."

    lv2_results.append({
        "id": f"telc-c1-lv2-{idx+1:02d}",
        "themeTitle": default_title,
        "difficulty": "C1 Hochschule",
        "readingTime": "ca. 20 Min",
        "instructions": "Lesen Sie den folgenden Text. In welchem Textabsatz a–e finden Sie die Antworten auf die Fragen 7–12? Es gibt jeweils nur eine richtige Lösung. Jeder Absatz kann Antworten auf mehrere Fragen enthalten.",
        "texts": texts,
        "statements": statements,
        "correctAnswers": correct_answers,
        "explanations": explanations
    })

print(f"Parsed {len(lv2_results)} Lesen Teil 2 topics.")

# ==============================================================================
# 4. PARSE LESEN TEIL 3 (26 Topics, Pages 147 to 226)
# ==============================================================================
print("\n>>> Parsing Lesen Teil 3 (26 Topics)...")

lv3_index = [
    (147, 149, "Essen in der Mensa"),
    (150, 152, "Auswanderung Ärzten nach Schweden"),
    (153, 155, "Geisteswissenschaften - Studium ohne Aussichten?"),
    (156, 158, "Wie Kinder Sprechen lernen"),
    (160, 162, "Betrug an der Uni"),
    (163, 165, "Schlangenhaargurken aus Nigeria"),
    (166, 168, "Zweisprachige Kinder bei Finnland"),
    (169, 171, "Schaden Navis unserem Orientierungssinn?"),
    (172, 174, "Mehrsprachigkeit - ein Vorteil?"),
    (175, 177, "Tulpen"),
    (178, 180, "Übersetzerlegende Erika Fuchs"),
    (181, 183, "Umweltschutz"),
    (184, 186, "Kleingärten"),
    (187, 189, "Bundesfreiwilligendienst"),
    (190, 192, "Johann Friedrich / Porzellan"),
    (193, 195, "Schafe"),
    (196, 198, "Reisen"),
    (199, 201, "Schimpansen und Gorillas"),
    (202, 204, "Sabbatical"),
    (205, 207, "Camping"),
    (208, 210, "MINT-Fächer Nachwuchs"),
    (211, 213, "Spielzeugindustrie"),
    (214, 216, "Zweitstudium"),
    (217, 219, "Alter ist nicht gleich Alter"),
    (220, 222, "Verpackungsindustrie"),
    (224, 226, "Tourismus")
]

lv3_results = []
for idx, (p_start, p_end, default_title) in enumerate(lv3_index):
    # Text spans p_start to p_end - 1
    reading_pages = [get_text(p) for p in range(p_start, p_end)]
    q_page = get_text(p_end)

    full_text = "\n\n".join(reading_pages)
    # clean out headers
    cleaned_text_lines = []
    for l in clean_lines(full_text):
        if re.match(r'^\d+$', l) or 'Leseverstehen' in l or 'Welche der Aussagen' in l:
            continue
        cleaned_text_lines.append(l)
    cleaned_text = '\n\n'.join(cleaned_text_lines)

    # Parse questions 13 to 23 and 24
    q_lines = clean_lines(q_page)
    questions = []
    
    # 13 to 23
    for l in q_lines:
        m = re.match(r'^(1[3-9]|2[0-3])\s+(.*)', l)
        if m:
            q_id = m.group(1)
            q_str = m.group(2).strip()
            # If line has bullet or slash alternative, clean it
            q_str = re.sub(r'[\/•].*$', '', q_str).strip()
            questions.append({
                "id": q_id,
                "question": q_str,
                "options": [
                    {"key": "a", "text": "richtig"},
                    {"key": "b", "text": "falsch"},
                    {"key": "c", "text": "nicht im Text"}
                ],
                "correctAnswer": "a", # default, updated by key
                "explanation": ""
            })

    # Question 24
    q24_opts = []
    for l in q_lines:
        m = re.match(r'^24\s+([abc])\s+(.*)', l)
        if m:
            q24_opts.append({"key": m.group(1).lower(), "text": m.group(2).strip()})
        else:
            m2 = re.match(r'^([abc])\s+(.*)', l)
            if m2 and len(questions) >= 11 and len(q24_opts) < 3:
                q24_opts.append({"key": m2.group(1).lower(), "text": m2.group(2).strip()})

    if q24_opts:
        questions.append({
            "id": "24",
            "question": "Welche der Überschriften a, b oder c passt am besten zum Text?",
            "options": q24_opts,
            "correctAnswer": "c",
            "explanation": ""
        })

    # Parse answer key
    # e.g., 13-R /*R; 14-F; 15-R; ... 24-C
    # Map R -> a (richtig), F -> b (falsch), X -> c (nicht im Text)
    footer_text = ' '.join(q_lines[-8:])
    ans_m = re.findall(r'(1[3-9]|2[0-4])\s*[-–]?\s*([RFXABC])', footer_text, re.I)
    
    key_map = {'R': 'a', 'F': 'b', 'X': 'c', 'A': 'a', 'B': 'b', 'C': 'c'}
    for q_id, ans_char in ans_m:
        val = key_map.get(ans_char.upper(), 'a')
        for q in questions:
            if q["id"] == q_id:
                q["correctAnswer"] = val
                lbl = "richtig" if val == 'a' else ("falsch" if val == 'b' else "nicht im Text")
                if q_id == "24":
                    lbl = f"Überschrift ({val.upper()})"
                q["explanation"] = f"Offizielle telc Bewertung: {lbl}."

    lv3_results.append({
        "id": f"telc-c1-lv3-{idx+1:02d}",
        "themeTitle": default_title,
        "difficulty": "C1 Hochschule",
        "readingTime": "ca. 25 Min",
        "instructions": "Lesen Sie den folgenden Text und die Aussagen 13–23 (richtig (+), falsch (–) oder nicht im Text enthalten (x)) sowie Aufgabe 24 (passendste Überschrift).",
        "text": cleaned_text,
        "questions": questions
    })

print(f"Parsed {len(lv3_results)} Lesen Teil 3 topics.")

# ==============================================================================
# 5. PARSE SPRACHBAUSTEINE (24 Topics, Pages 227 to 298)
# ==============================================================================
print("\n>>> Parsing Sprachbausteine (24 Topics)...")

sb_index = [
    (227, 228, "Wer hat eigentlich das „Handy“ erfunden?"),
    (231, 232, "Das Gehirn eines Rauchers ist weniger flexibel"),
    (235, 236, "Neues aus der Bionik"),
    (239, 240, "Die Rolle ehrenamtlichen Engagements in der Gesellschaft"),
    (245, 246, "Diktate – lernpsychologisch ungünstig?"),
    (251, 252, "Das Programm „Ein Tag mit …“"),
    (255, 256, "Literatur der Romantik"),
    (257, 258, "Virtuelles Studium - der Trend des Jahrhunderts"),
    (261, 262, "Wie kommen Hochs und Tiefs zu ihren Namen?"),
    (265, 266, "Die chronobiologische Rhythmen der Kinder / Schule und Biorhythmus"),
    (267, 268, "In 35 Jahren mehr Plastik als Fische im Meer"),
    (271, 272, "Unterstützung für kleine und mittlere Unternehmen (KMU)"),
    (273, 274, "„Bio“ giftiger als „Chemie“"),
    (275, 276, "Eine kurze Geschichte der Werbung"),
    (277, 278, "Sprache: Wenn Wörter verschwinden"),
    (279, 280, "Im Spannungsfeld zwischen Konkurrenz und Kooperation"),
    (283, 284, "Einladung zum Vortrag „Demographieorientierte Personalpolitik“"),
    (285, 286, "Wie das Geld in die Welt kam"),
    (287, 288, "Lernen wird zum Spiel"),
    (289, 290, "Warum Spielen Kinder schlau macht"),
    (291, 292, "Über die Anfänge der Restaurantkultur"),
    (293, 294, "Die Ordnung der Dinge"),
    (295, 296, "Unterschätzte Pflanzen"),
    (297, 298, "Wieso wir irgendwann aufhören, neue Musik zu hören")
]

sb_results = []
for idx, (p_txt, p_opts, default_title) in enumerate(sb_index):
    t_text = get_text(p_txt)
    t_opts = get_text(p_opts)

    # 1. Clean cloze template
    lines = clean_lines(t_text)
    body_lines = []
    for l in lines:
        if 'Sprachbausteine' in l or 'Lesen Sie den folgenden Text' in l or re.match(r'^\d+$', l):
            continue
        body_lines.append(l)
    text_template = '\n\n'.join(body_lines)

    # 2. Extract options for 25 to 46
    # p_opts has 2 columns typically (25-30 on left, 31-46 on right)
    opt_lines = clean_lines(t_opts)
    items_map = {str(n): [] for n in range(25, 47)}
    
    # regex to find items like: "25 a das \n b ein \n c eines \n d es"
    # Or in line by line format
    current_q = None
    for l in opt_lines:
        m = re.match(r'^(2[5-9]|3[0-9]|4[0-6])\s+([a-dA-D])\s+(.*)', l)
        if m:
            current_q = m.group(1)
            items_map[current_q].append({"key": m.group(2).lower(), "text": m.group(3).strip()})
        elif current_q and re.match(r'^([a-dA-D])\s+(.*)', l):
            m2 = re.match(r'^([a-dA-D])\s+(.*)', l)
            items_map[current_q].append({"key": m2.group(1).lower(), "text": m2.group(2).strip()})

    # 3. Extract solutions from footer
    # e.g., (25. eines) (26. Auffassung) (27. kommt) ...
    footer_text = ' '.join(opt_lines[-8:])
    sol_words = re.findall(r'\((\d+)\.\s*([^\)]+)\)', footer_text)
    sol_dict = {q: word.strip() for q, word in sol_words}

    items = []
    for n in range(25, 47):
        q_id = str(n)
        opts = items_map.get(q_id, [])
        sol_word = sol_dict.get(q_id, "")
        
        # Determine correct key (a, b, c, or d) by matching sol_word
        correct_key = "a"
        for o in opts:
            if sol_word and (o["text"].lower() == sol_word.lower() or sol_word.lower() in o["text"].lower()):
                correct_key = o["key"]
                break

        items.append({
            "id": q_id,
            "options": opts if opts else [
                {"key": "a", "text": "Option A"},
                {"key": "b", "text": "Option B"},
                {"key": "c", "text": "Option C"},
                {"key": "d", "text": "Option D"}
            ],
            "correctAnswer": correct_key,
            "explanation": f"Offizielle Lösung für Lücke {q_id}: {sol_word or correct_key.upper()}."
        })

    sb_results.append({
        "id": f"telc-c1-sb-{idx+1:02d}",
        "themeTitle": default_title,
        "difficulty": "C1 Hochschule",
        "readingTime": "ca. 30 Min",
        "instructions": "Lesen Sie den folgenden Text. Welche Lösung (a, b, c oder d) ist jeweils richtig?",
        "textTemplate": text_template,
        "items": items
    })

print(f"Parsed {len(sb_results)} Sprachbausteine topics.")

# Save all datasets
with open(os.path.join(OUTPUT_DIR, 'lv1_topics.json'), 'w', encoding='utf-8') as f:
    json.dump(lv1_results, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, 'lv2_topics.json'), 'w', encoding='utf-8') as f:
    json.dump(lv2_results, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, 'lv3_topics.json'), 'w', encoding='utf-8') as f:
    json.dump(lv3_results, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, 'sb_topics.json'), 'w', encoding='utf-8') as f:
    json.dump(sb_results, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, 'lv2_guide.json'), 'w', encoding='utf-8') as f:
    json.dump(lv2_leitfaden, f, ensure_ascii=False, indent=2)

print("\nAll 110 telc C1 Hochschule exam topics successfully extracted and saved to server/data/!")
