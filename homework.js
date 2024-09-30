
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let iteration = [];
let xValues = [];
let yValues = [];
let n, Xtarget;

const askQuestion = (query) => {
    return new Promise(resolve => rl.question(query, resolve));
};

const main = async () => {
    n = parseInt(await askQuestion("Enter the number of data points: "), 10);
    Xtarget = parseFloat(await askQuestion("Enter the value of Xtarget: "));
    
    for (let i = 0; i < n; i++) {
        let x = parseFloat(await askQuestion("Enter the value of x-" + (i+1) + ": "));
        let y = parseFloat(await askQuestion("Enter the value of y-" + (i+1) + ": "));
        iteration.push(i);
        xValues.push(x);
        yValues.push(y);
    }

    const LinearSpline = (x, y, Xtarget) => {
        let i = 0;
        while (x[i] < Xtarget) {
            i++;
        }
        let m = (y[i] - y[i - 1]) / (x[i] - x[i - 1]);
        let c = y[i] - m * x[i];
        return m * Xtarget + c;
    };

    let result = LinearSpline(xValues, yValues, Xtarget);
    console.log("Value at Xtarget: " + result);

    rl.close(); 
};

main();