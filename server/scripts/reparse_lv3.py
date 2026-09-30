import sys
import os
import re
import json
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\samma\.gemini\antigravity\brain\03ec1e2b-b9b4-427b-b2c0-bd3c2d4959c2\.user_uploaded\media_1790793241837.pdf'
OUTPUT_FILE = r'C:\Users\samma\Desktop\c1-exam practice (1)\server\data\lv3_topics.json'

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

def extract_paragraphs_from_page(page, y_cutoff=None):
    words = page.extract_words()
    lines_with_top = []
    cur_line, cur_top = [], None
    for w in sorted(words, key=lambda w: (w['top'], w['x0'])):
        if y_cutoff and w['top'] >= y_cutoff:
            continue
        if cur_top is None or abs(w['top'] - cur_top) <= 3:
            cur_line.append(w['text'])
            cur_top = w['top'] if cur_top is None else cur_top
        else:
            lines_with_top.append((cur_top, ' '.join(cur_line)))
            cur_line = [w['text']]
            cur_top = w['top']
    if cur_line:
        lines_with_top.append((cur_top, ' '.join(cur_line)))

    paras = []
    cur_para = []
    for i in range(len(lines_with_top)):
        line_text = lines_with_top[i][1].strip()
        # skip header or page number lines
        if re.match(r'^\d+$', line_text) or 'Leseverstehen' in line_text:
            continue
        cur_para.append(line_text)
        if i < len(lines_with_top) - 1:
            delta = lines_with_top[i+1][0] - lines_with_top[i][0]
            if delta > 16:
                if cur_para:
                    paras.append(' '.join(cur_para))
                    cur_para = []
    if cur_para:
        paras.append(' '.join(cur_para))
    return paras

print(f"Opening PDF: {PDF_PATH}")
with pdfplumber.open(PDF_PATH) as pdf:
    results = []

    for idx, (p_start, p_end, default_title) in enumerate(lv3_index):
        # 1. Reading text from p_start through p_end - 1
        all_paras = []
        for p_num in range(p_start, p_end):
            p = pdf.pages[p_num - 1]
            paras = extract_paragraphs_from_page(p)
            all_paras.extend(paras)

        # 2. Check if p_end has top reading text before "Welche der Aussagen"
        q_page = pdf.pages[p_end - 1]
        q_page_text = q_page.extract_text() or ""
        
        # Find position of "Welche der Aussagen"
        welche_match = None
        for w in q_page.extract_words():
            if 'Welche' in w['text']:
                welche_match = w['top']
                break
        
        if welche_match and welche_match > 100:
            # There is reading text above the questions on p_end
            top_paras = extract_paragraphs_from_page(q_page, y_cutoff=welche_match - 5)
            all_paras.extend(top_paras)

        reading_text = '\n\n'.join(all_paras)

        # 3. Parse questions 13 to 23 and 24 from q_page
        q_lines = [l.strip() for l in q_page_text.split('\n') if l.strip()]
        
        # Find where questions start
        start_q_idx = 0
        for i, l in enumerate(q_lines):
            if 'Welche der Aussagen' in l or re.match(r'^13\s+', l):
                start_q_idx = i
                break

        # Questions 13 to 23
        questions_dict = {}
        cur_q = None
        q24_zone = False
        q24_opts = []

        for l in q_lines[start_q_idx:]:
            if 'Welche der Überschriften' in l or 'Welche der berschriften' in l or 'Überschriften a, b oder c' in l:
                q24_zone = True
                continue

            if not q24_zone:
                m = re.match(r'^(1[3-9]|2[0-3])\s+(.*)', l)
                if m:
                    cur_q = m.group(1)
                    q_text = m.group(2).strip()
                    # Clean trailing slashes
                    q_text = re.sub(r'\s*/\s*$', '', q_text).strip()
                    questions_dict[cur_q] = q_text
                elif cur_q and not l.startswith(('•', '', '*', 'Welche')):
                    if not re.match(r'^\d+$', l):
                        clean_l = re.sub(r'\s*/\s*$', '', l).strip()
                        # Avoid appending answer line
                        if not re.search(r'13\s*[-–]?\s*[RFXABC+-]', clean_l):
                            questions_dict[cur_q] += ' ' + clean_l
            else:
                # In Q24 zone
                m24 = re.match(r'^(?:24\s+)?([abc])\s+(.*)', l, re.I)
                if m24:
                    q24_opts.append({
                        "key": m24.group(1).lower(),
                        "text": m24.group(2).strip()
                    })

        # 4. Answers extraction
        footer_text = ' '.join(q_lines[-8:])
        ans_matches = re.findall(r'(1[3-9]|2[0-4])\s*[-–]?\s*([RFXABC+-])', footer_text, re.I)
        correct_answers = {}
        for q_id, val in ans_matches:
            val_upper = val.upper()
            if val_upper in ['R', '+']:
                correct_answers[q_id] = 'a'
            elif val_upper in ['F', '-']:
                correct_answers[q_id] = 'b'
            elif val_upper in ['X']:
                correct_answers[q_id] = 'c'
            elif val_upper in ['A', 'B', 'C']:
                correct_answers[q_id] = val.lower()

        # Build questions array
        questions_list = []
        for q_num in range(13, 24):
            q_id = str(q_num)
            q_txt = questions_dict.get(q_id, f"Aussage {q_id}")
            # Clean up double spaces or trailing dashes
            q_txt = re.sub(r'\s+', ' ', q_txt).strip()
            ans = correct_answers.get(q_id, 'a')
            ans_label = "richtig" if ans == 'a' else "falsch" if ans == 'b' else "nicht im Text"
            questions_list.append({
                "id": q_id,
                "question": q_txt,
                "options": [
                    {"key": "a", "text": "richtig"},
                    {"key": "b", "text": "falsch"},
                    {"key": "c", "text": "nicht im Text"}
                ],
                "correctAnswer": ans,
                "explanation": f"Offizielle telc Bewertung: {ans_label} ({ans.upper()})."
            })

        # Add Q24
        # If Q24 opts has duplicates or more than 3, keep first occurrence of a, b, c
        unique_opts = []
        seen_keys = set()
        for opt in q24_opts:
            if opt['key'] in ['a', 'b', 'c'] and opt['key'] not in seen_keys:
                unique_opts.append(opt)
                seen_keys.add(opt['key'])

        ans_24 = correct_answers.get('24', 'c')
        questions_list.append({
            "id": "24",
            "question": "Welche der Überschriften a, b oder c passt am besten zum Text?",
            "options": unique_opts if len(unique_opts) == 3 else [
                {"key": "a", "text": "Überschrift A"},
                {"key": "b", "text": "Überschrift B"},
                {"key": "c", "text": "Überschrift C"}
            ],
            "correctAnswer": ans_24,
            "explanation": f"Offizielle telc Bewertung: Option ({ans_24.upper()})."
        })

        results.append({
            "id": f"telc-c1-lv3-{idx+1:02d}",
            "themeTitle": default_title,
            "difficulty": "C1 Hochschule",
            "readingTime": "ca. 20 Min",
            "instructions": "Lesen Sie den folgenden Text. Welche der Aussagen 13–23 sind richtig (+), falsch (–) oder nicht im Text enthalten (x)? Welche der Überschriften a, b oder c passt am besten zum Text (Aufgabe 24)?",
            "text": reading_text,
            "questions": questions_list,
            "correctAnswers": correct_answers
        })

        print(f"[{idx+1:02d}] {default_title[:35]:35} | Text chars: {len(reading_text):5d} | Paras: {len(all_paras):2d} | Qs: {len(questions_list)} | Q24 opts: {len(unique_opts)} | Answers: {len(correct_answers)}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSuccessfully wrote {len(results)} LV3 topics to {OUTPUT_FILE}")
