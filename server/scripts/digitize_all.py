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

def get_page_text(p_num): # 1-indexed
    if 1 <= p_num <= num_pages:
        return reader.pages[p_num - 1].extract_text()
    return ""

# ==============================================================================
# 1. DIGITIZE LESEN TEIL 1 (Pages 6 to 61)
# ==============================================================================
print("\n--- Digitize Lesen Teil 1 ---")
lv1_topics = []

# Table of contents for LV1 from page 2:
# 1: 6, 2: 9, 3: 11, 4: 14, 5: 16, 6: 18, 7: 20, 8: 22, 9: 24, 10: 26,
# 11: 28, 12: 30, 13: 32, 14: 34, 15: 36, 16: 38, 17: 40, 18: 42, 19: 44,
# 20: 46, 21: 48, 22: 50, 23: 52, 24: 54, 25: 56, 26: 58, 27: 60

lv1_pages = [
    (6, 7, "Eine Box verändert die Welt"),
    (9, 10, "Satzzeichen, mächtige Werkzeuge"),
    (11, 12, "Die Hamburger-Hypothese"),
    (14, 15, "Werbung in der sozialen Marktwirtschaft"),
    (16, 17, "Die Brüder Grimm / Der alte Mann und die Wörter"),
    (18, 19, "Alternative Heilmethode"),
    (20, 21, "Die Maus als Stimmungsbarometer"),
    (22, 23, "Was Werbung so treibt"),
    (24, 25, "Auf Goldsuche in Deutschland"),
    (26, 27, "Piraten früher und heute / Seeräuber"),
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

for idx, (p_text, p_opts, default_title) in enumerate(lv1_pages):
    t_text = get_page_text(p_text)
    t_opts = get_page_text(p_opts)
    
    # Extract title from text page
    lines = [l.strip() for l in t_text.split('\n') if l.strip()]
    # skip headers like "6", "Leseverstehen, Teil 1", "Lesen Sie...", "Lücke (0)..."
    body_lines = []
    title = default_title
    found_header = False
    
    for line in lines:
        if re.search(r'Leseverstehen,\s*Teil\s*1', line, re.I):
            found_header = True
            continue
        if 'Lesen Sie den folgenden Text' in line or 'Zwei Sätze können' in line or 'Lücke (0) ist' in line:
            continue
        if re.match(r'^\d+$', line): # page number
            continue
        if not body_lines and len(line) > 3 and not line.startswith('___'):
            # Potentially title
            title = line
        body_lines.append(line)
        
    full_text = '\n\n'.join(body_lines)
    # If the text has title at top, ensure clean formatting
    if body_lines and body_lines[0] == title:
        full_text = '\n\n'.join(body_lines[1:])
        
    # Extract options a-h and example z
    options = []
    opt_lines = t_opts.split('\n')
    current_key = None
    current_val = []
    
    for l in opt_lines:
        m = re.match(r'^([a-hA-HzZ])\s+(.*)', l.strip())
        if m:
            if current_key and current_key.lower() in 'abcdefgh':
                options.append({'key': current_key.lower(), 'text': ' '.join(current_val).strip()})
            current_key = m.group(1).lower()
            current_val = [m.group(2).strip()]
        elif current_key:
            # check if solution line
            if re.search(r'[1-6][a-hA-H]', l):
                break
            current_val.append(l.strip())
            
    if current_key and current_key in 'abcdefgh':
        options.append({'key': current_key, 'text': ' '.join(current_val).strip()})
        
    # Extract answers from bottom of p_opts
    # e.g., "1e-2c-3a-4b-5f-6h" or "1h- 2a- 3f- 4b- 5g- 6d"
    ans_matches = re.findall(r'([1-6])\s*[-–]?\s*([a-hA-H])', t_opts)
    correct_answers = {}
    for q_num, ans_letter in ans_matches:
        if q_num not in correct_answers:
            correct_answers[q_num] = ans_letter.lower()
            
    lv1_topic = {
        "id": f"telc-c1-lv1-{idx+1:02d}",
        "themeTitle": title,
        "difficulty": "C1 Hochschule",
        "readingTime": "ca. 20 Min",
        "instructions": "Lesen Sie den folgenden Text. Welche der Sätze a–h gehören in die Lücken 1–6? Es gibt jeweils nur eine richtige Lösung. Zwei Sätze können nicht zugeordnet werden.",
        "text": full_text,
        "options": options,
        "correctAnswers": correct_answers,
        "explanations": {
            q: f"Offizielle telc C1 Lösung für Lücke {q}: Satz {ans.upper()}."
            for q, ans in correct_answers.items()
        }
    }
    lv1_topics.append(lv1_topic)
    print(f"Teil 1 [{idx+1}/27]: '{title}' -> Answers: {correct_answers}, Options: {len(options)}")

with open(os.path.join(OUTPUT_DIR, 'lv1_topics.json'), 'w', encoding='utf-8') as f:
    json.dump(lv1_topics, f, ensure_ascii=False, indent=2)

print(f"Successfully digitized {len(lv1_topics)} themes for Lesen Teil 1!")
