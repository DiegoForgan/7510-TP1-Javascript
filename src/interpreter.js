function Query () {
    var respetaFormato = false;
    var nombre = "";
    var valores = new Array();

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

    this.quitarEspacios = function (linea) {
        return linea.trim();
    }

    this.obtenerValores = function (linea) {
        var sinParentesisIzquierdo = linea.replace(/.*\(/,"");
        var sinParentesis = sinParentesisIzquierdo.replace(")","");
        var valoresParseados = sinParentesis.split(",");
        return (valoresParseados.map(this.quitarEspacios));
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
/////////////////////////////////////////////////////////////////////////////////////////////////////
function Hecho(nombreParseado, valoresParseados) {
    var nombre = nombreParseado;
    var valores = valoresParseados;

    this.getNombre = function () {
        return nombre;
    }

    this.getValores = function () {
        return valores;
    }

    
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
function Regla(lineaCompleta,nombreDeLaRegla) {
    var linea = lineaCompleta;
    var nombre = nombreDeLaRegla;
    var hechos = new Array();
    var simbolos = new Array();
    var lineaConValores = "";

    this.getNombre = function () {
        return nombre;
    }

    this.getHechosQueComponenLaRegla = function () {
        return hechos;
    }


    this.quitarEspacios =function (elemento) {
        return elemento.trim();
    }

    this.obtenerSimbolosDeLaRegla = function () {
        simbolos = linea.replace(/\).*$/,"");
        simbolos = simbolos.replace(/.*\(/,"");
        simbolos = simbolos.split(",");
        simbolos = simbolos.map(this.quitarEspacios);
    }

    this.reemplazarValoresEnLaRegla = function (listaDeValores){
        var aux = linea;
        for (var i = 0; i < simbolos.length; i++) {
            aux = aux.replace(new RegExp (simbolos[i],'g'),listaDeValores[i]);
        }
        lineaConValores = aux;
    }

    this.quitarEspacios = function (linea) {
        return linea.trim();
    }

    this.obtenerNombreDelHecho = function (linea) {
        var nombreHecho = linea.replace(/\(.*$/,"");
        return this.quitarEspacios(nombreHecho);
    }

    this.obtenerValoresDentroDelParentesis = function (linea) {
        var aux = linea.replace(/.*\(/,"");
        aux = aux.replace(")","");
        aux = aux.split(",");
        return (aux.map(this.quitarEspacios));
    }

    this.generarHechos = function () {
        var hechosAUX = [];
        console.log(lineaConValores);
        lineaConValores = lineaConValores.replace(/^.*:-/,"");
        hechosAUX = lineaConValores.split("),");
        for (var i = 0; i < hechosAUX.length; i++) {
            var hechoActual = hechosAUX[i];
            var nombreDelHechoActual = this.obtenerNombreDelHecho(hechoActual);
            var valoresDelHecho = this.obtenerValoresDentroDelParentesis(hechoActual);
            hechos.push(new Hecho(nombreDelHechoActual,valoresDelHecho));
        }
    }
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
function BaseDeDatos() {
    //Atributos de la base de datos
    var hechos = new Array();
    var reglas = new Array();
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

    this.quitarEspacios = function (linea) {
        return linea.trim();
    }

    this.obtenerNombreDelHechoORegla = function (linea) {
        return linea.replace(/\(.*$/,"");
    }

    //Obtiene los valores que se encuentran expresados dentro del parentesis
    this.obtenerValoresDentroDelParentesis = function (linea) {
        var sinParentesisIzquierdo = linea.replace(/.*\(/,"");
        var sinParentesis = sinParentesisIzquierdo.replace(")","");
        var valoresDelHecho = sinParentesis.split(",");
        return (valoresDelHecho.map(this.quitarEspacios));
    }

    //Agrega un HECHO a la base de datos para el posterior analisis.
    this.agregarUnHecho = function (linea) {
        hechos.push(new Hecho(this.obtenerNombreDelHechoORegla(linea),this.obtenerValoresDentroDelParentesis(linea)));
    }

    //Agrega una REGLA a la base de datos para el posterior analisis.
    this.agregarUnaRegla = function (linea) {
        var nuevaRegla = new Regla(linea,this.obtenerNombreDelHechoORegla(linea));
        nuevaRegla.obtenerSimbolosDeLaRegla();
        reglas.push(nuevaRegla);
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
    this.consultaEsUnHecho = function (nombreDeConsulta) {
        for (var i = 0; i < hechos.length; i++) {
            var nombreActual = hechos[i].getNombre();
            if (nombreActual === nombreDeConsulta){
                return true;
            }
        }
        return false;
    }

    //Verifica si ambas listas son iguales en su totalidad.
    this.SonIguales = function (valoresDelHecho, valoresDeLaConsulta) {
        for (var i = 0; i < valoresDelHecho.length; i++) {
            if (valoresDelHecho[i] != valoresDeLaConsulta[i]){
                return false;
            }
        }
        return true;
    }

     //Resuelve la query pedida pero para el caso de una REGLA.
    this.resolverRegla = function (unaConsulta) {
        var nombreDeConsulta = unaConsulta.getNombre();
        for (var i = 0; i < reglas.length; i++) {
            var nombreDeLaRegla = reglas[i].getNombre();
            if(nombreDeLaRegla === nombreDeConsulta){
                reglas[i].reemplazarValoresEnLaRegla(unaConsulta.getValores());
                reglas[i].generarHechos();
                var listaDeHechos = reglas[i].getHechosQueComponenLaRegla();
                console.log("VOY A CHEQUEAR TODOS LOS HECHOS");
                return listaDeHechos.every(this.resolverHecho);
            }
        }
        return false;
    }

    //Resuelve la query contrastando contra los HECHOS de la base devolviendo TRUE o FALSE segun el exito obtenido.
    this.resolverHecho = function (unaConsulta) {
        var valoresDeLaConsulta = unaConsulta.getValores();
        for (var i = 0; i < hechos.length; i++) {
            var valoresDelHecho = hechos[i].getValores();
            if (valoresDelHecho.length != valoresDeLaConsulta.length){continue;}
            var nombreDelHechoActual = hechos[i].getNombre();
            if (nombreDelHechoActual === unaConsulta.getNombre()){
                console.log(valoresDelHecho);
                console.log(valoresDeLaConsulta);
                if (this.SonIguales(valoresDelHecho,valoresDeLaConsulta)){
                    return true;
                }
            }
        }
        return false;
    }

   
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
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
    }

    this.checkQuery = function (query) {
        var consulta = new Query();
        if(bdd.getValidez() === false){return false;}
        if(consulta.chequearValidez(query) === false){return false;}
        //RESOLVER LA QUERY
        if(bdd.consultaEsUnHecho(consulta.getNombre()))
            {return bdd.resolverHecho(consulta);}
        else
            {return bdd.resolverRegla(consulta);}
    }

}

module.exports = Interpreter;
