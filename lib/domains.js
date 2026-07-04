/**
 * lib/domains.js
 * Domain cluster definitions and cross-cluster helpers.
 *
 * Topics in Restore's cognitive cartography graph are grouped into six domain clusters.
 * A "crossing" — the semantic core of The Crossroads of Your Mind lens — is a
 * topic-pair edge where the two topics belong to *different* clusters.
 *
 * These clusters are shared between the chat route (for connectionWhy generation)
 * and the insights layer (for filtering Crossroads content).
 */

export const scienceDomains = ["phys","chem","bio","math","geo","env","neuro","eng"]
export const spaceDomains = ["astro","bh","st","cosmo","rel","grav"]
export const humanDomains = ["hist","lit","art","music","film","ren","rev","anth","arch","cul"]
export const socialDomains = ["psych","soc","pol","law","eth","know","ling","crim"]
export const techDomains = ["tech","ai"]
export const econDomains = ["econ","biz","ind"]

export const allClusters = [
  scienceDomains,
  spaceDomains,
  humanDomains,
  socialDomains,
  techDomains,
  econDomains
]

/**
 * Returns the cluster array a topic belongs to, or null if the topic is not classified.
 */
export function getCluster(topic) {
  for (const cluster of allClusters) {
    if (cluster.includes(topic)) return cluster
  }
  return null
}

/**
 * Returns true if the two topics belong to different clusters.
 * Used by getCrossroads to filter Topic<->Topic edges for the Crossroads lens.
 * If either topic is not classified in any cluster, returns false.
 */
export function areCrossCluster(topicA, topicB) {
  const clusterA = getCluster(topicA)
  const clusterB = getCluster(topicB)
  if (!clusterA || !clusterB) return false
  return clusterA !== clusterB
}
