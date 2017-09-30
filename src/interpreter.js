function Query () {
    var respetaFormato = false;
    var nombre = "";
    var valores = [];

    this.cargarDatos = function (linea) {
        return;
    }

    this.verificarParentesis = function (linea) {
        return (linea.search(/\(.*\)$/) != -1);
    }
    this.chequearValidez = function (linea) {
        if (this.verificarParentesis(linea)) {
            this.cargarDatos(linea);
            respetaFormato = true;
        } else {
            respetaFormato = false
        }
        return respetaFormato;
    }

}

function BaseDeDatos() {
    var hechos = [];
    var reglas = [];
    var respetaFormato = false;

    this.getHechos = function () {
        return hechos;
    }

    this.getReglas = function () {
        return reglas;
    }

    this.getValidez = function () {
        return respetaFormato;
    }
        
    this.esUnaRegla = function (linea) {
        if (linea.search(":-") != -1) {return true;}
        return false;
    }

    this.agregarUnHecho = function (linea) {
        hechos.push(linea);
    }

    this.agregarUnaRegla = function (linea) {
        reglas.push(linea);
    }

    this.chequearPuntoFinal = function (cadena) {
        return cadena.endsWith(".");
    }

    this.chequearParentesis = function (cadena){
        if (cadena.search(/\(.*\)/) != -1) {
            return true;
        }
        return false;
    }

    this.quitarPuntoFinal = function (linea) {
        return linea.replace(".","");
    }

    this.chequearFormatoDeLaBase = function (entrada) {
        var respetaPuntosFinales = entrada.every(this.chequearPuntoFinal);
        var respetaParentesis = entrada.every(this.chequearParentesis);
        respetaFormato = ((respetaPuntosFinales) && (respetaParentesis));
    }

    this.armarHechosYReglas = function (entrada) {
        for (var i = 0; i < entrada.length; i++) {
            var elemento = entrada[i];
            elemento = this.quitarPuntoFinal(elemento);
            if (this.esUnaRegla(elemento)) {
                this.agregarUnaRegla(elemento);
            } else {
                this.agregarUnHecho(elemento);   
            }   
        } 
    }

    this.procesarEntrada = function (entrada) {
        this.chequearFormatoDeLaBase(entrada);
        if (respetaFormato) {
            this.armarHechosYReglas(entrada);
        }
    }
}

var Interpreter = function () {
    var bdd = new BaseDeDatos();
//QUITARLO
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
    
    this.quitarEspacios = function (linea) {
        return linea.trim();
    }

    this.parseDB = function (userEntry) {
        var sinEspacios = db.map(this.quitarEspacios);
        bdd.procesarEntrada(db);
        console.log(bdd.getHechos());
        console.log(bdd.getReglas());
        console.log(bdd.getValidez());
    }

    this.checkQuery = function (query) {
        var consulta = new Query();
        if(bdd.getValidez() === false){return false;}
        if(consulta.chequearValidez(query) === false){return false;}
        //RESOLVER LA QUERY
        
        return true;
    }

}

module.exports = Interpreter;
