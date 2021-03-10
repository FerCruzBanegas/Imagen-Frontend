<template>
  <table v-if="data !== null">
    <thead>
      <tr>
        <th scope="col">Señor (es)</th>
        <th scope="col">Nit</th>
        <th scope="col">Teléfono</th>
        <th scope="col">Ciudad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td data-label="Nombre">{{ data.business_name }}</td>
        <td data-label="Nit">{{ data.nit }}</td>
        <td data-label="Teléfono">{{ data.phone }}</td>
        <td data-label="Ciudad">{{ data.city.name }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  props: {
    data: {
      type: Object
    }
  },
}
</script>
<style scoped>
table {
  font-family: 'Roboto', sans-serif;
  font-size: 0.8em;
  border: 1px solid #ccc;
  border-collapse: collapse;
  margin: 0;
  padding: 0;
  width: 100%;
  table-layout: fixed;
}

table thead tr{
  background-color: rgb(90, 90, 90);
  color: white;
}

table tbody tr {
  background-color: rgb(212, 212, 212);
  border: 1px solid #ddd;
  padding: 0.35em;
}

table th,
table td {
  padding: 0.625em;
  text-align: center;
  font-weight: bold;
}

table th {
  font-size: 0.90em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

@media screen and (max-width: 600px) {
  table {
    border: 0;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>