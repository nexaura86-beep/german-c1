import json

with open('server/data/lv1_topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

for idx, t in enumerate(topics):
    title = t.get('themeTitle', '')
    text = t.get('text', '')
    opts = t.get('options', [])
    ans = t.get('correctAnswers', {})
    
    # Check if text has all blanks 1-6
    gaps_found = []
    for g in range(1, 7):
        if f'___{g}___' in text or f'[{g}]' in text or f'[LÜCKE_{g}]' in text or f'__{g}__' in text:
            gaps_found.append(g)
            
    print(f"[{idx+1:02d}] {title[:40]:40} | Text len: {len(text):4d} | Gaps: {gaps_found} | Options: {len(opts)} | Ans: {len(ans)}")
    if len(gaps_found) < 6:
        print(f"   WARNING: Only {len(gaps_found)} gaps found in text!")
