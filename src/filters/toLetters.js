var numeroALetras = (function() {
  function Unidades(num){
        switch(num)
        {
            case 1: return 'Un';
            case 2: return 'Dos';
            case 3: return 'Tres';
            case 4: return 'Cuatro';
            case 5: return 'Cinco';
            case 6: return 'Seis';
            case 7: return 'Siete';
            case 8: return 'Ocho';
            case 9: return 'Nueve';
        }

        return '';
    }//Unidades()

    function Decenas(num){

        let decena = Math.floor(num/10);
        let unidad = num - (decena * 10);

        switch(decena)
        {
            case 1:
                switch(unidad)
                {
                    case 0: return 'Diez';
                    case 1: return 'Once';
                    case 2: return 'Doce';
                    case 3: return 'Trece';
                    case 4: return 'Catorce';
                    case 5: return 'Quince';
                    default: return 'Dieci' + Unidades(unidad).toLowerCase();
                }
            case 2:
                switch(unidad)
                {
                    case 0: return 'Veinte';
                    default: return 'Veinti' + (function () {
                      if (Unidades(unidad) == 'Dos')
                        return "d\u00f3s";
                      else if (Unidades(unidad) == 'Tres')
                        return "tr\u00e9s";
                      else
                        return Unidades(unidad).toLowerCase();
                    })();
                }
            case 3: return DecenasY('Treinta', unidad);
            case 4: return DecenasY('Cuarenta', unidad);
            case 5: return DecenasY('Cincuenta', unidad);
            case 6: return DecenasY('Sesenta', unidad);
            case 7: return DecenasY('Setenta', unidad);
            case 8: return DecenasY('Ochenta', unidad);
            case 9: return DecenasY('Noventa', unidad);
            case 0: return Unidades(unidad);
        }
    }//Unidades()

    function DecenasY(strSin, numUnidades) {
        if (numUnidades > 0)
            return strSin + ' y ' + Unidades(numUnidades)

        return strSin;
    }//DecenasY()

    function Centenas(num) {
        let centenas = Math.floor(num / 100);
        let decenas = num - (centenas * 100);

        switch(centenas)
        {
            case 1:
                if (decenas > 0)
                    return 'Ciento ' + Decenas(decenas);
                return 'Cien';
            case 2: return 'Doscientos ' + Decenas(decenas);
            case 3: return 'Trescientos ' + Decenas(decenas);
            case 4: return 'Cuatrocientos ' + Decenas(decenas);
            case 5: return 'Quinientos ' + Decenas(decenas);
            case 6: return 'Seiscientos ' + Decenas(decenas);
            case 7: return 'Setecientos ' + Decenas(decenas);
            case 8: return 'Ochocientos ' + Decenas(decenas);
            case 9: return 'Novecientos ' + Decenas(decenas);
        }

        return Decenas(decenas);
    }//Centenas()

    function Seccion(num, divisor, strSingular, strPlural) {
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let letras = '';

        if (cientos > 0)
            if (cientos > 1)
                letras = Centenas(cientos) + ' ' + strPlural;
            else
                letras = strSingular;

        if (resto > 0)
            letras += '';

        return letras;
    }//Seccion()

    function Miles(num) {
        let divisor = 1000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMiles = Seccion(num, divisor, 'Un Mil', 'Mil');
        let strCentenas = Centenas(resto);

        if(strMiles == '')
            return strCentenas;

        return strMiles + ' ' + strCentenas;
    }//Miles()

    function Millones(num) {
        let divisor = 1000000;
        let cientos = Math.floor(num / divisor)
        let resto = num - (cientos * divisor)

        let strMillones = Seccion(num, divisor, 'Un Millon ', 'Millones ');
        let strMiles = Miles(resto);

        if(strMillones == '')
            return strMiles;

        return strMillones + strMiles;
    }//Millones()

    return function NumeroALetras(num, currency) { 
      currency = currency || {}; 
      let data = { 
        numero: num, 
        enteros: Math.floor(num), 
        centavos: (((Math.round(num * 100)) - (Math.floor(num) * 100))), 
        letrasCentavos: '', 
        letrasMonedaPlural: 
        currency.plural || 'Bolivianos'
      };

      data.letrasCentavos = ' ' + (function () {
        if (data.centavos > 9)
          return data.centavos + '/100 ' + data.letrasMonedaPlural;
        else
          return '0' + data.centavos + '/100 ' + data.letrasMonedaPlural;
      })();

      if(data.enteros == 0)
        return 'CERO' + data.letrasCentavos;
      if (data.enteros == 1)
        return Millones(data.enteros) + data.letrasCentavos;
      else
        return Millones(data.enteros) + data.letrasCentavos;
    };
});

module.exports = numeroALetras()