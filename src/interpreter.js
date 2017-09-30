function Query () {
    var respetaFormato = false;
    var nombre = "";
    var valores = [];

    this.cargarDatos = function (linea) {
        nombre = this.obtenerNombre(linea);
        valores = this.obtenerValores(linea);
    }

    this.getNombre = function () {
        return nombre;
    }

    this.getValores = function () {
        return valores;
    }

    this.obtenerNombre = function (linea) {
        return linea.replace(/\(.*\)$/,"");
    }

    this.obtenerValores = function (linea) {
        return [];
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
    //Atributos de la base de datos
    var hechos = [];
    var reglas = [];
    var respetaFormato = false;

    //METODOS DE LA BASE DE DATOS

    //Devuelve una lista con los hechos de la base de datos.
    this.getHechos = function () {
        return hechos;
    }
    //Devuelve una lista con las reglas de la base de datos.
    this.getReglas = function () {
        return reglas;
    }

    //Devuelve TRUE si la BDD tiene un formato correcto y FALSE sino.
    this.getValidez = function () {
        return respetaFormato;
    }
        
    //Devuelve TRUE si la linea que recibe corresponde a una regla, FALSE sino.        
    this.esUnaRegla = function (linea) {
        if (linea.search(":-") != -1) {return true;}
        return false;
    }

    //Agrega un HECHO a la base de datos para el posterior analisis.
    this.agregarUnHecho = function (linea) {
        hechos.push(linea);
    }

    //Agrega una REGLA a la base de datos para el posterior analisis.
    this.agregarUnaRegla = function (linea) {
        reglas.push(linea);
    }

    //Revisa si la linea que recibe como parametro cuenta con el punto al final.
    this.chequearPuntoFinal = function (cadena) {
        return cadena.endsWith(".");
    }

    //Devuelve TRUE si la linea tiene parentesis de inicio y fin.
    this.chequearParentesis = function (cadena){
        if (cadena.search(/\(.*\)/) != -1) {
            return true;
        }
        return false;
    }

    //Recibe una linea y elimina el punto que se encuentra al final.
    this.quitarPuntoFinal = function (linea) {
        return linea.replace(".","");
    }

    //Se encarga de verificar si TODAS las lineas cumplen con el formato pedido:
    //  1. Si todas cuentan con el punto al final de la linea.
    //  2. Si todas cuentan con parentesis de apertura y cierre.
    this.chequearFormatoDeLaBase = function (entrada) {
        var respetaPuntosFinales = entrada.every(this.chequearPuntoFinal);
        var respetaParentesis = entrada.every(this.chequearParentesis);
        respetaFormato = ((respetaPuntosFinales) && (respetaParentesis));
    }

    //Esta funcion va agregando hechos y reglas a la base segun corresponda.
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

    //Funcion principal que pocesa el Stream que ingresa al sistema.
    this.procesarEntrada = function (entrada) {
        this.chequearFormatoDeLaBase(entrada);
        if (respetaFormato) {
            this.armarHechosYReglas(entrada);
        }
    }

    //Devuelve TRUE si la consulta corresponde a un HECHO.
    this.consultaEsUnHecho = function (unaConsulta) {
        return true;
    }

    //Resuelve la query contrastando contra los HECHOS de la base devolviendo TRUE o FALSE segun el exito obtenido.
    this.resolverHecho = function (unaConsulta) {
        return true;
    }

    //Resuelve la query pedida pero para el caso de una REGLA.
    this.resolverRegla = function (unaConsulta) {
        return true;
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
        console.log(consulta.getNombre());
        console.log(consulta.getValores());
        //RESOLVER LA QUERY
        if(bdd.consultaEsUnHecho(consulta)){bdd.resolverHecho(consulta);}
        bdd.resolverRegla(consulta);
    }

}

module.exports = Interpreter;
