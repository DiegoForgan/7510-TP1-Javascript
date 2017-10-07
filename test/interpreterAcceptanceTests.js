var expect = require("chai").expect;
var should = require('should');
var assert = require('assert');

var Interpreter = require('../src/interpreter');


describe("Interpreter", function () {

    var db = [
        "varon(juan).",
        "varon(pepe).",
        "varon(hector).",
        "varon(roberto).",
        "varon(alejandro).",
        "mujer(maria).",
        "mujer(cecilia).",
        "padre(juan, pepe).",
        "padre(juan, pepa).",
        "padre(hector, maria).",
        "padre(roberto, alejandro).",
        "padre(roberto, cecilia).",
        "hijo(X, Y) :- varon(X), padre(Y, X).",
        "hija(X, Y) :- mujer(X), padre(Y, X)."
    ];

    var numDB = [
        "add(zero, zero, zero).",
	    "add(zero, one, one).",
	    "add(zero, two, two).",
	    "add(one, zero, one).",
	    "add(one, one, two).",
	    "add(one, two, zero).",
	    "add(two, zero, two).",
	    "add(two, one, zero).",
	    "add(two, two, one).",
	    "subtract(X, Y, Z) :- add(Y, Z, X)."
    ];

    var interpreter = null;

    before(function () {
        // runs before all tests in this block
    });

    after(function () {
        // runs after all tests in this block
    });

    beforeEach(function () {
        // runs before each test in this block
        interpreter = new Interpreter();
        interpreter.parseDB(db);
    });

    afterEach(function () {
        // runs after each test in this block
    });


    describe('Interpreter Facts', function () {

        it('varon(juan) should be true', function () {
            assert(interpreter.checkQuery('varon(juan)'));
        });

        it('varon(maria) should be false', function () {
            assert(interpreter.checkQuery('varon(maria)') === false);
        });

        it('mujer(cecilia) should be true', function () {
            assert(interpreter.checkQuery('mujer(cecilia)'));
        });

        it('padre(juan, pepe) should be true', function () {
            assert(interpreter.checkQuery('padre(juan, pepe)') === true);
        });

        it('padre(mario, pepe) should be false', function () {
            assert(interpreter.checkQuery('padre(mario, pepe)') === false);
        });
        // TODO: Add more tests
    });

    describe('Interpreter Rules', function () {

        it('hijo(pepe, juan) should be true', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)') === true);
        });
        it('hija(maria, roberto) should be false', function () {
            assert(interpreter.checkQuery('hija(maria, roberto)') === false);
        });
        it('hijo(pepe, juan) should be true', function () {
            assert(interpreter.checkQuery('hijo(pepe, juan)'));
        });
        it('subtract(two, two, one) should be false', function () {
            interpreter.parseDB(numDB);
            assert(interpreter.checkQuery('subtract(two, two, one)') === false);
        });
        it('subtract(one, two, two) should be true', function () {
            interpreter.parseDB(numDB);
            assert(interpreter.checkQuery('subtract(one, two, two)') === true);
        });
        // TODO: Add more tests
    });

    describe('Bad Database Format', function () {

        it('Entry without final dot should be false', function () {
            interpreter.parseDB(["hijo(juan).","hijo(pepe)"]);
            assert(interpreter.checkQuery('hijo(pepe)') === false);
        });
        it('Entry without opening parenthesis should be false', function () {
            interpreter.parseDB(["hijojuan).","hijo(pepe)."]);
            assert(interpreter.checkQuery('hijo(juan)') === false);
        });
        it('Entry without closing parenthesis should be false', function () {
            interpreter.parseDB(["hijo(juan.","hijo(pepe)."]);
            assert(interpreter.checkQuery('hijo(juan)') === false);
        });
        it('Entry without any parenthesis should be false', function () {
            interpreter.parseDB(["hijojuan.","hijo(pepe)."]);
            assert(interpreter.checkQuery('hijo(juan)') === false);
        });
        // TODO: Add more tests
    });

    describe('Bad Query Format', function () {

        it('Query with final dot should be false', function () {
            assert(interpreter.checkQuery('hijo(juan).') === false);
        });
        it('Query without opening parenthesis should be false', function () {
            assert(interpreter.checkQuery('hijojuan)') === false);
        });
        it('Query without closing parenthesis should be false', function () {
            assert(interpreter.checkQuery('hijo(juan') === false);
        });
        it('Queryy without any parenthesis should be false', function () {
            assert(interpreter.checkQuery('hijojuan') === false);
        });
        // TODO: Add more tests
    });
    


});


