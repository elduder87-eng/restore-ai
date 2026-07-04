import { getCluster, areCrossCluster, allClusters } from '../lib/domains.js'

console.log('=== lib/domains.js smoke test ===')
console.log('allClusters length (expected 6):', allClusters.length)
console.log('getCluster("phys") includes phys:', getCluster('phys')?.includes('phys'))
console.log('getCluster("music") includes lit:', getCluster('music')?.includes('lit'))
console.log('getCluster("unknown") is null:', getCluster('unknown') === null)
console.log('areCrossCluster("phys","math") (expected false):', areCrossCluster('phys','math'))
console.log('areCrossCluster("music","math") (expected true):', areCrossCluster('music','math'))
console.log('areCrossCluster("phys","unknown") (expected false):', areCrossCluster('phys','unknown'))
console.log('areCrossCluster("unknown","phys") (expected false):', areCrossCluster('unknown','phys'))
