// Lightweight, dependency-free fuzzy matching for the database search box.
// Tolerates missing characters (subsequence) and small typos (Levenshtein),
// so a slightly-wrong query still surfaces results.

function levenshtein(a, b) {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  let prev = Array.from({ length: n + 1 }, (_, j) => j)
  let curr = new Array(n + 1)
  for (let i = 1; i <= m; i++) {
    curr[0] = i
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost)
    }
    const tmp = prev
    prev = curr
    curr = tmp
  }
  return prev[n]
}

// Is `token` a subsequence of `word` (chars in order, gaps allowed)?
function isSubsequence(token, word) {
  let i = 0
  for (let j = 0; j < word.length && i < token.length; j++) {
    if (word[j] === token[i]) i++
  }
  return i === token.length
}

// Best score of a single needle token against one haystack word.
// Higher is better; 0 means no match.
function scoreToken(token, word) {
  if (word === token) return 100
  const idx = word.indexOf(token)
  if (idx !== -1) return 60 - Math.min(idx, 40) // earlier substring = better
  const dist = levenshtein(token, word)
  const maxDist = token.length <= 4 ? 1 : 2 // tighter tolerance for short words
  if (dist <= maxDist) return 40 - dist * 10
  if (token.length >= 3 && isSubsequence(token, word)) return 20
  return 0
}

// Score a whole query against a haystack string (which may hold several words).
// Every query token must match some word; the total score is their sum.
// Returns 0 when the query does not match, a positive number otherwise.
export function fuzzyScore(query, haystack) {
  const q = query.trim().toLowerCase()
  if (!q) return 1
  const hay = haystack.toLowerCase()
  if (hay.includes(q)) return 1000 - hay.indexOf(q) // exact substring wins big

  const words = hay.split(/\s+/).filter(Boolean)
  let total = 0
  for (const token of q.split(/\s+/).filter(Boolean)) {
    let best = 0
    for (const word of words) {
      best = Math.max(best, scoreToken(token, word))
      if (best === 100) break
    }
    if (best === 0) return 0 // a token matched nothing -> reject
    total += best
  }
  return total
}
