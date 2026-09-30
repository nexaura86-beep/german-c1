import json

with open('server/data/lv3_topics.json', 'r', encoding='utf-8') as f:
    topics = json.load(f)

for idx, t in enumerate(topics):
    title = t.get('themeTitle', '')
    text = t.get('text', '')
    qs = t.get('questions', [])
    print(f"[{idx+1:02d}] {title[:35]:35} | Text len: {len(text):4d} | Qs: {len(qs)}")
    # Check if text ends properly or where it ends
    text_lines = [l.strip() for l in text.split('\n\n') if l.strip()]
    if text_lines:
        print(f"   Starts: {text_lines[0][:60]}...")
        print(f"   Ends:   {text_lines[-1][:60]}...")
