'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    let ans = 0;
    for (let i = 0; i < bankAccount.length / 3 - 1; i += 3) {
        const dig= [bankAccount.slice(i, i + 3),
            bankAccount.slice(i + 28, i + 31),
            bankAccount.slice(i + 56, i + 59)];

        let num = 0;
        if(dig[0][1] == ' ' && dig[1][1] == ' ' && dig[2][1] == ' '){
            num = 1;
        }else if(dig[0][1] == '_' && dig[1][1] == ' ' && dig[2][1] == ' '){
            num = 7;
        }else if(dig[0][1] == '_' && dig[1][1] == ' ' && dig[2][1] == '_'){
            num = 0;
        }else if(dig[0][1] == ' ' && dig[1][1] == '_' && dig[2][1] == ' '){
            num = 4;
        }else if(dig[1] == '|_|' && dig[2] == '|_|'){
            num = 8;
        }else if(dig[1] == ' _|' && dig[2] == ' _|'){
            num = 3;
        }else if(dig[1] == '|_|' && dig[2] == ' _|'){
            num = 9;
        }else if(dig[1] == ' _|' && dig[2] == '|_ '){
            num = 2;
        }else if(dig[1] == '|_ ' && dig[2] == '|_|'){
            num = 6;
        }else{
            num = 5;
        }
        
        ans = ans * 10 + num;
    }
    return ans;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    if(columns > text.length){
        yield text;
    }else{
        let words = text.split(' ');
        let buf = [];
        buf.push(words[0]);
        let len = words[0].length;
        for(let i = 1; i < words.length; i++){
            if(len + words[i].length + 1 <= columns){
                buf.push(words[i]);
                len += words[i].length + 1;
            }else{
                yield buf.join(' ');
                buf.length = 0;
                len = 0;
                buf.push(words[i]);
                len = words[i].length;
            }
        }
        if(buf.length){
            yield buf.join(' ');
            buf.length = 0;
            len = 0;
        }
    }
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    //hand.sort();//♥ ♠ ♦ ♣

    let getSuit = card =>  card[card.length - 1] == '♥' ? 0 :
                            card[card.length - 1] == '♦' ? 1 :
                            card[card.length - 1] == '♣' ? 2 : 3;

    let rankToNum = rank => isNaN(parseInt(rank)) ? (11 + ['J', 'Q', 'K', 'A'].indexOf(rank)) : parseInt(rank);
    let getRank = card => rankToNum(card.length == 3 ? card.slice(0, 2) : card[0]);

    let cards = [[]];
    for(let h of hand)
        cards.push([getRank(h), getSuit(h)]);
    cards.shift();
    cards.sort((a,b) => a[0] - b[0]);
    if (cards[0][1] == cards[1][1] &&
        cards[1][1] == cards[2][1] &&
        cards[2][1] == cards[3][1] &&
        cards[3][1] == cards[4][1]){
        if((cards[0][0] == cards[1][0] - 1 &&
            cards[1][0] == cards[2][0] - 1 &&
            cards[2][0] == cards[3][0] - 1 &&
            cards[3][0] == cards[4][0] - 1) ||
            (cards[0][0] == 2 &&
                cards[1][0] == 3 &&
                cards[2][0] == 4 &&
                cards[3][0] == 5 &&
                cards[4][0] == 14)){
            return PokerRank.StraightFlush;
        }else{
            return PokerRank.Flush;
        }
    }else if(cards[0][0] == cards[3][0] ||
        cards[1][0] == cards[4][0]){
            return PokerRank.FourOfKind;
    }else if((cards[0][0] == cards[1][0] && cards[2][0] == cards[3][0] && cards[3][0] == cards[4][0]) ||
             (cards[0][0] == cards[1][0] && cards[1][0] == cards[2][0] && cards[3][0] == cards[4][0])){
        return PokerRank.FullHouse;
    }else if((cards[0][0] == cards[1][0] - 1 &&
        cards[1][0] == cards[2][0] - 1 &&
        cards[2][0] == cards[3][0] - 1 &&
        cards[3][0] == cards[4][0] - 1) ||
        (cards[0][0] == 2 &&
            cards[1][0] == 3 &&
            cards[2][0] == 4 &&
            cards[3][0] == 5 &&
            cards[4][0] == 14)){
            return PokerRank.Straight;
    }else if((cards[0][0] == cards[1][0] && cards[1][0] == cards[2][0]) ||
            (cards[1][0] == cards[2][0] && cards[2][0] == cards[3][0]) ||
            (cards[2][0] == cards[3][0] && cards[3][0] == cards[4][0])){
        return PokerRank.ThreeOfKind;
    }else {
        let equals = [];
        equals.push(cards[0][0] == cards[1][0]);
        equals.push(cards[1][0] == cards[2][0]);
        equals.push(cards[2][0] == cards[3][0]);
        equals.push(cards[3][0] == cards[4][0]);
        if(equals.filter(el => el == true).length > 1){
            return PokerRank.TwoPairs;
        }else{
            if(equals.filter(el => el == true).length == 0){
                return PokerRank.HighCard;
            }else{
                return PokerRank.OnePair;
            }
        }
    }
    
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */

function* getFigureRectangles(figure) {
    //throw new Error('Not implemented');
    figure = figure.split('\n');
    figure.pop();

    let figures = [[]];

    function GetRect(a,b){
        if(figure[a][b + 1] != undefined && figure[a][b + 1] != '-' && figure[a][b + 1] != '+')
            return;
        if(figure[a + 1][b] != undefined && figure[a + 1][b] != '|' && figure[a + 1][b] != '+')
            return;
        
        let k = a, l = b + 1;
        let len, wid;
        if(figure[k][l + 1] == '+'){
            len = 0;
        }else{
        while(true){
            if(figure[k][l] == '+'){
                if(l == figure[0].length - 1 || figure[k + 1][l] == '|')
                    break;
            }
            l++;         
        }
        len = l - b - 1;
    }
        k = a + 1; l = b;
        while(true){
            if(figure[k][l] == '+'){
                if(k == figure.length - 1 || figure[k][l + 1] == '-')
                    break;
            }
            k++;  
        }
        wid = k - a - 1;
        if(figure[a + wid + 1][b + len + 1] == '+')
            figures.push([len, wid]);
        return;
    }

    function Construct(l, w){
        let it = [];
        for(var i = 0; i < (l + 3)*(w + 2); i++)
            it.push(' ');
        it[0] = '+';
        it[l + 1] = '+';
        it[it.length - 2] = '+';
        it[it.length - l - 3] = '+';
        for(var i = 0; i < w + 2; i++){
            it[i + (l + 2)*(i + 1)] = '\n';
        }
        for(var i = 1; i < l + 1; i++)
            it[i] = '-';
        for(var i = it.length - l - 2; i < it.length - 2; i++)
            it[i] = '-';
        //to fix
        for(var i = l + 3; i < it.length - l - 4; i += l + 3){
            it[i] = '|';
            it[i + l + 1] = '|';
        }
        //to fix
        return it.join('');
    }

    // for(let i = 0; i< figure.length; i++)
    //     for(let j = 0; j < figure[0].length; i++)
    //         visited[i][j] = false;

    for(let i = 0; i< figure.length; i++)
        for(let j = 0; j < figure[0].length; j++){
            if(figure[i][j] == '+' && i != figure.length - 1 && j != figure[0].length - 1)
                if((figure[i][j + 1] == '-' && figure[i + 1][j] == '|') || (figure[i][j + 1] == '+' && figure[i + 1][j] == '+'))
                GetRect(i,j);
        }
    figures.shift();
    for(let item of figures)
        yield Construct(item[0], item[1]);
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
