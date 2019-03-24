'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    let delta = 11.25;
    let azimuth = 0;
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    let output = [];

    function getItem(abbreviation){
        const item = {
            abbreviation: abbreviation,
            azimuth: azimuth
        }
        azimuth += delta;
        return item;
    }

    let flag = false;

    for(let i = 0; i<sides.length; i++){
        let mainSide = sides[i];
        let secondSide = i == sides.length - 1 ? sides[0]:sides[i + 1];
        output.push(getItem(`${mainSide}`));
        output.push(getItem(`${mainSide}b${secondSide}`));
        output.push(getItem(flag ? `${mainSide}${secondSide}${mainSide}`: `${mainSide}${mainSide}${secondSide}`));
        output.push(getItem(flag ? `${secondSide}${mainSide}b${mainSide}`: `${mainSide}${secondSide}b${mainSide}`));        
        output.push(getItem(flag ? `${secondSide}${mainSide}` : `${mainSide}${secondSide}`));
        output.push(getItem(flag ? `${secondSide}${mainSide}b${secondSide}` :`${mainSide}${secondSide}b${secondSide}`));
        output.push(getItem(flag ? `${secondSide}${secondSide}${mainSide}` : `${secondSide}${mainSide}${secondSide}`));
        output.push(getItem(`${secondSide}b${mainSide}`));       
        flag = !flag;
    }

    return output;
    
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    let out = [str];
    let regex = /\{[^\{\}]*?\}/;
    //regex to match
    let over = false;
    while (!over) {
        over = true;
        let temp = [];

        for (let s of out) {
            let matches = s.match(regex);
            if (matches) {
                over = false;
                let opts = matches[0].slice(1, -1).split(',');
                //get all variants
                for (let opt of opts) {
                    temp.push(s.replace(matches[0], opt));
                    //push clear variant
                }
            } else {
                temp.push(s);
            }
        }
        out = temp;
    }
    out = [...new Set(out)];
    //creating set to avoid duplicates

    for (let s of out) {
        yield s;
    }
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    
    let matrix = Array.from({length: n}, () => Array.from({length: n}, () => 0));
    //fill with zeros n rows with n cols
    let i = 0;
    let j = 0;
    let elem = 1;
    let flag = true;
    //prior of != greater than &&
    while (elem < n * n) {
        if (!flag) {
            if (j && i != n - 1) {
                //j != 0 and i != n - 1
                i++;
                j--;
            } else {
                if (i == n - 1) {
                    j++;
                } else {
                    i++;
                }
                flag = !flag;
            }
        }else{
            if (i && j != n - 1) {
                //i != 0 and j != n - 1
                i--;
                j++;
            } else {
                if (j == n - 1) {
                    i++;
                } else {
                    j++;
                }
                flag = !flag;
            }
        }
        matrix[i][j] = elem++;
    }

    return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    let hold = [[]];
    hold[0] = dominoes.shift();
    //put first domino

    let lastLength = 0;
    //for check that new domino applied
    while (lastLength != dominoes.length && dominoes.length > 0) {
        //no dominos or no new one
        lastLength = dominoes.length;
        for (let i = 0; i < dominoes.length; i++) {
            if (hold[hold.length - 1][1] == dominoes[i][0] && hold[hold.length - 1][0] != dominoes[i][1]) {
                //check [a,b] case
                hold[hold.length] = dominoes[i];
                dominoes.splice(i, 1);
                //get and destroy domino
            } else if (hold[hold.length - 1][1] == dominoes[i][1] && hold[hold.length - 1][0] != dominoes[i][1]) {
                //check [b,a] case
                hold[hold.length] = dominoes[i].reverse();
                dominoes.splice(i, 1);
            }
        }
    };

    return dominoes.length == 0;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    let stack = [];
    let out = [];
    stack.push(nums[0]);
    for(let i = 1; i < nums.length; i++){
        if(nums[i] == stack[stack.length - 1] + 1 || stack.length == 0){
            stack.push(nums[i]);
        }else{
            if (stack.length > 2){
                out.push(`${stack[0]}-${stack[stack.length - 1]}`);
                stack.length = 0;
            }else{
                while(stack.length != 0)
                    out.push(stack.shift());
            }
            stack.push(nums[i]);
        }
    }
    if (stack.length > 2){
        out.push(`${stack[0]}-${stack[stack.length - 1]}`);
        stack.length = 0;
    }else{
        while(stack.length != 0)
            out.push(stack.shift());
    }
    return out.join(',');
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
