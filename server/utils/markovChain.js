const axios = require('axios');
const nlp = require('compromise');

const { sampleCorpus, badSampleCorpus } = require('./sampleData');
const alphaWordDict = require('./words_dictionary.json');
const { shallowEquals } = require('./shallowEquals');

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
    this.forbiddenWords = null;
    this.allowedPunctCount = {'"': 4, '\'': 4, '%': 1, '?': 1, '-': 2, ',': 2};

    // Processed data goes directly into a directed graph
    this.edgeList = new Map();
    this.phraseBeginnings = new Set();
    this.prevK = null;
    if (!this.unprocessedData) {
      throw new Error('Markov Chain must be instantiated with an array of strings');
      return;
    }
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
      this.phraseBeginnings = new Set();
      return;
    }

    // Reconstruct directed graph if k is different.
    // If k is the same but data is different, we should still reconstruct
    // the directed graph due to possible changes in edge weighting (TODO: more elegant solution rather than reconstruction whole graph)
    if (this.prevK !== k || isDataDifferent) {
      this.prevK = k;
      this.edgeList = new Map();
      this.phraseBeginnings = new Set();
    }

    let edgeMap = new Map();
    // Add preprocessed data to directed graph based on k param
    this.preprocessedData.forEach(strArr => {
      let kWindow = [], kWindowStr;
      for (let i = 0; i <= strArr.length - k; i++) {
        // If first loop, add first k words as a beginning phrase
        if (i === 0) {
          kWindow = strArr.slice(i, k);
          this.phraseBeginnings.add(kWindow.join(' '));
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
      let nextWordOptions = this.edgeList.get(current).nextWords;
      current = nextWordOptions[Math.floor(Math.random() * nextWordOptions.length)];
      // Avoid adding null phrase termination to generated phrase
      if (current) {
        generated += current[0] === '\'' ? current : ` ${current}`;
      }
    }
    let doc = nlp(generated);
    doc.contract();
    return doc.text().replace('I\'ve', 'I have');
  }

  /**
   * @returns {String}
   */
  _selectRandomStartingWord() {
    if (!this.phraseBeginnings.size) {
      throw new Error('There are no possible starting words. Check that the Markov Chain contains data, and that processData() has been called.');
    }

    let randIdx = Math.floor(Math.random() * this.phraseBeginnings.size);
    let iterator = this.phraseBeginnings.values();
    let startingWord = '';
    while(randIdx >= 0) {
      startingWord = iterator.next().value;
      randIdx--;
    }
    return startingWord;
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
      if (punctMatches.length && punctMatches[0] === letter) {
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

let excuseMarkovChain = new MarkovChain(sampleCorpus);

module.exports.excuseMarkovChain = excuseMarkovChain;