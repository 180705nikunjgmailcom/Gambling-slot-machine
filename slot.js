// 1. Deposit some money
// 2. Determine the number of lines to bet on
// 3. Collect the bet amount
// 4. Spin the slot machine
// 5. Check if the user won
// 6. Give the user their winnings
// 7. play again


const prompt = require("prompt-sync")(); // imports

const ROWS = 3; 
const COLS = 3;
const SYMBOL_COUNT = { // object
    A : 2,
    B : 4,
    C : 6,
    D : 8
}
const SYMBOL_VALUE = {
    A : 5,
    B : 4,
    C : 3,
    D : 2
}

const deposit = () => {
    while(true){ // using while loop until user enteres a valid amount type
        const depositAmount = prompt("Enter a deposit amount: "); 
        // as enclosed in double comma, will be considered as string by default and changed into integer in order to use subtraction, if user enteres a string like = "hello", so the output will be displayed as NaN (Not a Number)
        const numberDepositAmount = parseFloat(depositAmount);
    
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, try again.");
        }else{
            return numberDepositAmount; // if valid amt type, will exit the while loop
        }
    }
};

const getNumberOfLines = () => {
    while(true){
        const lines = prompt("Enter the number of lines to bet on:(1-3) ");
        const numberOfLines = parseFloat(lines);
    
        if(isNaN(numberOfLines) || numberOfLines <= 0 || numberOfLines > 3){
            console.log("Invalid number of lines, try again.");
        }else{
            return numberOfLines;
        }
    }
};

const getBet = (balance, lines) => {
    while(true){
        const bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(bet);
    
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > balance / lines){
            console.log("Invalid bet, try again.");
        }else{
            return numberBet;
        }
    }
};

const spin = () => {
    const symbols = [];
    for(const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i = 0; i < COLS; i++){
        reels.push([]); // if we want to change the number of slots in the machine from 3 to more, this is more flexible
        const reelSymbols = [...symbols]; // making a copy array of the symbols array ton remove the symbols used
        for(let j = 0; j < ROWS; j++){
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // removing the random symbol from the copied array to not use it again
        }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];

    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i])
        }
    }
    return rows;
};

const printRows = (rows) => {
    for(const row of rows) {
        let rowString = "";
        for(const [i, symbol] of row.entries()){
            rowString += symbol;

            if(i != rows.length - 1){
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;
    for(let row = 0; row < lines; row++){
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbol != symbols[0]){
                allSame = false;
                break;
            }
        }

        if(allSame) {
            winnings += bet * SYMBOL_VALUE[symbols[0]];
        }
    }
    return winnings;
};

const game = () => {
    let balance = deposit();
    while(true){
        console.log("You have: $" + balance+ " as your current balance");
        console.log("\n.............................................\n");
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        
        balance -= bet * numberOfLines; // subtracting the amount used on the bet from balance
        const reels = spin();
        const rows = transpose(reels);
        console.log("\n.............................................");
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings; // adding the winnings after spin to the balance

        console.log(".............................................");
        console.log("You won, $" + winnings.toString());

        if(balance <= 0){
            console.log("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            console.log("You have no more money left to gamble!!");
            console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
            break;
        }
        console.log(".............................................");
        const playAgain = prompt("Do you want to gamble again? (y/n)");
        console.log(".............................................\n\n");
        if(playAgain != "y") break;
    }
}; game();



// now in order to see if the user is winning anything, we need to TRANSPOSE the column 2D array (matrix) into different rows:  
// [[A B C], [D D D], [A A A]]   to:
// [A D A]
// [B D A]
// [C D A]