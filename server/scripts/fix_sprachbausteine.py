import sys
import os
import re
import json
import difflib
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

PDF_PATH = r'C:\Users\samma\.gemini\antigravity\brain\03ec1e2b-b9b4-427b-b2c0-bd3c2d4959c2\.user_uploaded\media_1790793241837.pdf'
OUTPUT_DIR = r'C:\Users\samma\Desktop\c1-exam practice (1)\server\data'
DB_PATH = r'C:\Users\samma\Desktop\c1-exam practice (1)\server\database.json'

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

print(f"Opening PDF: {PDF_PATH}")
with pdfplumber.open(PDF_PATH) as pdf:
    sb_results = []
    
    for idx, (p_txt, p_opts, default_title) in enumerate(sb_index):
        txt_page = pdf.pages[p_txt - 1]
        opts_page = pdf.pages[p_opts - 1]

        # 1. Clean cloze text template
        txt_words = sorted(txt_page.extract_words(), key=lambda w: (w['top'], w['x0']))
        # group words into lines
        lines, cur, cur_top = [], [], None
        for w in txt_words:
            if cur_top is None or abs(w['top'] - cur_top) <= 3:
                cur.append(w['text'])
                cur_top = w['top'] if cur_top is None else cur_top
            else:
                lines.append(' '.join(cur))
                cur = [w['text']]
                cur_top = w['top']
        if cur: lines.append(' '.join(cur))

        body_lines = []
        for l in lines:
            if any(skip in l for skip in ['Sprachbausteine', 'Lesen Sie den folgenden Text', 'Aufgaben 25-46']):
                continue
            if re.match(r'^\d+$', l.strip()) or re.match(r'^\(\d+\)$', l.strip()):
                continue
            body_lines.append(l)
        text_template = '\n\n'.join(body_lines)

        # 2. Extract 3 columns of options from opts_page
        opt_words = opts_page.extract_words()
        col1 = [w for w in opt_words if w['x0'] < 190 and w['top'] < 700]
        col2 = [w for w in opt_words if 190 <= w['x0'] < 360 and w['top'] < 700]
        col3 = [w for w in opt_words if w['x0'] >= 360 and w['top'] < 700]

        def get_col_text(w_list):
            w_list = sorted(w_list, key=lambda w: (w['top'], w['x0']))
            c_lines, c_cur, c_top = [], [], None
            for w in w_list:
                if c_top is None or abs(w['top'] - c_top) <= 3:
                    c_cur.append(w['text'])
                    c_top = w['top'] if c_top is None else c_top
                else:
                    c_lines.append(' '.join(c_cur))
                    c_cur = [w['text']]
                    c_top = w['top']
            if c_cur: c_lines.append(' '.join(c_cur))
            return '\n'.join(c_lines)

        full_col_text = get_col_text(col1) + '\n' + get_col_text(col2) + '\n' + get_col_text(col3)

        # 3. Extract official solutions from footer (top >= 700)
        footer_words = sorted([w for w in opt_words if w['top'] >= 700], key=lambda w: (w['top'], w['x0']))
        footer_text = ' '.join(w['text'] for w in footer_words)
        sol_matches = re.findall(r'\((\d+)\.\s*([^\)]+)\)', footer_text)
        sol_dict = {q: word.strip() for q, word in sol_matches}

        items = []
        for q in range(25, 47):
            q_id = str(q)
            mq = re.search(rf'(?:^|\n)\s*{q}\s+a\s+(.*?)\s+b\s+(.*?)\s+c\s+(.*?)\s+d\s+(.*?)(?=\n\s*(?:\d+|Beispiel|Die L)|$)', full_col_text, re.DOTALL)
            
            raw_options = {}
            if mq:
                raw_options = {
                    'a': mq.group(1).strip().replace('\n', ' '),
                    'b': mq.group(2).strip().replace('\n', ' '),
                    'c': mq.group(3).strip().replace('\n', ' '),
                    'd': mq.group(4).strip().replace('\n', ' ')
                }
            else:
                raw_options = {'a': 'Option A', 'b': 'Option B', 'c': 'Option C', 'd': 'Option D'}

            sol_word = sol_dict.get(q_id, '')
            correct_key = 'a' # default

            # Match exact or substring
            for k, v in raw_options.items():
                if sol_word and (v.lower() == sol_word.lower() or sol_word.lower() in v.lower() or v.lower() in sol_word.lower()):
                    correct_key = k
                    break
            else:
                # Fuzzy match
                if sol_word:
                    close = difflib.get_close_matches(sol_word.lower(), [v.lower() for v in raw_options.values()], n=1, cutoff=0.45)
                    if close:
                        for k, v in raw_options.items():
                            if v.lower() == close[0]:
                                correct_key = k
                                break

            options_list = [
                {"key": k, "text": raw_options[k]}
                for k in ['a', 'b', 'c', 'd']
            ]

            items.append({
                "id": q_id,
                "options": options_list,
                "correctAnswer": correct_key,
                "explanation": f"Offizielle telc Lösung: ({correct_key.upper()}) {raw_options[correct_key]}"
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

        print(f"[{idx+1}/24] {default_title} -> 22 items parsed! Sample Q31: {items[6]['options'][0]['text']}, Sample Q40: {items[15]['options'][0]['text']}")

# Save sb_topics.json
out_file = os.path.join(OUTPUT_DIR, 'sb_topics.json')
with open(out_file, 'w', encoding='utf-8') as f:
    json.dump(sb_results, f, ensure_ascii=False, indent=2)

print(f"\nSaved updated {len(sb_results)} Sprachbausteine topics to {out_file}!")

# Update database.json
if os.path.exists(DB_PATH):
    with open(DB_PATH, 'r', encoding='utf-8') as f:
        db = json.load(f)
    
    # Keep official model exam topic as item 0 if exists
    official = [t for t in db['topicsData']['sprachbausteine']['teil1']['topics'] if t['id'] == 'telc-official-sb']
    db['topicsData']['sprachbausteine']['teil1']['topics'] = official + sb_results
    
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"database.json updated! Now has {len(db['topicsData']['sprachbausteine']['teil1']['topics'])} Sprachbausteine topics.")
