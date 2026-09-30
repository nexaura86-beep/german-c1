import sys
import pdfplumber

sys.stdout.reconfigure(encoding='utf-8')

with pdfplumber.open(r'C:\Users\samma\.gemini\antigravity\brain\03ec1e2b-b9b4-427b-b2c0-bd3c2d4959c2\.user_uploaded\media_1790793241837.pdf') as pdf:
    p6 = pdf.pages[5]
    words = p6.extract_words()
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
    if cur_line: lines_with_top.append((cur_top, ' '.join(cur_line)))

    print(f"Total lines on page 6: {len(lines_with_top)}")
    paras = []
    current_para = []
    for i in range(len(lines_with_top)):
        current_para.append(lines_with_top[i][1])
        if i < len(lines_with_top) - 1:
            delta = lines_with_top[i+1][0] - lines_with_top[i][0]
            if delta > 18:
                paras.append(' '.join(current_para))
                current_para = []
    if current_para:
        paras.append(' '.join(current_para))

    print(f"Detected {len(paras)} true paragraphs on page 6:")
    for i, p in enumerate(paras):
        print(f"--- Para {i+1} ---")
        print(p[:120] + '...')
