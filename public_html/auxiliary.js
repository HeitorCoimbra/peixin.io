function vectorSum(v1, v2) {
  return [v1[0] + v2[0], v1[1] + v2[1]]
}

function vectorDiff(v1, v2) {
  return [v1[0] - v2[0], v1[1] - v2[1]]
}

function vectorScalar(v, n) {
  return [v[0] * n, v[1] * n]
}

function vectorNorm(v) {
  return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]))
}

function limitNorm(v, limit) {
  let vNorm = vectorNorm(v)
  if (vNorm > limit) {
    v = vectorScalar(v, limit / vNorm)
  }
  return v
}