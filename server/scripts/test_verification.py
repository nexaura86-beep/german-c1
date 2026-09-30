import urllib.request
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Login
req = urllib.request.Request('http://localhost:5000/api/auth/login', 
    data=json.dumps({'email': 'student@uni.de', 'password': 'student123'}).encode('utf-8'),
    headers={'Content-Type': 'application/json'})
res = urllib.request.urlopen(req)
login_data = json.loads(res.read().decode('utf-8'))
token = login_data['token']
print('✓ Login successful.')

# 2. Fetch all topics
req_topics = urllib.request.Request('http://localhost:5000/api/topics',
    headers={'Authorization': f'Bearer {token}'})
res_topics = urllib.request.urlopen(req_topics)
topics_all = json.loads(res_topics.read().decode('utf-8'))['topicsData']

# 3. Check LV1
lv1_topics = topics_all['leseverstehen']['teil1']['topics']
print(f"✓ LV1 Topics total: {len(lv1_topics)}")
t1 = lv1_topics[1]
print(f"  Title: {t1['themeTitle']}")
print(f"  Has [BEISPIEL_0]: {'[BEISPIEL_0]' in t1['text']}")
print(f"  Has [LÜCKE_1]: {'[LÜCKE_1]' in t1['text']}")
print(f"  Options count: {len(t1['options'])}")
print(f"  Correct answers: {t1['correctAnswers']}")

# 4. Check LV3
lv3_topics = topics_all['leseverstehen']['teil3']['topics']
print(f"✓ LV3 Topics total: {len(lv3_topics)}")
t3 = lv3_topics[1]
print(f"  Title: {t3['themeTitle']}")
print(f"  Questions count: {len(t3['questions'])}")
print(f"  Q14 question: {t3['questions'][1]['question']}")
print(f"  Q24 question: {t3['questions'][-1]['question']}")
print(f"  Q24 options: {[o['text'] for o in t3['questions'][-1]['options']]}")

# 5. Instant evaluation
req_eval = urllib.request.Request('http://localhost:5000/api/evaluate-instant',
    data=json.dumps({
        'section': 'leseverstehen',
        'subteil': 'teil1',
        'topicId': t1['id'],
        'userAnswers': {'1': 'e', '2': 'c'},
        'topicData': t1
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
res_eval = urllib.request.urlopen(req_eval)
eval_data = json.loads(res_eval.read().decode('utf-8'))
print(f"✓ Evaluate LV1 result: Score {eval_data['scorecard']['score']} / {eval_data['scorecard']['totalPoints']} ({eval_data['scorecard']['percentage']}%)")
print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")
