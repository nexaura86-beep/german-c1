import sys
import pdfplumber
import re

sys.stdout.reconfigure(encoding='utf-8')

lv3_pages = [149, 152, 155, 158, 162, 165, 168, 171, 174, 177, 180, 183, 186, 189, 192, 195, 198, 201, 204, 207, 210, 213, 216, 219, 222, 226]

PDF_PATH = r'C:\Users\samma\.gemini\antigravity\brain\03ec1e2b-b9b4-427b-b2c0-bd3c2d4959c2\.user_uploaded\media_1790793241837.pdf'

with pdfplumber.open(PDF_PATH) as pdf:
    for idx, p_num in enumerate(lv3_pages):
        page = pdf.pages[p_num - 1]
        lines = [l.strip() for l in page.extract_text().split('\n') if l.strip()]
        
        questions = {}
        cur_q = None
        for l in lines:
            if 'Welche der Überschriften' in l or 'Welche der berschriften' in l:
                break
            m = re.match(r'^(1[3-9]|2[0-3])\s+(.*)', l)
            if m:
                cur_q = m.group(1)
                text = m.group(2).strip()
                # Clean trailing slashes
                text = re.sub(r'\s*/\s*$', '', text).strip()
                questions[cur_q] = text
            elif cur_q and not l.startswith(('•', '', '*')) and not l.startswith('Welche'):
                if not re.match(r'^\d+$', l):
                    text = re.sub(r'\s*/\s*$', '', l).strip()
                    questions[cur_q] += ' ' + text
        
        # Also parse question 24 and its options a, b, c
        q24_opts = []
        found_q24 = False
        for l in lines:
            if '24' in l and ('a' in l or 'Überschrift' in l):
                found_q24 = True
            m24 = re.match(r'^(?:24\s+)?([abc])\s+(.*)', l)
            if found_q24 and m24:
                q24_opts.append({'key': m24.group(1), 'text': m24.group(2).strip()})

        # Check answers
        footer_text = ' '.join(lines[-8:])
        ans_m = re.findall(r'(1[3-9]|2[0-4])\s*[-–]?\s*([RFXABC])', footer_text, re.I)

        print(f"Topic {idx+1:02d} (Page {p_num}): {len(questions)} Qs (13-23), {len(q24_opts)} opts for Q24, {len(ans_m)} answers")
        # Check if any question has < 20 chars
        for q, text in questions.items():
            if len(text) < 20:
                print(f"  WARNING short text: Q{q}: {text}")

print("\nDone testing LV3.")
