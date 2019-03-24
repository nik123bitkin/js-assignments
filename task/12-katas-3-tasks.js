'use strict';

/**
 * Returns true if word occurrs in the specified word snaking puzzle.
 * Each words can be constructed using "snake" path inside a grid with top, left, right and bottom directions.
 * Each char can be used only once ("snake" should not cross itself).
 *
 * @param {array} puzzle
 * @param {array} searchStr
 * @return {bool}
 *
 * @example
 *   var puzzle = [ 
 *      'ANGULAR',
 *      'REDNCAE',
 *      'RFIDTCL',
 *      'AGNEGSA',
 *      'YTIRTSP',
 *   ]; 
 *   'ANGULAR'   => true   (first row)
 *   'REACT'     => true   (starting from the top-right R adn follow the ↓ ← ← ↓ )
 *   'UNDEFINED' => true
 *   'RED'       => true
 *   'STRING'    => true
 *   'CLASS'     => true
 *   'ARRAY'     => true   (first column)
 *   'FUNCTION'  => false
 *   'NULL'      => false 
 */
function findStringInSnakingPuzzle(puzzle, searchStr) {
    let Visited = (point) => {
		for (let pos of visited)
            if ((pos[0] == point[0]) && (pos[1] == point[1])) 
                return true;
		return false;
	}

	let Parse = (start, point) => {
        //puzzle = array of words, start = current letter of search str, point is [i,j] in puzzle, where are we now
		if (start == searchStr.length - 1)
            return (puzzle[point[0]][point[1]] == searchStr[start]) && (!Visited([point[0], point[1]]));
            //case for last letter
        if ((puzzle[point[0]][point[1]] == searchStr[start]) && (!Visited([point[0], point[1]]))) {
            let result = false;
            visited.push([point[0], point[1]]);
            //this point is visited
            if (point[0] > 0)
                result |= Parse(start + 1, [point[0] - 1, point[1]]);
                //parse up
            if (point[1] < puzzle[point[0]].length - 1)
                result |= Parse(start + 1, [point[0], point[1] + 1]);
                //parse right
            if (point[0] < puzzle.length - 1)
                result |= Parse(start + 1, [point[0] + 1, point[1]]);
                //parse down
            if (point[1] > 0)
                result |= Parse(start + 1, [point[0], point[1] - 1]);
                //parse left
            visited.pop();
            return result;
        }
        return false;
	}
	
	let result = false;
	let visited = new Array();
	for (let i = 0; i < puzzle.length; i++)
		for (let j = 0; j < puzzle[i].length; j++)
            result |= Parse(0, [i, j]);
            
    return result;
}


/**
 * Returns all permutations of the specified string.
 * Assume all chars in the specified string are different.
 * The order of permutations does not matter.
 * 
 * @param {string} chars
 * @return {Iterable.<string>} all posible strings constructed with the chars from the specfied string
 *
 * @example
 *    'ab'  => 'ab','ba'
 *    'abc' => 'abc','acb','bac','bca','cab','cba'
 */
function* getPermutations(chars) {
    function getAllPermutations(string) {
        var results = [];        
        if (string.length < 1) {
            results.push(string);
            return results;
        }        
        for (var i = 0; i < string.length; i++) {
            var firstChar = string[i];
            var charsLeft = string.substring(0, i) + string.substring(i + 1);
            //get substr for permutation
            var partPerms = getAllPermutations(charsLeft);
            //get perms of substring
            for (var j = 0; j < partPerms.length; j++) {
                results.push(firstChar + partPerms[j]);
                //add results in format: current char + every part permutation
            }
        }
        return results;
    }
    for(let perm of getAllPermutations(chars)){
        yield perm;
    }
}


/**
 * Returns the most profit from stock quotes.
 * Stock quotes are stores in an array in order of date.
 * The stock profit is the difference in prices in buying and selling stock.
 * Each day, you can either buy one unit of stock, sell any number of stock units you have already bought, or do nothing. 
 * Therefore, the most profit is the maximum difference of all pairs in a sequence of stock prices.
 * 
 * @param {array} quotes
 * @return {number} max profit
 *
 * @example
 *    [ 1, 2, 3, 4, 5, 6]   => 15  (buy at 1,2,3,4,5 and then sell all at 6)
 *    [ 6, 5, 4, 3, 2, 1]   => 0   (nothing to buy)
 *    [ 1, 6, 5, 10, 8, 7 ] => 18  (buy at 1,6,5 and sell all at 10)
 */
function getMostProfitFromStockQuotes(quotes) {
    let maxProfit = 0;
    let i = quotes.length;

    while (--i && quotes[i] < quotes[i - 1]) {
        quotes.pop();
    }//pop from back, bcz no profit of buing 3 2 1

    while (quotes.length) {
        let maxIndex = quotes.reduce((maxIndex, elem, index) => maxIndex = elem > quotes[maxIndex] ? index : maxIndex, 0);
        //get point with max price. it must be higher that all previous to get profit
        for (i = 0; i < maxIndex; i++) {
            maxProfit += quotes[maxIndex] - quotes[i];
        }
        quotes = quotes.slice(maxIndex + 1);
        //go again to right part of quotes
    }

    return maxProfit;
}


/**
 * Class representing the url shorting helper.
 * Feel free to implement any algorithm, but do not store link in the key\value stores.
 * The short link can be at least 1.5 times shorter than the original url.
 * 
 * @class
 *
 * @example
 *    
 *     var urlShortener = new UrlShortener();
 *     var shortLink = urlShortener.encode('https://en.wikipedia.org/wiki/URL_shortening');
 *     var original  = urlShortener.decode(shortLink); // => 'https://en.wikipedia.org/wiki/URL_shortening'
 * 
 */
function UrlShortener() {
    this.urlAllowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"+
                           "abcdefghijklmnopqrstuvwxyz"+
                           "0123456789-_.~!*'();:@&=+$,/?#[]";
}

const storage = new Map();

String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
      chr   = this.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
};


UrlShortener.prototype = {

    encode: function(url) {
        let allowedLength = Math.floor(url.length / 1.5);
        let key = url.hashCode();
        let s = key.toString(10);
        storage.set(s, url);
        return s;
    },
    
    decode: function(code) {
        return storage.get(code);
    } 
}



module.exports = {
    findStringInSnakingPuzzle: findStringInSnakingPuzzle,
    getPermutations: getPermutations,
    getMostProfitFromStockQuotes: getMostProfitFromStockQuotes,
    UrlShortener: UrlShortener
};
