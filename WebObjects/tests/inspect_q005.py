import re

txt = open('WebObjects/prototypes/motion/q005_motion.html', encoding='utf-8').read()
# Let's inspect all occurrences of graph-container
for m in re.finditer(r'graph-container', txt):
    start = max(0, m.start() - 60)
    end = min(len(txt), m.end() + 100)
    print(txt[start:end].replace('\n', ' '))
