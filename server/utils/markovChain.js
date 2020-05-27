let sampleCorpus = [
  'I have a heart condition',
  'I have violent diarrhea',
  'I have to return some video tapes',
  'I have an appointment to get my ringworm checked',
  'I have to attend a funeral',
  'I have family issues',
  'I have an appointment to get waxed',
  'I have to go shave',
  'I have a thing',
  'I can\'t',
  'I can\'t leave my dog alone in the house',
  'I can\'t see',
  'I\'m having an affair',
  'I\'m having my teeth removed',
  'I\'m in love',
  'I\'m in trouble with the law',
  'I\'m pregnant',
  'My mom said no',
  'My mom said I have to mow the lawn',
  'My mom needs me',
  'My dad needs my help',
  'My dad said so',
  'My dad got famous on TikTok',
  'My grandma needs help changing her dentures',
  'My grandma needs her shopping done',
  'My grandpa wants to smoke weed',
  'My grandpa is at my house',
  'My grandparents are getting divorced',
  'My grandparents are getting married',
  'My cat is having an abortion',
  'My cat is having a birthday party',
  'My dog needs to go for a walk',
  'My dog is having babies',
  'My water broke',
  'I need to go for a walk',
  'I need to go shopping',
  'I need to replace my fridge with a bigger fridge',
  'I need to do my laundry',
  'I need help',
  'I need to buy more avocados for my toast'
];

/**
 * Implementation of the Markov Chain Monte Carlo algorithm, containing directed graph & generate/processData methods.
 * Must be constructed with an unprocessed data corpus as an Array of strings.
 *
 * Directed graph: nodes as a list of indices, a mapping of words to those indices, and a weighted edge list,
 * formatted as follows:
 * edgeList:
 * {
 *    idxOfString1: [[idxOfString2, 0.4], [idxOfString3, 0.7]],
 *    idxOfString2: [[idxOfString3, 0.2]]
 * }
 * Note that because the graph is directed, string1 may connect to string2, but string2 may not connect to string1
 * RemoveNode or RemoveEdge functionality has been ignored, as it is not necessary for the use of graph in MarkovChain
 */
class MarkovChain {
  constructor(data) {
    this.unprocessedData = data;
    this.nodes = [];
    this.edgeList = {};
    this.strToIdxMap = new Map();
  }

  /**
  * Processes a data corpus (Array of strings) into a directed graph with edge weights,
  * where each node corresponds to a word, and each edge is a link between a word and the one that comes after it.
  * The weighting is calculated as a word distribution percentage after processing.
  * @param {Integer} k: number of previous words to track in edgeList (influencing how many words are in a node unit)
  */
  processData(k = 1) {
    this._preprocessData();
  }

  /**
   * Generates a random excuse based off the MCMC algorithm
   * @returns {String}
   */
  generate() {
    return 'This function will generate a random excuse later'
  }

  /**
   * Normalize all verbs, a/an, remove non-apostrophe punctuation
   */
  _preprocessData() {
    this.unprocessedData.forEach(excuse => {

    })
  }

  /**
   * @param {String} str: May be one or multiple space-separated words, depending on
   */
  _addNode(str) {
    if (strToIdxMap.get(str) !== undefined) {
      return;
    }
    strToIdxMap.set(str, strToIdxMap.size);
    this.nodes.push(strToIdxMap[str]);
  }

  /**
   * @param {String} strA
   * @param {String} strB: strA ---> strB, strB !--> strA
   * @param {Float} weight
   */
  _addEdge(strA, strB, weight) {
    if (strToIdxMap.get(strA) === undefined || strToIdxMap.get(strB) === undefined) {
      addNode(strA);
      addNode(strB);
    }
    if (!this.edgeList[strToIdxMap]) {
      this.edgeList[strToIdxMap] = [];
    }
    this.edgeList[strToIdxMap.get(strA)].push([strToIdxMap.get(strB), weight]);
  }
}

let excuseMarkovChain = new MarkovChain(sampleCorpus);
excuseMarkovChain.processData();

module.exports.excuseMarkovChain = excuseMarkovChain;