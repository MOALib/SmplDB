#!/usr/bin/env node

// SmplDB
// Sample program


// MIT License
// 
// Copyright (c) 2021 MXPSQL
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const SmplDB = require("./index.js");

console.log(SmplDB.getVersion());

var db = SmplDB.loadDB("test.smpldb");

console.log(db.remCollection("1"));

var collection2 = db.getCollection("collection2");

var akey2 = collection2.get("anotherkey2");
console.log(akey2);

var collection3 = db.getCollection("collection3");
console.log(collection3.get("aout"));

collection3.set("aout", String(Math.random()));
console.log(collection3.get("aout"))

collection3.set("ain", "21");
console.log(collection3.get("ain"));

db.setCollection("collection4");
var collection4 = db.getCollection("collection4");
db.remCollection("collection4");
console.log(collection4);

console.log(db.returnDB());
console.log(collection3.return());


db.dump();