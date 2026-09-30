import sys
import os
import re
import json
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\samma\.gemini\antigravity\brain\03ec1e2b-b9b4-427b-b2c0-bd3c2d4959c2\.user_uploaded\media_1790793241837.pdf'
OUTPUT_FILE = r'C:\Users\samma\Desktop\c1-exam practice (1)\server\data\lv1_topics.json'

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

def extract_paras_from_page(page):
    words = page.extract_words()
    lines_with_top = []
    cur_line, cur_top = [], None
    for w in sorted(words, key=lambda w: (w['top'], w['x0'])):
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

print(f"Opening PDF for LV1: {PDF_PATH}")
with pdfplumber.open(PDF_PATH) as pdf:
    results = []

    for idx, (p_text, p_opts, default_title) in enumerate(lv1_index):
        # 1. Options page
        p_opt = pdf.pages[p_opts - 1]
        raw_opt_text = p_opt.extract_text() or ""
        opt_lines = [l.strip() for l in raw_opt_text.split('\n') if l.strip()]

        options_dict = {}
        beispiel_text = ""
        cur_k, cur_v = None, []

        for l in opt_lines:
            m = re.match(r'^([a-hA-HzZ])\s+(.*)', l)
            if m:
                k = m.group(1).lower()
                if cur_k:
                    if cur_k == 'z':
                        beispiel_text = ' '.join(cur_v).strip()
                    elif cur_k in 'abcdefgh':
                        options_dict[cur_k] = ' '.join(cur_v).strip()
                cur_k = k
                cur_v = [m.group(2).strip()]
            elif cur_k:
                if re.search(r'^[1-6][a-hA-H]', l) or re.match(r'^\d+$', l):
                    break
                cur_v.append(l)

        if cur_k:
            if cur_k == 'z':
                beispiel_text = ' '.join(cur_v).strip()
            elif cur_k in 'abcdefgh':
                options_dict[cur_k] = ' '.join(cur_v).strip()

        # Handle topic 23 missing option h
        if 'h' not in options_dict or not options_dict['h']:
            options_dict['h'] = "Im Laufe der Jahrhunderte geriet diese traditionelle Fertigungskunst jedoch zunehmend in Vergessenheit."

        # Convert to sorted array of options a-h
        options_list = []
        for key in ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']:
            options_list.append({
                "key": key,
                "text": options_dict.get(key, "")
            })

        # Answer key
        footer_text = ' '.join(opt_lines[-5:])
        ans_matches = re.findall(r'([1-6])\s*[-–]?\s*([a-hA-H])', raw_opt_text)
        correct_answers = {}
        for q_id, val in ans_matches:
            if q_id not in correct_answers:
                correct_answers[q_id] = val.lower()

        # 2. Text page
        p_txt = pdf.pages[p_text - 1]
        raw_paras = extract_paras_from_page(p_txt)
        # Filter out instructions
        clean_paras = [p for p in raw_paras if not p.startswith('Lesen Sie den folgenden Text')]

        if clean_paras:
            title = clean_paras[0]
            body_paras = clean_paras[1:]
        else:
            title = default_title
            body_paras = []

        # Standardize blanks in body paragraphs
        processed_paras = []
        for p in body_paras:
            # Replace blank 0
            p_sub = re.sub(r'_+\s*0\s*_+', '[BEISPIEL_0]', p)
            # Replace blanks 1 to 6
            p_sub = re.sub(r'_+\s*([1-6])\s*_+', r'[LÜCKE_\1]', p_sub)
            processed_paras.append(p_sub)

        full_body_text = '\n\n'.join(processed_paras)

        explanations = {}
        for q, ans in correct_answers.items():
            explanations[q] = f"Passender Satz: {ans.upper()}"

        results.append({
            "id": f"telc-c1-lv1-{idx+1:02d}",
            "themeTitle": title,
            "difficulty": "C1 Hochschule",
            "readingTime": "ca. 20 Min",
            "instructions": "Lesen Sie den folgenden Text. Welche der Sätze a–h gehören in die Lücken 1–6? Es gibt jeweils nur eine richtige Lösung. Zwei Sätze können nicht zugeordnet werden.",
            "text": full_body_text,
            "example": {
                "key": "z",
                "text": beispiel_text
            },
            "exampleText": beispiel_text,
            "options": options_list,
            "correctAnswers": correct_answers,
            "explanations": explanations
        })

        print(f"[{idx+1:02d}] {title[:35]:35} | Paras: {len(processed_paras)} | Text len: {len(full_body_text):4d} | Opts: {len(options_list)} | Ans: {len(correct_answers)}")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\nSuccessfully wrote {len(results)} LV1 topics to {OUTPUT_FILE}")
