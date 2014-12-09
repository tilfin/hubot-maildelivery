/*
 * main.js
 */
var processor = require("./processor");

process.stdin.pipe(processor(function(){}));
