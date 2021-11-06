#!/bin/false

// SmplDB

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


// imports
const TOML = require("@ltd/j-toml");
const fs = require("node:fs");

// private variables
const version = require("./package.json").version;



// private functions
function stringCompress(stringtobecompressed){
    var output = stringtobecompressed;
    return output;
}

function isFunction(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

// classes

// collection class
class SmplDB_Collection{
    #kvp = {};

    set = (key, value) => {
        if(isFunction(value)){
            throw new SyntaxError("Functions are not supported");
        }

        this.#kvp[key] = value;
    };

    get = (key) => {
        return this.#kvp[key];
    }

    rem = (key) => {
        delete this.#kvp[key];
    }

    list = () => {
        var list = [];

        for(var i in this.#kvp){
            list.push(i);
        }

        return list;
    }

    return = () => {
        return this.#kvp
    }
}

// Database class
class SmplDB_Engine{
    // private
    #collection = {};
    #collectionBuffer = {};

    // public
    file = "";
    autodump = true;


    constructor(file="", autodump=true){
        this.autodump = autodump;
        this.file = file;

        this.#collectionBuffer = TOML.parse(fs.readFileSync(file));

        for(var coll in this.#collectionBuffer){
            this.#collection[coll] = new SmplDB_Collection();

            var acoll = this.#collection[coll];

            for(var i in this.#collectionBuffer[coll]){
                var value = this.#collectionBuffer[coll][i];

                acoll.set(i, value);
            }
        }

        this.#collectionBuffer = {};
    }


    returnDB = () => {
        return this.#collection;
    }



    setCollection = (key) => {
        try{
            this.#collection[key] = new SmplDB_Collection();
            return true;
        }
        catch(e){
            return false;
        }
    }

    getCollection = (key) => {
        try{
            return this.#collection[key];
        }
        catch(e){
            return false;
        }
    };

    remCollection = (key) => {
        try{
            delete this.#collection[key];
            return true;
        }
        catch(e){
            return false;
        }
    }

    listCollection = () => {
        var list = [];
        for(var i in this.#collection){
            list.push(i);
        }

        return list;
    }

    #autodump = () => {
        if(this.autodump){
            dump();
        }
    }

    localDump = () => {
        this.#collectionBuffer = {};

        var list = this.listCollection();

        for(var i of list){

            this.#collectionBuffer[i] = {};

            for(var i2 in this.#collection[i]){
                var list2 = this.#collection[i].list();
                for(var i3 of list2){
                    this.#collectionBuffer[i][i3] = this.#collection[i].get(i3);
                }
            }
        }

        for(var i of list){
            this.#collectionBuffer[i] = TOML.Section(this.#collectionBuffer[i]);
        }

        this.#collectionBuffer[ TOML.commentFor(Object.keys(this.#collectionBuffer)[0]) ] = " This thing was made with SmplDB, MXPSQL wrote it";

        // console.log(this.#collectionBuffer);

        var stringjy = TOML.stringify(this.#collectionBuffer);

        var result = "";

        for(var i of stringjy){
            result += i;
            result += "\n";
        }

        return result;
    }

    dump = () => {
        try{
            var result = this.localDump();

            fs.writeFileSync(this.file, result);
        }
        catch(e){
            return false;
        }
    }
}


// exports
const loadDB = (file="", autodump=true) => {return new SmplDB_Engine(file, autodump);};

const getVersion = () => {return version;};


loadDB("test.smpldb").localDump();

// really export them out
module.exports.loadDB = loadDB;
module.exports.getVersion = getVersion;