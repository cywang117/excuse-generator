const { sampleCorpus, badSampleCorpus } = require('./sampleData');
const axios = require('axios');
const nlp = require('compromise');
const alphaWordDict = require('./words_dictionary.json');

/**
 * Implementation of the Markov Chain Monte Carlo (MCMC) algorithm using directed graph & generate/processData methods.
 * Must be instantiated with an unprocessed data corpus as an Array of non-zero length strings.
 * Used for generating pseudo-random, semi-realistic phrases based off the content of the input data corpus.
 *
 * Directed graph: nodes as a list of indices, a mapping of words to those indices, and a weighted edge list,
 * formatted as follows:
 * edgeList:
 * {
 *    idxOfString1: [[idxOfString2, 0.4], [idxOfString3, 0.7]],
 *    idxOfString2: [[idxOfString3, 0.2]],
 *    ...etc.
 * }
 * Note that because the graph is directed, string1 may connect to string2, but string2 may not connect to string1
 * removeNode or removeEdge functionality has been ignored, as the graph doesn't require it in the context of MCMC.
 *
 * A graph implemented with an edge list is preferred, as an adjacency matrix will most likely (depending on data corpus)
 * be too sparse to be efficient, and an adjacency list glosses over the most important aspect of MCMC text generation: edge weights.
 */
class MarkovChain {
  constructor(data) {
    // Retain unprocessed & preprocessed for comparison with newly added data in
    // sprint stretch goal: user-posted excuses which recalibrate the Markov chain
    this.unprocessedData = data; // Array of Strings
    this.preprocessedData = null; // Array of compromise (nlp library) docs

    // For preprocessing
    this.forbiddenPunctuation = new Set([':', ';', '/', '\\', '|', '[', ']', '{', '}', '(', ')', '+', '=', '_', '*', '&', '^', '#', '@', '~', '`', '<', '>']);
    this.forbiddenWords = null;
    this.allowedPunctCount = {'"': 4, '\'': 4, '%': 1, '?': 1, '-': 2, ',': 2};

    // Processed data goes directly into a directed graph
    this.nodes = [];
    this.edgeList = {};
    this.strToIdxMap = new Map();
    if (!this.unprocessedData) {
      throw new Error('Markov Chain must be instantiated with an array of strings');
      return;
    }
    this.processData();
  }

  /**
  * Processes a data corpus (Array of strings) into a directed graph with edge weights,
  * where each node corresponds to a word, and each edge is a link between a word and the one that comes after it.
  * The weighting is calculated as a word distribution percentage after processing.
  * @param {Integer} k: number of previous words to track in edgeList (influencing how many words are in a node unit)
  */
  async processData(k = 1) {
    this.preprocessedData = await this._preprocessData();
    if (!this.preprocessedData.length) {
      return this.preprocessedData; // []
    }
    // TODO
    return 'TODO';
  }

  /**
   * Generates a random excuse based off the MCMC algorithm
   * @returns {String}
   */
  generate() {
    return 'This function will generate a random excuse later'
  }

  /**
   * Normalize all verbs, articles, remove phrases with non-normal punctuation, remove bad words
   * @returns {Array}
   */
  async _preprocessData() {
    if (!this.forbiddenWords) {
      let response = await axios.get('https://raw.githubusercontent.com/RobertJGabriel/Google-profanity-words/master/list.txt');
      this.forbiddenWords = response.data.split('\n').filter(word => word !== '');
    }

    let allowedData = this.unprocessedData
      .filter(excuse => {
        return Boolean(excuse)
            && typeof excuse === 'string'
            && excuse.length >= 3
            && excuse.length <= 75
            && this._hasAppropriatePunctuation(excuse);
      })
      .map(excuse => excuse.split(' '))
      .filter(excuseArr => this.forbiddenWords.every(badWord => !excuseArr.includes(badWord)));
    allowedData = await this._removeNonWords(allowedData);
    allowedData = this._expandAllContractions(allowedData);
    allowedData = this._addSpacesBetweenPunctuation(allowedData);
    return allowedData;
  }

  /**
   * Definition of 'appropriate punctuation' in this context:
   * One <.>, <?>, or <!> allowed at end
   * Four <"> or <'>, one <%> or <$>, two <-> or <,> allowed
   * No forbidden punctuation -- see constructor of MarkovChain
   */
  _hasAppropriatePunctuation(str) {
    let letterArr = str.split('');
    // False if doesn't end in appropriate punctuation or a letter/number
    if (letterArr[letterArr.length - 1].search(/[a-zA-Z0-9\.\?\!]$/g) === -1) {
      return false;
    }
    let punctCountMap = new Map([
      ['"', 0],
      ['\'', 0],
      ['%', 0],
      ['?', 0],
      ['-', 0],
      [',', 0]
    ]);
    for (let i = 0; i < str.length; i++) {
      punctCountMap.has(str[i]) && punctCountMap.set(str[i], punctCountMap.get(str[i]) + 1);
    }
    let allowedPunctFlag = true;
    for (let key in this.allowedPunctCount) {
      allowedPunctFlag = allowedPunctFlag && this.allowedPunctCount[key] >= punctCountMap.get(key);
    }
    return allowedPunctFlag
        && letterArr.every(letter => !this.forbiddenPunctuation.has(letter))
        && letterArr.join('').search(/([a-zA-Z]+[\.\?\%][a-zA-Z]+)|([a-zA-Z]+[\.\?\%][0-9]+)|([0-9]+[\.\?\%][a-zA-Z]+)/gi) === -1;
  }

  /**
   * Ensure all alpha words (ignoring symbols/numbers) are members of the English lexicon,
   * using stored 467k json of words. Credits: https://github.com/dwyl/english-words.
   * Remove entries from input otherwise.
   * @param {Array[Array[String]]} arrOfStrArr
   * @returns {Array[Array[String]]}
   */
  async _removeNonWords(arrOfStrArr) {
    return arrOfStrArr.filter(async strArr => {
      return await strArr
          && strArr.filter(word => word.search(/^[a-zA-Z]+$/) !== -1)
                   .every(async alphaWord => {
                     if (alphaWordDict[alphaWord.toLowerCase()]) {
                       return true;

                       // Might be a pop culture word: i.e. TikTok, Instagram, etc.
                     } else {
                       return await this._ensureIsPopCultureWord(alphaWord.toLowerCase());
                     }
                   })
    });
  }

  /**
   * Using unofficial Urban Dictionary API, ensure non-standard English word exists
   * @param {String} word
   * @returns {Promise->Boolean}
   */
  async _ensureIsPopCultureWord(word) {
    return await axios.get(`http://api.urbandictionary.com/v0/define?term=${word.toLowerCase()}`)
      .then(res => res.data)
      .then(({list}) => list.length >= 10 && list[0].word.toLowerCase() === word);
  }

  /**
   * For each word in strArr, if it has punctuation in it, split punctuation into a separate array entry
   * Contractions have been removed in previous _expandAllContractions call,
   * so only need to account for <.>, <?>, <%>, <$>, <,>, <">, and <'> (from possessive form)
   * Purpose: for increased accuracy in Markov Chain generation later on
   * (in that phrases containing there's, here's, and grandma's, for example will share the same pool)
   * @param {Array[Array[String]]} arrOfStrArr
   */
  _addSpacesBetweenPunctuation(arrOfStrArr) {
    return arrOfStrArr.map(strArr => {
      let punctWithSpacesArr = [];
      for (let word of strArr) {
        // If has punctuation, separate
        if (word.search(/^[a-zA-Z]+$/) === -1) {
          let punctMatches = word.match(/[\.\?\%\$\,\"\']+/g);
          let current = '';
          for (let letter of word) {
            if (punctMatches.length && punctMatches[0] === letter) {
              current && punctWithSpacesArr.push(current);
              current = '';
              punctWithSpacesArr.push(letter) && punctMatches.shift();
            } else {
              current += letter;
            }
          }
          current && punctWithSpacesArr.push(current);
        } else {
          punctWithSpacesArr.push(word);
        }
      }
      return punctWithSpacesArr;
    });
  }

  /**
   * Using compromise natural language processing library, expand all contractions
   * @param {Array[Array[String]]} arrOfStrArr
   */
  _expandAllContractions(arrOfStrArr) {
    return arrOfStrArr.map(strArr => {
      let doc = nlp(strArr.join(' '));
      doc.contractions().expand();
      return doc.text().split(' ');
    });
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

module.exports.excuseMarkovChain = excuseMarkovChain;