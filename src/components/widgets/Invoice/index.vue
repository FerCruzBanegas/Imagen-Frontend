<template>
  <div class="invoice-box watermark">
    <div id="light-table">
      <div id="leftdivcontainer" class="clearfix">
        <div class="leftdiv">
          <img src="resources/images/logo.png" style="width:280px; height: 70px;"/>
        </div>
        <div class="leftdiv" style="margin-top: 0;">
          <p class="test" style="color: #656565;">
            <span style="font-size: 18px; font-weight: bold;">CASA MATRIZ - 0</span>
            <span>Calle Pedro Blanco Nº 1471</span>
            <span>Zona San Pedro</span>
            <span>Telf.: 249 3155 - 2493156</span>
            <span>La Paz - Bolivia</span>
          </p>
        </div>
        <div class="leftdiv" style="border: 2px solid #9e0207; border-radius: 7px;">
          <div style="text-align: left; margin-left: 15px; margin-bottom: 5px; margin-top: 5px;">
            <div style="color: #474747; font-weight: bold;">
              NIT: <span style="float: right; margin-right: 15px;">164692025</span>
            </div>
            <div style="color: #474747; font-weight: bold;">
              FACTURA Nº: <span style="float: right; margin-right: 15px;">00000179</span>
            </div>
            <div style="color: #474747; font-weight: bold;">
              Autorización Nº: <span style="float: right; margin-right: 15px; color: #000000; font-weight: bold;">361401000126793</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="light-table" style="margin-top: 30px;">
      <div id="leftdivcontainer" class="clearfix">
        <div class="leftdiv">
          &nbsp;
        </div>
        <div class="leftdiv" style="margin-top: 20px;">
          <span style="font-size: 55px; font-weight: bold;">FACTURA</span>
        </div>
        <div class="leftdiv">
          <p class="test2">
            <span style="color: #000000;">Actividad - Publicidad</span>
            <span style="font-size: 18px; font-weight: bold; color: #474747; letter-spacing: 0.3em;">ORIGINAL</span>
          </p>
        </div>
      </div>
    </div>
    <div id="light-table" style="margin-top: 20px; color: #000000;">
      <div style="border: 2px solid #9e0207; border-radius: 7px;">
        <div style="float: right; margin: 15px;"><b>NIT/CI: 1011931025</b></div>
        <div style="margin: 15px;">Santa Cruz de la Sierra, 15 Junio de 2020</div>
        <div style="margin: 15px;">Señor(es): BEBIDAS BOLIVIANAS BBO S.A.</div>
      </div>
    </div>
    <div id="light-table" style="margin-top: 5px;">
      <table id="invoice-table">
        <tr class="invoice_line" style="background-color: #FFDBDC;">
          <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">CANTIDAD</th>
          <th style="color: #9e0207; letter-spacing: 0.5em; padding:10px; width: 340px; font-weight: bold; font-size: 20px;">DETALLE</th>
          <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">P. UNIT.</th>
          <th style="color: #9e0207; padding:10px; width: 120px; font-weight: bold; font-size: 20px;">SUB TOTAL</th>
        </tr>
        <tr class="invoice_line" style="text-align: center;">
          <td style="color: #000000; font-size: 15px;">1</td>
          <td style="color: #000000; text-align: justify; font-size: 15px;">Alquiler publicitario ubicado en la ciudad de: El Alto: Calle 5T rectangular - frente a la estacion del teleferico Amarillo (Cara A) Correspondiente del 01/07/2020 al 31/07/2020</td>
          <td style="color: #000000; font-size: 15px;">10,350.00</td>
          <td style="color: #000000; font-size: 15px;">10,350.00</td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
        <tr class="invoice_line">
          <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 20px; font-weight: bold; padding:16px;">TOTAL Bs.</td>
          <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 16px; color: #000000; font-weight: bold; padding:16px; background: #FFDBDC;">10,350.00</td>
        </tr>
      </table>
    </div>
    <div id="light-table">
      <div style="border: 2px solid #9e0207; border-radius: 7px; color: black;">
        <div style="margin: 12px;"><b>Son:</b> Siete Mil Doscientos Treinta y Siete 10/100 Bolivianos</div>
      </div>
    </div>
    <!-- <div id="light-table" style="margin-top: 5px; margin-left: 10px; color: black;">
      <div style="float: right;">{!! QrCode::size(150)->generate('164692025|179|361401000126793|15/06/2020|7237.10|7237.10|0A-08-3E-D9-86|1011931025|0|0|0|0'); !!}</div>
      <div><b>Código de Control: &nbsp;&nbsp; 0A-08-3E-D9-86</b></div>
      <div><b>Fecha Límite de Emisión: &nbsp;</b>29-08-2020</div>
      <div style="margin-top: 10px; font-size: 11px; letter-spacing: 0.1em;">"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA&Iacute;S, EL USO IL&Iacute;CITO DE &Eacute;STA SER&Aacute; SANCIONADO DE ACUERDO A LEY."</div>
      <div style="font-size: 11px; color: black;">
        <strong>Ley N&deg; 453: Los medios de comunicación deben promover el respeto de los derechos de los usuarios y consumidores.</strong>
      </div>
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
}
</script>
<style scoped>
.invoice-box {
  max-width: 100%;
  margin: auto;
  padding: 30px;
  /*border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, .15);*/
  font-size: 16px;
  line-height: 24px;
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  color: #555;
}

#light-table {
  width: 100%;  
  padding-top: 0;
  padding-bottom: 0;
  text-align: left;
}

.leftdiv {
  float: left;
  position: relative;
  width: 33%; 
}

.leftdiv p {
  display: block;
  width: 75%;
  margin: 0 auto !important;
}

#leftdivcontainer {
  vertical-align: middle;
  width: 100%;
  text-align: center;
}

#light-table-paragraph {
  font-family: 'Droid Serif';
  font-size: 20px;
  color: #2e2e2e;
  text-align: center;
  line-height: 40px;
}

h3 {
  padding: 0 40px;
}

.clearfix:after {
  clear: both;
}

.clearfix:before,
.clearfix:after {
  content: " ";
  display: table;
}

.test span {
  display: block;
  white-space: pre;
  font-size:   10pt;
  line-height: 12pt;
}

.test2 span {
  display: block;
  font-size:   10pt;
  line-height: 23pt;
}

#invoice-table {
  border: 2px solid #9e0207;
  border-radius: 7px;
  border-spacing: 0;
  box-sizing: border-box;
  clear: both;
  margin: 2mm 0mm;
  height: 190mm;
  width: 100%;
}

#invoice-table th, td { border-left: 2px solid #9e0207; }
#invoice-table th:first-child, td:first-child { border-left: none; }
#invoice-table th { border-bottom: 2px solid #9e0207; }
#invoice-table td { vertical-align: top; font-size: 8pt; }
th { text-align: center; font-weight: normal; }
.amount { text-align: center; }
.invoice_line { height: 6mm; }
.invoice_line td, .invoice_line th { padding: 1mm; }

.watermark {
  background: url("{{ asset('/img/watermark.png') }}");
  background-size: 600px;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed; 
}
</style>
