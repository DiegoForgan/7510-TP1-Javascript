function BaseDeDatos() {
    //Atributos de la base de datos
    var hechos = new Array();
    var hechosDisponibles = new Array();
    var reglas = new Array();
    var reglasDisponibles = new Array();
    var respetaFormato = false;

    this.getValidez = function () {
        return respetaFormato;
    }

    this.obtenerNombre = function (linea) {
        return linea.replace(/\(.*$/,"");
    }

    //Recibe una linea y elimina el punto que se encuentra al final.
    this.quitarPuntoFinal = function (linea) {
        return linea.replace(".","");
    }

    //Devuelve TRUE si la linea que recibe corresponde a una regla, FALSE sino.        
    this.esUnaRegla = function (linea) {
        if (linea.search(":-") != -1) {return true;}
        return false;
    }

    //Agrega una REGLA a la base de datos para el posterior analisis.
    this.agregarUnaRegla = function (linea) {
        //var nuevaRegla = new Regla(linea,this.obtenerNombreDelHechoORegla(linea));
        //nuevaRegla.obtenerSimbolosDeLaRegla();
        //reglas.push(nuevaRegla);
        reglasDisponibles.push(this.obtenerNombre(linea));
    }

    //Agrega un HECHO a la base de datos para el posterior analisis.
    this.agregarUnHecho = function (linea) {
        hechos.push(linea.replace(".",""));
        hechosDisponibles.push(this.obtenerNombre(linea));
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
        console.log(hechos);
        console.log(hechosDisponibles);
        console.log(reglas);
        console.log(reglasDisponibles); 
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
    
    //Se encarga de verificar si TODAS las lineas cumplen con el formato pedido:
    //  1. Si todas cuentan con el punto al final de la linea.
    //  2. Si todas cuentan con parentesis de apertura y cierre.
    this.chequearFormatoDeLaBase = function (entrada) {
        var respetaPuntosFinales = entrada.every(this.chequearPuntoFinal);
        var respetaParentesis = entrada.every(this.chequearParentesis);
        respetaFormato = ((respetaPuntosFinales) && (respetaParentesis));
    }

    this.chequearFormatoDeLaConsulta = function (consulta) {
        return this.chequearParentesis(consulta);
    }

    //Funcion principal que pocesa el Stream que ingresa al sistema.
    this.procesarEntrada = function (entrada) {
        this.chequearFormatoDeLaBase(entrada);
        if (respetaFormato) {
            this.armarHechosYReglas(entrada);
        }
    }

    //Devuelve TRUE si la consulta corresponde a un HECHO.
    this.consultaEsUnHecho = function (nombreConsulta) {
        for (var i = 0; i < hechosDisponibles.length; i++) {
            console.log("estoy comparando " + nombreConsulta + "con " + hechosDisponibles[i]);
            if (nombreConsulta === hechosDisponibles[i]){
                return true;
            }
        }
        return false;
    }

    this.resolverHecho = function (consulta) {
        for (var i = 0; i < hechos.length; i++) {
            if (consulta === hechos[i]){
                console.log("FOUND!!!!!!!!!!");
                return true;
            }
        }
        console.log(":( NOT FOUND!!!!!!!!!!");
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
        //var consulta = new Query();
        if(bdd.getValidez() === false){return false;}
        if(bdd.chequearFormatoDeLaConsulta(query) === false){return false;}
        //RESOLVER LA QUERY
        if(bdd.consultaEsUnHecho(bdd.obtenerNombre(query)))
            {return bdd.resolverHecho(query);}
        else
            {return bdd.resolverRegla(query);}
    }

}

module.exports = Interpreter;
