//A partir de una cadena de caracteres, elimina espacios a izquierda y derecha.
function quitarEspacios(cadena) {
    return cadena.trim();
}
//Dada una cadena de caracteres correspondiente a una regla, hecho o query, devuelve el nombre de la misma.
function obtenerNombre(linea) {
    return linea.replace(/\(.*$/,"");
}
//Dada linea, obtiene los valores que se encuentran dentro de los parentesis.
function obtenerElementosDentroDelPrimerParentesis(linea) {
    var aux = linea.replace(/\).*$/,"");
    aux = aux.replace(/.*\(/,"");
    aux = aux.split(",");
    return (aux.map(quitarEspacios));
}
//Objeto Regla
function Regla(linea) {
    //Atributos privados del objeto Regla.
    var reglaCompleta = linea;
    var listaDeHechos = new Array();
    var simbolos = new Array();

    //Metodos del objeto Regla
    this.getHechos = function () {
        return listaDeHechos;
    }

    this.getNombre = function () {
        return obtenerNombre(reglaCompleta);
    }

    //Obtiene los elementos que componen la regla en su version simbolica, EJ: X, Y, Z
    this.obtenerSimbolosDeLaRegla = function (linea) {
        simbolos = obtenerElementosDentroDelPrimerParentesis(linea);
    }
    //Reemplaza los simbolos obtenidos en la funcion anterior por los valores ingresados en la query.
    this.reemplazarValoresEnLaRegla = function (listaDeValores){
        var aux = reglaCompleta;
        for (var i = 0; i < simbolos.length; i++) {
            aux = aux.replace(new RegExp (simbolos[i],'g'),listaDeValores[i]);
        }
        return aux;
    }
    //A partir de la regla con sus valores reemplazados, devuelve un vector con cada uno de los hechos que la componen.
    this.obtenerHechos = function (reglaConValores) {
        var hechosAUX = [];
        reglaConValores = reglaConValores.replace(/^.*:-/,"");
        hechosAUX = reglaConValores.split("),");
        for (var i = 0; i < hechosAUX.length; i++) {
            if (hechosAUX[i].endsWith(")")){
                continue;
            }
            else{
                hechosAUX[i] = hechosAUX[i].concat(")");
            }
        }
        return hechosAUX.map(quitarEspacios);
    }
    //Devuelve los hechos.
    this.obtenerListaDeHechosConValoresReemplazados = function (listaDeValores) {
        var reglaConValoresReemplzados = this.reemplazarValoresEnLaRegla(listaDeValores);
        return this.obtenerHechos(reglaConValoresReemplzados);
    }
}

//Objeto Base de Datos
function BaseDeDatos() {
    //Atributos privados de la base de datos
    var hechos = new Array();
    var hechosDisponibles = new Array();
    var reglas = new Array();
    var reglasDisponibles = new Array();
    var respetaFormato = false;

    //Metodos del objeto Base de Datos
    this.getValidez = function () {
        return respetaFormato;
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
        var nuevaRegla = new Regla(linea);
        nuevaRegla.obtenerSimbolosDeLaRegla(linea);
        reglas.push(nuevaRegla);
        var nombreDeLaRegla = obtenerNombre(linea);
        if (reglasDisponibles.indexOf(nombreDeLaRegla) == -1){
            reglasDisponibles.push(nombreDeLaRegla);
        }
    }

    //Agrega un HECHO a la base de datos para el posterior analisis.
    this.agregarUnHecho = function (linea) {
        hechos.push(linea.replace(".",""));
        var nombreDelHecho = obtenerNombre(linea);
        if (hechosDisponibles.indexOf(nombreDelHecho) == -1){
            hechosDisponibles.push(nombreDelHecho);
        }
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
    //Chequea el formato de la consulta ingresada, en este caso revisa que cumpla con los parentesis.
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
            if (nombreConsulta === hechosDisponibles[i]){
                return true;
            }
        }
        return false;
    }
    // Resuelve un hecho a partir de una consulta. Devuelve TRUE si el hecho existe y FALSE caso contrario.
    this.resolverHecho = function (consulta) {
        for (var i = 0; i < hechos.length; i++) {
            if (consulta === hechos[i]){
                return true;
            }
        }
        return false;
    }
    //Resuelve una regla a partir de los hechos que la componen, si todos los hechos existen devuelve TRUE, Sino FALSE.
    this.resolverRegla = function (consulta) {
        var valoresDeLaConsulta = obtenerElementosDentroDelPrimerParentesis(consulta);
        var hechosAResolver = this.obtenerHechosAPartirDeLaConsulta(obtenerNombre(consulta),obtenerElementosDentroDelPrimerParentesis(consulta));
        return (hechosAResolver.every(this.resolverHecho));
    }

    // Obtiene los hechos con sus valores reemplazados a partir de los valores que figuran en la consulta.
    this.obtenerHechosAPartirDeLaConsulta = function (nombreConsulta,valoresConsulta) {
        for (var i = 0; i < reglas.length; i++) {
            if(reglas[i].getNombre() === nombreConsulta){
                return reglas[i].obtenerListaDeHechosConValoresReemplazados(valoresConsulta);
            }
        }
    }
   
}

var Interpreter = function () {
    var bdd = new BaseDeDatos();
    
    this.parseDB = function (userEntry) {
        bdd.procesarEntrada(userEntry);
    }

    this.checkQuery = function (query) {
        if(bdd.getValidez() === false){return false;}
        if(bdd.chequearFormatoDeLaConsulta(query) === false){return false;}
        //RESOLVER LA QUERY
        if(bdd.consultaEsUnHecho(obtenerNombre(query)))
            {return bdd.resolverHecho(query);}
        else
            {return bdd.resolverRegla(query);}
    }

}

module.exports = Interpreter;
