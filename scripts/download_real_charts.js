const fs = require('fs');
const path = require('path');

const cacheDir = path.join(process.cwd(), 'data-cache', 'charts');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

// Find all unique coins used across all baskets
const snapshot = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src/data/xstocks-snapshot.json'), 'utf8'));
const tickerToId = {};
snapshot.forEach((c) => {
  tickerToId[c.symbol.toUpperCase()] = c.id;
});

const basketsCode = fs.readFileSync(path.join(process.cwd(), 'src/data/baskets.ts'), 'utf8');
const matches = [...basketsCode.matchAll(/makeConstituent\('([^']+)'/g)];
const usedTickers = Array.from(new Set(matches.map((m) => m[1].toUpperCase())));

const coinsToFetch = [];
for (const ticker of usedTickers) {
  const coinId = tickerToId[ticker] || `${ticker.toLowerCase()}-xstock`;
  const filePath = path.join(cacheDir, `${coinId}.json`);
  let needsFetch = true;
  if (fs.existsSync(filePath)) {
    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (content.prices && content.prices.length > 50 && !content.isSyntheticFallback) {
        needsFetch = false;
      }
    } catch {}
  }
  if (needsFetch) {
    coinsToFetch.push({ ticker, coinId, filePath });
  }
}

console.log(`Total coins needing real historical data: ${coinsToFetch.length} of ${usedTickers.length}`);

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function start() {
  let done = 0;
  for (let i = 0; i < coinsToFetch.length; i++) {
    const { ticker, coinId, filePath } = coinsToFetch[i];
    const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=365`;
    let success = false;
    let attempts = 0;

    while (!success && attempts < 4) {
      attempts++;
      try {
        console.log(`[${i + 1}/${coinsToFetch.length}] Fetching ${coinId} (${ticker})...`);
        const res = await fetch(url, {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Mozilla/5.0 Stocklana/1.0',
          },
        });

        if (res.status === 429) {
          console.warn(`[Rate Limited (429)] Backing off 30s for ${coinId}...`);
          await sleep(30000);
          continue;
        }

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.prices) && data.prices.length > 0) {
            fs.writeFileSync(
              filePath,
              JSON.stringify(
                {
                  coinId,
                  updatedAt: Date.now(),
                  prices: data.prices,
                },
                null,
                2
              )
            );
            console.log(`-> Saved REAL historical data for ${coinId} (${data.prices.length} points)`);
            success = true;
            done++;
          } else {
            console.warn(`-> Empty prices array for ${coinId}`);
            success = true;
          }
        } else {
          console.warn(`-> HTTP ${res.status} for ${coinId}`);
          await sleep(4000);
        }
      } catch (err) {
        console.error(`-> Error for ${coinId}:`, err.message);
        await sleep(4000);
      }
    }

    // Rate-limit safety: 3.5 seconds between requests
    await sleep(3500);
  }

  console.log(`\nCOMPLETED! Successfully downloaded real data for ${done}/${coinsToFetch.length} stocks.`);
}

start();
