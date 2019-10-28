console.log(1);
console.log(2);
console.log(3);

doNothing(23, x => {
    console.log('async');
})

console.log(45);
console.log(5);
console.log(6);
console.log(7);


function doNothing(arg, callback) {
    callback(arg);
}