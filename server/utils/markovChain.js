const axios = require('axios');
const nlp = require('compromise');

const dataset = require('../data/excuses.json');
const alphaWordDict = require('../data/words_dictionary.json');
const profanityDict = require('../data/profanity_list.json');
const { shallowEquals } = require('./shallowEquals');
const { getAllData } = require('../db/index');

/**
 * Implementation of the Markov Chain Monte Carlo (MCMC) algorithm using directed graph & generate/processData methods.
 * Must be instantiated with an unprocessed data corpus as an Array of non-zero length strings.
 * Used for generating pseudo-random, semi-realistic phrases based off the content of the input data corpus.
 *
 * Directed graph: a weighted edge list, formatted as follows:
 * {
 *    string1: [[string2, 0.4], [string3, 0.7]],
 *    string2: [[string3, 0.2]],
 *    ...etc.
 * }
 * Note that because the graph is directed, string1 may connect to string2, but string2 may not connect to string1
 * removeNode, addNode, & removeEdge functionality has been ignored, as the graph doesn't require it in the context of MCMC.
 *
 * A graph implemented with an edge list is preferred, as an adjacency matrix will most likely (depending on data corpus)
 * be too sparse to be efficient, and an adjacency list glosses over the most important aspect of MCMC text generation: edge weights.
 */
class MarkovChain {
  constructor(data) {
    // Retain unprocessed & preprocessed for comparison with newly added data in
    // sprint stretch goal: user-posted excuses which recalibrate the Markov chain
    this.unprocessedData = [...data]; // Array of Strings
    this.prevUnprocessedData = [...data];
    this.preprocessedData = null; // Array of compromise (nlp library) docs

    // For preprocessing
    this.forbiddenPunctuation = new Set([':', ';', '/', '\\', '|', '[', ']', '{', '}', '(', ')', '+', '=', '_', '*', '&', '^', '#', '@', '~', '`', '<', '>']);
    this.allowedPunctCount = {'"': 4, '\'': 4, '%': 1, '?': 1, '-': 2, ',': 2};
    this.escapeCharsMap = {
      ' ': '%20',
      '!': '%21',
      '"': '%22',
      '$': '%24',
      '\'': '%27',
      ',': '%2C',
      '-': '%2D',
      '.': '%2E',
      '?': '%3F'
    };

    // Processed data goes directly into a directed graph
    this.edgeList = new Map();
    this.phraseBeginnings = new Map();
    this.prevK = null;
    if (!this.unprocessedData) {
      throw new Error('Markov Chain must be instantiated with an array of strings');
      return;
    }
  }

  addData(string) {
    this.unprocessedData.push(string);
  }

  /**
  * Processes a data corpus (Array of strings) into a directed graph with edge weights,
  * where each node corresponds to a word, and each edge is a link between a word and the one that comes after it.
  * The weighting is calculated as a word distribution percentage after processing.
  * @param {Integer} k: number of previous words to track in edgeList (influencing how many words are in a node unit)
  * NOTE: It is recommended, for short phrases and small datasets, to keep k = 1, otherwise
  * generated sentences will most likely be exactly the same as those in the data corpus.
  */
  async processData(k = 1) {
    let isDataDifferent = !shallowEquals(this.unprocessedData, this.prevUnprocessedData);

    // Same exact data & k as last processData call
    if (!isDataDifferent && this.prevK === k) {
      return;
    }

    // A preprocess call should happen whenever data changes or doesn't exist
    if (!this.preprocessedData || isDataDifferent) {
      this.preprocessedData = await this._preprocessData();
      this.prevUnprocessedData = [...this.unprocessedData];
    }

    // All data passed in is invalid after preprocessing. Graph should be emptied
    if (!this.preprocessedData.length) {
      this.edgeList = new Map();
      this.phraseBeginnings = new Map();
      return;
    }

    // Reconstruct directed graph if k is different.
    // If k is the same but data is different, we should still reconstruct
    // the directed graph due to possible changes in edge weighting (TODO: more elegant solution rather than reconstruction whole graph)
    if (this.prevK !== k || isDataDifferent) {
      this.prevK = k;
      this.edgeList = new Map();
      this.phraseBeginnings = new Map();
    }

    let edgeMap = new Map();
    // Add preprocessed data to directed graph based on k param
    this.preprocessedData.forEach(strArr => {
      let kWindow = [], kWindowStr;
      for (let i = 0; i <= strArr.length - k; i++) {
        // If first loop, add first k words as a beginning phrase
        if (i === 0) {
          kWindow = strArr.slice(i, k);
          let joined = kWindow.join(' ');
          let valueIfExists = this.phraseBeginnings.get(joined);
          if (valueIfExists) {
            this.phraseBeginnings.set(joined, valueIfExists + 1);
          } else {
            this.phraseBeginnings.set(joined, 1);
          }

        } else {
          kWindow.push(strArr[i+k-1]);
          kWindow.shift();
        }
        kWindowStr = kWindow.join(' ');
        if (!edgeMap.get(kWindowStr)) {
          edgeMap.set(kWindowStr, []);
        }
        // Set as null for end of phrase
        edgeMap.get(kWindowStr).push(strArr[i+k] || null);
      }
    });

    this._setEdgeWeights(edgeMap);
    return;
  }

  /**
   * Generates a random excuse based off the MCMC algorithm
   * @returns {String}
   */
  generate() {
    if (this.edgeList.size === 0) {
      throw new Error('Cannot generate on an empty dataset. Add data to the Markov Chain, or if data is present, call processData() first.');
    }
    let current = this._selectRandomStartingWord();
    let generated = current;
    while (current !== null) {
      let nextMapVal = this.edgeList.get(current);
      let nextWordOptions = nextMapVal ? nextMapVal.nextWords : null;
      if (!nextWordOptions) {
        current = null;
        // TODO: this line is for k >= 2. It can be used once the dataset is suitably large (over 10000 entries approx)
        // Currently the starting dataset (minus user entry) is around ~350 lines, so k = 2 would only ever return entries in the dataset,
        // due to lack of distrbution (see distrbutions in this.edgeList after called processData(2))
      } else {
        current = nextWordOptions[Math.floor(Math.random() * nextWordOptions.length)];
      }

      // Avoid adding null phrase termination to generated phrase
      if (current) {
        generated += current[0] === '\'' || current[0] === ',' ? current : ` ${current}`;
      }
    }
    let doc = nlp(generated);
    doc.contract();
    return doc.text()
      .replace('I\'ve', 'I have')
      .replace('cann\'t', 'can\'t')
      .replace('$ ', '$')
      .replace(' . ', '.')
      .replace(' - ', '-');
  }

  /**
   * For user added excuse strings, check if data:
   *  - has appropriate punctuation
   *  - doesn't contain profanity
   *  - contains only words that exist
   * @param {String} excuse
   * @returns {Boolean}
   */
  async checkAddedExcuseValidity(excuse) {
    let allowedData = this._validateData([excuse]);
    if (allowedData.length) {
      allowedData = await this._removeNonWords(allowedData);
    }
    return allowedData.length > 0 && allowedData[0].length > 0;
  }

  /**
   * @returns {String}
   */
  _selectRandomStartingWord() {
    if (!this.phraseBeginnings.size) {
      throw new Error('There are no possible starting words. Check that the Markov Chain contains data, and that processData() has been called.');
    }

    let startingWordsWithDistributions = Array.from(this.phraseBeginnings.entries());
    return this._weightedChoice(startingWordsWithDistributions);
  }

  /**
   * Takes an array of arrays: [[ value, weight ], [ value2, weight2 ]]
   * and returns a choice based on the weights in the input
   * @param {Array[Array[String, Number]]} valsWithWeights
   * @returns {String}
   */
  _weightedChoice(valsWithWeights) {
    let totalWeight = this.preprocessedData.length;
    let random = Math.round(Math.random() * totalWeight);
    let found = valsWithWeights.find(unit => (random -= unit[1]) <= 0);
    found = found ? found[0] : 'I'; // TODO: More elegant solution to 'TypeError: Cannot read property '0' of undefined
    return found;
  }

  /**
   * Given a map of keys length k to arrays of possible next words,
   * calculate the probability of selecting any next word and
   * add as weights to this.edgeList.
   * @param {Object{String:Array}} edgeMap
   */
  _setEdgeWeights(edgeMap) {
    edgeMap.forEach((valArr, key) => {
      let distribution = {};
      let denominator = 0;
      valArr.forEach(val => {
        distribution[val] ? distribution[val]++ : distribution[val] = 1;
        denominator++;
      });
      for (let key in distribution) {
        distribution[key] = parseFloat((distribution[key] / denominator).toFixed(4));
      }
      this.edgeList.set(key, {
        nextWords: [...valArr],
        total: denominator,
        distribution
      });
    });
  }

  /**
   * @returns {Array}
   */
  async _preprocessData() {
    let allowedData = this._validateData(this.unprocessedData);
    allowedData = await this._removeNonWords(allowedData);
    allowedData = this._expandAllContractions(allowedData);
    allowedData = this._addSpacesBetweenPunctuation(allowedData);
    return allowedData;
  }

  /**
   * Remove phrases with invalid punctuation, length, or bad words
   * @param {Array} excuses
   * @returns {Array}
   */
  _validateData(excuses) {
    return excuses.filter(excuse => {
      return Boolean(excuse)
          && typeof excuse === 'string'
          && excuse.length >= 4
          && excuse.length <= 75
          && this._hasAppropriatePunctuation(excuse);
    })
    .map(excuse => excuse.split(' '))
    .filter(excuseArr => profanityDict.every(badWord => !excuseArr.includes(badWord)));
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
    let areWordsPromiseMap = arrOfStrArr.map(strArr => {
      let isWordPromiseArr = strArr.map(str => {
        return new Promise((resolve, reject) => {
          if (alphaWordDict[str.toLowerCase()]) {
            resolve(true);
          } else {
            if (str.search(/^[a-zA-Z0-9]+$/) === -1) {
              str = this._escapePunctuation(str);
            }
            this._ensureIsPopCultureWord(str.toLowerCase())
              .then(isWord => {
                resolve(isWord);
              })
              .catch(() => resolve(false));
          }
        });
      });

      return new Promise((resolve, reject) => {
        Promise.all(isWordPromiseArr)
          .then(results => {
            if (results.includes(false)) {
              resolve(false);
            } else {
              resolve(true);
            }
          })
          .catch(() => resolve(false));
      })
    });

    let isValidArr = await Promise.all(areWordsPromiseMap);
    return arrOfStrArr.filter((strArr, idx) => isValidArr[idx] === true);
  }

  /**
   * For use with Urban Dictionary API, escapes punctuation
   */
  _escapePunctuation() {
    let strArr = str.split('');
    strArr = strArr.map(char => {
      return this.escapeCharsMap[char] ? this.escapeCharsMap[char] : char;
    });
    return strArr.join('');
  }

  /**
   * Using unofficial Urban Dictionary API, ensure non-standard English word exists
   * @param {String} word
   * @returns {Promise->Boolean}
   */
  async _ensureIsPopCultureWord(word) {
    return await axios.get(`http://api.urbandictionary.com/v0/define?term=${word.toLowerCase()}`)
      .then(res => res.data)
      .then(({list}) => {
        return list.length >= 10 && list[0].word.toLowerCase() === word
      })
      .catch(err => {
        console.error('Error checking against Urban Dictionary API: ', err, word);
        throw err;
      });
  }

  /**
   * For each word in strArr, if it has punctuation in it, split punctuation into a separate array entry
   * Contractions have been removed in previous _expandAllContractions call,
   * so only need to account for <.>, <?>, <%>, <$>, <,>, <">, and <'> (from possessive form)
   *
   * Note that <'s> is paired together:
   * Purpose: for increased accuracy in Markov Chain generation later on
   * (in that phrases containing there's, here's, and grandma's, for example will share the same pool since they end in <'s>)
   * @param {Array[Array[String]]} arrOfStrArr
   */
  _addSpacesBetweenPunctuation(arrOfStrArr) {
    return arrOfStrArr.map(strArr => {
      let punctWithSpacesArr = [];
      for (let word of strArr) {
        // If has punctuation, separate
        if (word.search(/^[a-zA-Z]+$/) === -1) {
          punctWithSpacesArr.push(...this._separatePunctuatedUnit(word));
        } else {
          punctWithSpacesArr.push(word);
        }
      }
      return punctWithSpacesArr;
    });
  }

  /**
   * Given a word with some form of punctuation in the middle, separate according to
   * rules listed in _addSpacesBetweenPunctuation method.
   * @param {String} word
   * @returns {Array}
   */
  _separatePunctuatedUnit(word) {
    let wordWithSpacedPunctArr = [];
    let punctMatches = word.match(/[\.\?\%\$\,\"\']+/g);
    let current = '';
    for (let letter of word) {
      if (punctMatches && punctMatches.length && punctMatches[0] === letter) {
        current && wordWithSpacedPunctArr.push(current);
        current = '';
        let curLetter = punctMatches.shift();
        if (curLetter === '\'') {
          current += curLetter;
        } else {
          wordWithSpacedPunctArr.push(curLetter);
        }
      } else {
        current += letter;
      }
    }
    current && wordWithSpacedPunctArr.push(current);
    return wordWithSpacedPunctArr;
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
}


let excuseMarkovChain = new MarkovChain(dataset);

// getAllData()
//   .then(doc => {
//     excuseMarkovChain.unprocessedData = doc[0].data;
//     console.log(doc[0].data);
//   })
//   .catch(err => {
//     console.error(err);
//   });

module.exports.excuseMarkovChain = excuseMarkovChain;