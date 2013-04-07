"use strict";

var mongoose = require( "mongoose" );


var PinSchema = new mongoose.Schema({

});

module.exports = mongoose.model( "pin", PinSchema );