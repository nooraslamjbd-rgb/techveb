const https = require('https');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://en.wikipedia.org/w/api.php';
const OUT_PATH = 'C:\\TechVeb\\scripts\\.wikimedia-images.json';

const topics = [
    { Query: 'computer security cybersecurity firewall encryption malware', Topic: 'cybersecurity', Limit: 50 },
    { Query: 'cloud computing server datacenter virtualization', Topic: 'cloud', Limit: 50 },
    { Query: 'artificial intelligence machine learning neural network', Topic: 'AI', Limit: 50 },
    { Query: 'video games gaming console esports controller', Topic: 'gaming', Limit: 50 },
    { Query: 'computer programming code developer software IDE', Topic: 'programming', Limit: 50 },
    { Query: 'computer hardware processor motherboard RAM chip', Topic: 'hardware', Limit: 50 },
    { Query: 'quantum computing qubit quantum processor', Topic: 'quantum', Limit: 30 },
    { Query: 'robotics robot autonomous drone', Topic: 'robotics', Limit: 30 },
    { Query: 'internet of things IoT smart sensor', Topic: 'IoT', Limit: 30 },
    { Query: 'blockchain cryptocurrency bitcoin ledger', Topic: 'blockchain', Limit: 30 },
    { Query: 'privacy data protection surveillance encryption', Topic: 'privacy', Limit: 30 },
    { Query: 'smartphone mobile phone touchscreen Android iPhone', Topic: 'smartphones', Limit: 30 },
    { Query: 'data center server room networking rack', Topic: 'data_centers', Limit: 30 },
    { Query: 'continuous integration devops deployment pipeline', Topic: 'DevOps', Limit: 20 },
    { Query: 'laptop computer notebook portable', Topic: 'laptops', Limit: 30 },
    { Query: 'GPU graphics processing unit NVIDIA AMD', Topic: 'GPUs', Limit: 20 },
    { Query: 'solid state drive SSD storage flash', Topic: 'SSD', Limit: 15 },
    { Query: 'virtual reality VR headset immersive', Topic: 'VR', Limit: 20 },
    { Query: '5G network wireless mobile broadband', Topic: '5G', Limit: 15 },
    { Query: 'deep learning neural network AI training', Topic: 'deep_learning', Limit: 20 },
];

function fetchWithRetry(url, retries = 5, baseDelay = 3000) {
    return new Promise((resolve, reject) => {
        const attempt = (n, delay) => {
            https.get(url, {
                headers: { 'User-Agent': 'TechVebImageCollector/1.0 (https://github.com/techveb; techveb@example.com)' },
                timeout: 15000
            }, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    if (res.statusCode === 429 || res.statusCode === 503) {
                        const wait = Math.min(delay * 2, 30000);
                        console.log(`    HTTP ${res.statusCode} - waiting ${wait}ms (attempt ${retries - n + 1}/${retries + 1})`);
                        if (n > 0) setTimeout(() => attempt(n - 1, wait), wait);
                        else reject(new Error(`HTTP ${res.statusCode} after retries`));
                        return;
                    }
                    if (res.statusCode !== 200) {
                        if (n > 0) setTimeout(() => attempt(n - 1, delay), delay);
                        else reject(new Error(`HTTP ${res.statusCode}`));
                        return;
                    }
                    try { resolve(JSON.parse(data)); }
                    catch (e) {
                        if (n > 0) setTimeout(() => attempt(n - 1, delay), delay);
                        else reject(new Error(`JSON: ${data.substring(0, 80)}`));
                    }
                });
            }).on('error', (e) => {
                if (n > 0) setTimeout(() => attempt(n - 1, delay), delay);
                else reject(e);
            }).on('timeout', function() { this.destroy(); if (n > 0) setTimeout(() => attempt(n - 1, delay), delay); else reject(new Error('timeout')); });
        };
        attempt(retries, baseDelay);
    });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function stripHtml(text) {
    if (!text) return '';
    return text.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
               .replace(/&#\d+;/g, '').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

async function searchFiles(query, limit = 50) {
    const titles = new Set();
    const words = query.split(' ');
    const queries = [query, words.slice(0, 2).join(' '), words.slice(-2).join(' '), ...words.filter(w => w.length >= 3)];

    for (let qi = 0; qi < queries.length; qi++) {
        const q = queries[qi];
        try {
            const url = `${BASE_URL}?action=query&list=search&srsearch=${encodeURIComponent(q)}&srnamespace=6&srlimit=${limit}&format=json`;
            const resp = await fetchWithRetry(url, 3, 3000);
            if (resp && resp.query && resp.query.search) {
                for (const item of resp.query.search) {
                    if (/\.(png|jpg|jpeg)$/i.test(item.title)) {
                        titles.add(item.title);
                    }
                }
            }
            console.log(`    Search "${q}": +${resp?.query?.search?.length || 0} results, ${titles.size} unique image files so far`);
        } catch (e) { console.error(`    Search error for "${q}": ${e.message}`); }
        await sleep(1500);
    }
    return [...titles];
}

async function getImageInfo(titles) {
    const results = [];
    for (let i = 0; i < titles.length; i += 50) {
        const batch = titles.slice(i, i + 50);
        const joined = batch.map(t => encodeURIComponent(t)).join('|');
        try {
            const url = `${BASE_URL}?action=query&prop=imageinfo&titles=${joined}&iiprop=url|mime|extmetadata&iiurlwidth=1200&format=json`;
            const resp = await fetchWithRetry(url, 3, 3000);
            if (resp && resp.query && resp.query.pages) {
                for (const page of Object.values(resp.query.pages)) {
                    if (page.imageinfo && page.imageinfo.length > 0) {
                        results.push({ title: page.title, ...page.imageinfo[0] });
                    }
                }
            }
        } catch (e) { console.error(`    ImageInfo batch error: ${e.message}`); }
        await sleep(1500);
    }
    return results;
}

function saveProgress(allImages) {
    const output = { images: allImages };
    fs.writeFileSync(OUT_PATH, JSON.stringify(output, null, 2), 'utf8');
}

async function main() {
    let existingData = { images: [] };
    try {
        if (fs.existsSync(OUT_PATH)) {
            existingData = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8'));
        }
    } catch(e) {}

    const allImages = [...existingData.images];
    const seenUrls = new Set(allImages.map(i => i.url));
    const existingCounts = {};
    allImages.forEach(i => { existingCounts[i.topic] = (existingCounts[i.topic] || 0) + 1; });

    console.log(`Loaded ${allImages.length} existing images`);
    console.log('Existing counts:', existingCounts);

    for (const topicDef of topics) {
        const existingCount = existingCounts[topicDef.Topic] || 0;
        if (existingCount >= topicDef.Limit) {
            console.log(`\n=== ${topicDef.Topic} === (already have ${existingCount}, skipping)`);
            continue;
        }

        console.log(`\n=== ${topicDef.Topic} === (need ${topicDef.Limit - existingCount} more)`);
        const targetCount = topicDef.Limit;

        const titles = await searchFiles(topicDef.Query);
        console.log(`  Candidates: ${titles.length} files`);

        if (titles.length === 0) {
            console.log('  No candidates found, skipping');
            await sleep(2000);
            continue;
        }

        const imageInfos = await getImageInfo(titles);
        let count = 0;

        for (const img of imageInfos) {
            if (existingCount + count >= targetCount) break;
            if (!img.mime || !img.mime.startsWith('image/')) continue;
            if (/svg|gif/i.test(img.mime)) continue;
            if (!img.thumburl) continue;
            if (!img.thumburl.startsWith('https://upload.wikimedia.org/')) continue;
            if (seenUrls.has(img.thumburl)) continue;

            seenUrls.add(img.thumburl);

            let artist = '', credit = '', license = '';
            if (img.extmetadata) {
                if (img.extmetadata.Artist) artist = stripHtml(img.extmetadata.Artist.value);
                if (img.extmetadata.Credit) credit = stripHtml(img.extmetadata.Credit.value);
                if (img.extmetadata.LicenseShortName) license = img.extmetadata.LicenseShortName.value;
            }
            let creditText = artist || credit || 'Wikimedia Commons contributor';
            creditText = license ? `${creditText}, ${license}` : `${creditText}, via Wikimedia Commons`;

            const wikiUrl = 'https://commons.wikimedia.org/wiki/' + encodeURIComponent(img.title);

            allImages.push({
                url: img.thumburl,
                credit: creditText,
                creditUrl: wikiUrl,
                topic: topicDef.Topic,
            });
            count++;
        }
        console.log(`  Added: ${count} (total: ${allImages.length})`);
        
        saveProgress(allImages);
        await sleep(2000);
    }

    saveProgress(allImages);
    console.log(`\nFinal Total: ${allImages.length} unique images`);
    console.log(`Written to ${OUT_PATH}`);

    console.log('\n=== Summary ===');
    const grouped = {};
    for (const img of allImages) {
        grouped[img.topic] = (grouped[img.topic] || 0) + 1;
    }
    for (const [topic, count] of Object.entries(grouped)) {
        console.log(`${topic}: ${count}`);
    }
}

main().catch(e => { console.error(e); process.exit(1); });
