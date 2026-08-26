import fs from 'fs';
import path from 'path';

const NEWS_DIR = path.join('C:\\TechVeb', 'src', 'content', 'news');

const files = fs.readdirSync(NEWS_DIR).filter(f => f.endsWith('.mdx'));
let modifiedCount = 0;

function isFaqAnswerEmpty(entryLines) {
  const joined = entryLines.join('\n');
  // answer: "" or answer: '' or answer: " " (whitespace-only)
  const answerMatch = joined.match(/answer:\s*(?:"([^"]*)"|'([^']*)')/);
  if (!answerMatch) return false;
  const answerValue = answerMatch[1] ?? answerMatch[2] ?? '';
  return answerValue.trim().length === 0;
}

function isKeyTakeawayTruncated(entryLines) {
  const line = entryLines.join('');
  const match = line.match(/^\s*-\s*"(.*)"\s*$/);
  if (!match) return false;
  const value = match[1];

  const rawLine = line.trim();
  // Trailing space before closing quote → incomplete value
  if (/\s"$/.test(rawLine)) return true;

  // Very short entries (< 10 chars) are clearly truncated fragments
  if (value.length < 10) return true;

  const trimmedVal = value.trimEnd();
  const lastSpaceIdx = trimmedVal.lastIndexOf(' ');
  const lastWord = lastSpaceIdx >= 0 ? trimmedVal.slice(lastSpaceIdx + 1) : trimmedVal;

  // Short entries (10-20 chars): truncated unless ending with a clear word (4+ chars)
  if (value.length < 20) return lastWord.length < 4;

  // Longer entries: single trailing char → truncated mid-word
  if (lastWord.length === 1) return true;
  // Two trailing chars without punctuation → truncated
  if (lastWord.length === 2 && !/[.!?;:]$/.test(lastWord)) return true;

  return false;
}

for (const file of files) {
  const filePath = path.join(NEWS_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf8');
  const content = raw.replace(/\r\n/g, '\n');

  const lines = content.split('\n');
  let fmStart = -1, fmEnd = -1;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      if (fmStart === -1) {
        fmStart = i;
      } else {
        fmEnd = i;
        break;
      }
    }
  }

  if (fmStart === -1 || fmEnd === -1) continue;

  const fmLines = lines.slice(fmStart + 1, fmEnd);
  const body = lines.slice(fmEnd).join('\n');

  const result = [];
  let modified = false;

  let i = 0;
  while (i < fmLines.length) {
    const line = fmLines[i];
    const trimmed = line.trim();

    if (trimmed === 'faq:' || trimmed === 'keyTakeaways:') {
      const fieldName = trimmed.replace(':', '');
      const indent = line.length - line.trimStart().length;
      i++;

      const entries = [];
      while (i < fmLines.length) {
        const entryLine = fmLines[i];
        const entryTrimmed = entryLine.trim();

        if (entryTrimmed === '') {
          i++;
          continue;
        }

        const entryIndent = entryLine.length - entryLine.trimStart().length;

        if (entryIndent <= indent && !entryTrimmed.startsWith('-')) {
          break;
        }

        if (entryTrimmed.startsWith('- ')) {
          const entry = [entryLine];
          i++;

          while (i < fmLines.length) {
            const subLine = fmLines[i];
            const subTrimmed = subLine.trim();
            if (subTrimmed === '') { i++; continue; }
            const subIndent = subLine.length - subLine.trimStart().length;
            if (subIndent > entryIndent && !subTrimmed.startsWith('- ')) {
              entry.push(subLine);
              i++;
            } else {
              break;
            }
          }
          entries.push(entry);
        } else {
          i++;
        }
      }

      const filterFn = fieldName === 'faq' ? isFaqAnswerEmpty : isKeyTakeawayTruncated;
      const filtered = entries.filter(entry => !filterFn(entry));

      if (filtered.length !== entries.length) modified = true;

      if (filtered.length > 0) {
        result.push(fieldName + ':');
        for (const e of filtered) result.push(...e);
      }
    } else {
      result.push(line);
      i++;
    }
  }

  if (modified) {
    const newContent = '---\n' + result.join('\n') + '\n' + body;
    fs.writeFileSync(filePath, newContent, 'utf8');
    modifiedCount++;
  }
}

console.log(`Done. ${modifiedCount} files modified.`);
