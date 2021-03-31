<template>
  <div class="container">
    <modal-form :title="'Registrar Comprobante'" :visible="visibleForm" @hide="closeModalForm">
      <!-- <pre>{{ $data }}</pre> -->
      <div v-if="showCategoryVoucher" class="middle">
        <label>
          <input type="radio" name="radio" value="invoice" v-model="voucher" />
          <div class="front-end box">
            <span>Factura</span>
          </div>
        </label>
        <label>
          <input type="radio" name="radio" value="sale" v-model="voucher" />
          <div class="back-end box">
            <span>Nota</span>
          </div>
        </label>
        <div class="row my-2">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <b-button
              @click="showFormVoucher"
              variant="danger" 
              class="float-right mr-2"
            >Generar <i class="fa fa-arrow-right" aria-hidden="true"></i></b-button>
          </div>
        </div>
      </div>
      <div v-if="showVoucherInvoice">
        <a-spin :spinning="success">
          <div class="container">
            <div class="row justify-content-end">
              <div class="col-md-4">
                <h1 class="font-weight-bold"><center>FACTURA</center></h1>
              </div>
              <div class="col-md-4">
                <b-button
                  size="sm"
                  @click="backToCategoryVoucher"
                  variant="danger" 
                  class="float-right mr-2"
                >Volver <i class="fa fa-arrow-left" aria-hidden="true"></i></b-button>
              </div>
            </div>           
            <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
              <legend>Datos Generales:</legend>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="office">Sucursal * :</label>
                  </strong>
                  <b-form-group label-for="office_id" :invalid-feedback="errors.first('office_id')" :state="!errors.has('office_id')">
                    <v-select
                      label="description"
                      v-model="invoice.office_id" 
                      :options="offices"
                      :reduce="office => office.id"
                      :state="errors.has('office_id') ? false : null"
                      v-validate="'required'"
                      data-vv-name="office_id"
                      data-vv-as="oficina"
                    ></v-select>
                  </b-form-group>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="name">Fecha Emisión * :</label>
                  </strong>
                  <b-form-group :invalid-feedback="errors.first('invoice.date')" :state="!errors.has('invoice.date')">
                    <b-form-input
                      v-model="invoice.date" 
                      :state="errors.has('invoice.date') ? false : null"
                      v-validate="'required'"
                      data-vv-name="invoice.date"
                      data-vv-as="fecha"
                      type="date"
                    ></b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="name">Cliente * :</label>
                  </strong>
                  <b-form-group
                    :invalid-feedback="errors.first('invoice.customer_id.id')"
                    :state="!errors.has('invoice.customer_id.id')"
                  >
                    <v-select
                      label="business_name"
                      :filterable="false"
                      :options="customers"
                      v-model="invoice.customer_id"
                      @search="onSearchCustomer"
                      :state="errors.has('invoice.customer_id.id') ? false : null"
                      v-validate="'required'"
                      data-vv-name="invoice.customer_id.id"
                      data-vv-as="cliente"
                    >
                      <template slot="no-options">Buscar clientes..</template>
                      <template slot="option" slot-scope="customer">
                        <div>
                          <strong>{{ customer.business_name }}</strong>
                        </div>
                      </template>
                      <template slot="selected-option" slot-scope="customer">
                        <div>
                          <strong>{{ customer.business_name }}</strong>
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                  <div v-if="showNitName">
                    <strong>
                      <label for="invoice.nit_name">Nombre / Razón Social * :</label>
                    </strong>
                    <b-form-group label-for="invoice.nit_name" :invalid-feedback="errors.first('invoice.nit_name')" :state="!errors.has('invoice.nit_name')">
                      <b-form-input 
                        v-model="invoice.nit_name"
                        :state="errors.has('invoice.nit_name') ? false : null"
                        v-validate="'required|min:3|max:120'"
                        data-vv-name="invoice.nit_name"
                        data-vv-as="nombre factura"
                        type="text"
                        placeholder="Señor(es)"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <b-button @click="setNewCustomer" variant="link" style="text-decoration: underline;">
                    [+ Emitir factura con otro nombre y NIT/CI]
                  </b-button>
                  <b-button size="sm" pill id="popover-target-1" variant="outline-dark">
                    <i class="fa fa-info-circle"></i>
                  </b-button>
                  <b-popover target="popover-target-1" triggers="hover" placement="right">
                    <template v-slot:title>Nota</template>
                    Se habilitará los campos para agregar un nuevo nombre de cliente y los datos de NIT/C.I.
                  </b-popover>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="invoice.nit">NIT / C.I. * :</label>
                  </strong>
                  <b-form-group :invalid-feedback="errors.first('invoice.nit')" :state="!errors.has('invoice.nit')">
                    <b-form-input 
                      v-model="invoice.nit"
                      :state="errors.has('invoice.nit') ? false : null"
                      v-validate="'required|min:3|max:16'"
                      data-vv-name="invoice.nit"
                      data-vv-as="nit/ci"
                      type="text"
                    ></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </fieldset>
            <div class="row mt-2">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="border border-dark">
                  <div class="container">
                    <div class="row">
                      <div class="col-sm-8 my-2">
                        <div class="d-table-cell w-100">
                          <v-select
                            label="name"
                            :filterable="false"
                            :options="productsList"
                            v-model="product"
                            @search="onSearchProduct"
                          >
                            <template slot="no-options">Buscar productos..</template>
                            <template slot="option" slot-scope="product">
                              <div>
                                <strong>{{ product.name }}</strong>
                              </div>
                            </template>
                            <template slot="selected-option" slot-scope="product">
                              <div>
                                <strong>{{ product.name }}</strong>
                              </div>
                            </template>
                          </v-select>
                        </div>
                        <div class="d-table-cell align-middle">
                          <b-button title="Agregar Producto" @click="addProduct" style="height: 2.5em;" size="sm" class="ml-2" variant="dark">
                            <i class="fa fa-plus-circle" aria-hidden="true"></i>
                          </b-button>
                        </div>
                        <div class="d-table-cell align-middle">
                          <b-button title="Recargar Datos" @click="getProductsQuotation" style="height: 2.5em;" size="sm" class="mx-2" variant="success">
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                          </b-button>
                        </div>
                        <div class="d-table-cell align-middle">
                          <b-button title="Borrar Todos" @click="removeAllProducts" style="height: 2.5em;" size="sm" variant="danger">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                          </b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div id="light-table"  class="table-responsive" style="margin-top: 5px;">
                  <table id="invoice-table" class="table" >
                    <tr class="invoice_line" style="background-color: #FFDBDC;">
                      <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">CANTIDAD</th>
                      <th style="color: #9e0207; letter-spacing: 0.5em; padding:10px; width: 340px; font-weight: bold; font-size: 20px;">DETALLE</th>
                      <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">P. UNIT.</th>
                      <th style="color: #9e0207; padding:10px; width: 120px; font-weight: bold; font-size: 20px;">SUB TOTAL</th>
                    </tr>
                    <tr v-for="(product, index) in products" :key="index" class="invoice_line" style="text-align: center;">
                      <td style="color: #000000; font-size: 15px;">
                        <p style="margin-bottom: 0;">&nbsp;</p>
                        <b-form-input 
                          style="font-size: 16px; font-weight: bold;"
                          v-model="product.quantity" 
                          @focus="$event.target.select()" 
                          class="text-center" 
                          type="number" 
                          min="1" 
                          @keydown="filterKey" 
                          @keyup="change(product)">
                        </b-form-input>
                      </td>
                      <td style="color: #000000; text-align: justify; font-size: 15px;">
                        <p style="text-align: center; margin-bottom: 0; font-weight: bold;">{{ product.name }}</p>
                        <!-- <b-form-input
                          v-model="product.description" 
                          placeholder="Concepto">
                        </b-form-input> -->
                        <b-form-textarea
                          rows="3"
                          style="font-size: 12px; font-weight: bold;border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                          v-model="product.description">
                        </b-form-textarea>
                      </td>
                      <td style="color: #000000; font-size: 15px;">
                        <p style="margin-bottom: 0;">&nbsp;</p>
                        <b-form-input style="font-size: 16px; font-weight: bold;" class="text-center" v-model.lazy="product.price" v-money="money"></b-form-input>
                      </td>
                      <td style="color: #000000; font-size: 16px; font-weight: bold;">
                        <p style="margin-bottom: 0; ">&nbsp;</p>
                        <span>{{ total(product) | currency }}</span>
                        <b-button pill class="ml-2 btn-close" @click="removeItem(index)" size="sm" variant="dark"><i class="fa fa-close"></i></b-button>
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                    </tr>
                    <tr class="invoice_line">
                      <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 20px; font-weight: bold; padding:16px;">TOTAL Bs.</td>
                      <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 20px; color: #000000; font-weight: bold; padding:16px; background: #FFDBDC;">{{ grandTotal | currency }}</td>
                    </tr>
                  </table>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <strong>
                      <label for="invoice.summary">Resumen (Glosa para reporte):</label>
                    </strong>
                    <b-form-group label-for="invoice.summary" :invalid-feedback="errors.first('invoice.summary')" :state="!errors.has('invoice.summary')">
                      <b-form-textarea
                        v-model="invoice.summary"
                        :state="errors.has('invoice.summary') ? false : null"
                        v-validate="'min:3|max:500'"
                        data-vv-name="invoice.summary"
                        data-vv-as="resumen"
                        placeholder="Ésta descripción solo será visible en los reportes contables."
                        rows="2"
                        style="font-size: 12px; font-weight: bold;border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                      ></b-form-textarea>
                    </b-form-group>
                  </div>
                </div>
                <div v-if="error">
                  <b-alert show variant="warning">
                    <h4 class="alert-heading">Revisa los siguientes errores!</h4>
                    <ul id="v-for-object">
                      <li v-for="value in error">
                        {{ value[0] }}
                      </li>
                    </ul>
                  </b-alert>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <strong>
                  <label for="invoice.title">Título:</label>
                </strong>
                <b-form-group label-for="invoice.title" :invalid-feedback="errors.first('invoice.title')" :state="!errors.has('invoice.title')">
                  <b-form-input 
                    v-model="invoice.title"
                    :state="errors.has('invoice.title') ? false : null"
                    v-validate="'max:120'"
                    data-vv-name="invoice.title"
                    data-vv-as="titulo"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <strong>
                  <label for="invoice.footer">Pie de página:</label>
                </strong>
                <b-form-group label-for="invoice.footer" :invalid-feedback="errors.first('invoice.footer')" :state="!errors.has('invoice.footer')">
                  <b-form-input 
                    v-model="invoice.footer"
                    :state="errors.has('invoice.footer') ? false : null"
                    v-validate="'max:120'"
                    data-vv-name="invoice.footer"
                    data-vv-as="pie de página"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div>
              <strong>Agregar detalle a la Factura</strong>
              <b-button @click="addItemDetail" class="ml-2" pill size="sm" variant="danger">
                <i class="fa fa-plus-circle" aria-hidden="true"></i>
              </b-button>
            </div><hr style="margin: 3px; border: 1px solid #6a7a84;">
            <div class="row">
              <div v-for="(detail, index) in details" :key="index" class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <b-input-group>
                  <b-form-input 
                    v-model="detail.description"
                    type="text"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button @click="deleteItemDetail(index)" size="sm" text="Button" variant="dark">
                      <i class="fa fa-close" aria-hidden="true"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </div>
            <b-popover
              target="invoice-confirm"
              triggers="click"
              :show.sync="popoverInvoice"
              placement="auto"
              container="my-container"
              ref="popover"
            >
              <template #title>
                Nota
              </template>
              <div>
                <p>Realmente desea emitir esta factura?</p>
                <b-button class="mr-2" @click="onClosePopoverInvoice" size="sm" variant="danger">NO</b-button>
                <b-button @click="submit" size="sm" variant="dark">SI</b-button>
              </div>
            </b-popover>
            <div class="row my-2">
              <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                <div>
                  Una vez registrados los datos no se podrán modificar.
                </div>
              </div>
              <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                <b-button 
                  id="invoice-confirm"
                  ref="button"
                  class="float-right mr-2"
                >Generar Factura</b-button>
                <b-button
                  variant="dark" 
                  @click="viewInvoice" 
                  class="float-right mr-2"
                >Vista Previa <i class="fa fa-search-plus" aria-hidden="true"></i></b-button>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
      <div v-if="showVoucherNote">
        <a-spin :spinning="success">
          <div class="container">
            <div class="row justify-content-end">
              <div class="col-md-4">
                <h1 class="font-weight-bold"><center>NOTA DE REMISION</center></h1>
              </div>
              <div class="col-md-4">
                <b-button
                  size="sm"
                  @click="backToCategoryVoucher"
                  variant="danger" 
                  class="float-right mr-2"
                >Volver <i class="fa fa-arrow-left" aria-hidden="true"></i></b-button>
              </div>
            </div>
            <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
              <legend>Datos Generales:</legend>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="office">Sucursal * :</label>
                  </strong>
                  <b-form-group label-for="office_id" :invalid-feedback="errors.first('office_id')" :state="!errors.has('office_id')">
                    <v-select
                      label="description"
                      v-model="note.office_id" 
                      :options="offices"
                      :reduce="office => office.id"
                      :state="errors.has('office_id') ? false : null"
                      v-validate="'required'"
                      data-vv-name="office_id"
                      data-vv-as="oficina"
                    ></v-select>
                  </b-form-group>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="name">Fecha Emisión * :</label>
                  </strong>
                  <b-form-group :invalid-feedback="errors.first('note.date')" :state="!errors.has('note.date')">
                    <b-form-input
                      v-model="note.date" 
                      :state="errors.has('note.date') ? false : null"
                      v-validate="'required'"
                      data-vv-name="note.date"
                      data-vv-as="fecha"
                      type="date"
                    ></b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="name">Cliente * :</label>
                  </strong>
                  <b-form-group
                    :invalid-feedback="errors.first('note.customer_id.id')"
                    :state="!errors.has('note.customer_id.id')"
                  >
                    <v-select
                      label="business_name"
                      :filterable="false"
                      :options="customers"
                      v-model="note.customer_id"
                      @search="onSearchCustomer"
                      :state="errors.has('note.customer_id.id') ? false : null"
                      v-validate="'required'"
                      data-vv-name="note.customer_id.id"
                      data-vv-as="cliente"
                    >
                      <template slot="no-options">Buscar clientes..</template>
                      <template slot="option" slot-scope="customer">
                        <div>
                          <strong>{{ customer.business_name }}</strong>
                        </div>
                      </template>
                      <template slot="selected-option" slot-scope="customer">
                        <div>
                          <strong>{{ customer.business_name }}</strong>
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </div>
                <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="note.nit">NIT / C.I. * :</label>
                  </strong>
                  <b-form-group :invalid-feedback="errors.first('note.nit')" :state="!errors.has('note.nit')">
                    <b-form-input 
                      v-model="note.nit"
                      :state="errors.has('note.nit') ? false : null"
                      v-validate="'min:3|max:16'"
                      data-vv-name="note.nit"
                      data-vv-as="nit/ci"
                      type="text"
                    ></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </fieldset>
            <div class="row mt-2">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div class="border border-dark">
                  <div class="container">
                    <div class="row">
                      <div class="col-sm-8 my-2">
                        <div class="d-table-cell w-100">
                          <v-select
                            label="name"
                            :filterable="false"
                            :options="productsList"
                            v-model="product"
                            @search="onSearchProduct"
                          >
                            <template slot="no-options">Buscar productos..</template>
                            <template slot="option" slot-scope="product">
                              <div>
                                <strong>{{ product.name }}</strong>
                              </div>
                            </template>
                            <template slot="selected-option" slot-scope="product">
                              <div>
                                <strong>{{ product.name }}</strong>
                              </div>
                            </template>
                          </v-select>
                        </div>
                        <div class="d-table-cell align-middle">
                          <b-button title="Agregar Producto" @click="addProduct" style="height: 2.5em;" size="sm" class="ml-2" variant="dark">
                            <i class="fa fa-plus-circle" aria-hidden="true"></i>
                          </b-button>
                        </div>
                        <div class="d-table-cell align-middle">
                          <b-button title="Recargar Datos" @click="getProductsQuotation" style="height: 2.5em;" size="sm" class="mx-2" variant="success">
                            <i class="fa fa-refresh" aria-hidden="true"></i>
                          </b-button>
                        </div>
                        <div class="d-table-cell align-middle">
                          <b-button title="Borrar Todos" @click="removeAllProducts" style="height: 2.5em;" size="sm" variant="danger">
                            <i class="fa fa-trash" aria-hidden="true"></i>
                          </b-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <div id="light-table"  class="table-responsive" style="margin-top: 5px;">
                  <table id="invoice-table" class="table" >
                    <tr class="invoice_line" style="background-color: #FFDBDC;">
                      <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">CANTIDAD</th>
                      <th style="color: #9e0207; letter-spacing: 0.5em; padding:10px; width: 340px; font-weight: bold; font-size: 20px;">DETALLE</th>
                      <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">P. UNIT.</th>
                      <th style="color: #9e0207; padding:10px; width: 120px; font-weight: bold; font-size: 20px;">SUB TOTAL</th>
                    </tr>
                    <tr v-for="(product, index) in products" :key="index" class="invoice_line" style="text-align: center;">
                      <td style="color: #000000; font-size: 15px;">
                        <p style="margin-bottom: 0;">&nbsp;</p>
                        <b-form-input v-model="product.quantity" @focus="$event.target.select()" class="text-center" type="number" min="1" @keydown="filterKey" @keyup="change(product)"></b-form-input>
                      </td>
                      <td style="color: #000000; text-align: justify; font-size: 15px;">
                        <p style="text-align: center; margin-bottom: 0; font-weight: bold;">{{ product.name }}</p>
                        <b-form-input
                          v-model="product.description" 
                          placeholder="Concepto">
                        </b-form-input>
                      </td>
                      <td style="color: #000000; font-size: 15px;">
                        <p style="margin-bottom: 0;">&nbsp;</p>
                        <b-form-input class="text-center" v-model.lazy="product.price" v-money="money"></b-form-input>
                      </td>
                      <td style="color: #000000; font-size: 15px;">
                        <p style="margin-bottom: 0;">&nbsp;</p>
                        <span>{{ total(product) | currency }}</span>
                        <b-button pill class="ml-2 btn-close" @click="removeItem(index)" size="sm" variant="dark"><i class="fa fa-close"></i></b-button>
                      </td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td><div class="text-right font-weight-bold h6" style="margin-bottom: 0;">SUBTOTAL</div></td>
                      <td><div class="text-center font-weight-bold h6" style="margin-bottom: 0;">{{ subTotal | currency }}</div></td>
                    </tr>
                    <tr>
                      <td>&nbsp;</td>
                      <td>&nbsp;</td>
                      <td><div class="text-right font-weight-bold h6 mt-2">DESCUENTO</div></td>
                      <td><b-form-input v-model="note.discount" v-money="money" class="text-center" size="sm"></b-form-input></td>
                    </tr>
                    <tr class="invoice_line">
                      <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 20px; font-weight: bold; padding:16px;">TOTAL Bs.</td>
                      <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 16px; color: #000000; font-weight: bold; padding:16px; background: #FFDBDC;">{{ grandTotal | currency }}</td>
                    </tr>
                  </table>
                </div>
                <div class="row">
                  <div class="col-md-12">
                    <strong>
                      <label for="note.summary">Resumen (Glosa para reporte):</label>
                    </strong>
                    <b-form-group label-for="note.summary" :invalid-feedback="errors.first('note.summary')" :state="!errors.has('note.summary')">
                      <b-form-textarea
                        v-model="note.summary"
                        :state="errors.has('note.summary') ? false : null"
                        v-validate="'min:3|max:500'"
                        data-vv-name="note.summary"
                        data-vv-as="resumen"
                        placeholder="Resumen (Glosa para reporte)"
                        rows="2"
                        style="font-size: 12px; font-weight: bold;border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                      ></b-form-textarea>
                    </b-form-group>
                  </div>
                </div>
                <div v-if="error">
                  <b-alert show variant="warning">
                    <h4 class="alert-heading">Revisa los siguientes errores!</h4>
                    <ul id="v-for-object">
                      <li v-for="value in error">
                        {{ value[0] }}
                      </li>
                    </ul>
                  </b-alert>
                </div>
              </div>
            </div>
            <b-popover
              target="note-confirm"
              triggers="click"
              :show.sync="popoverNote"
              placement="auto"
              container="my-container"
              ref="popover"
            >
              <template #title>
                Nota
              </template>
              <div>
                <p>Realmente desea emitir este recibo?</p>
                <b-button class="mr-2" @click="onClosePopoverNote" size="sm" variant="danger">NO</b-button>
                <b-button @click="submit" size="sm" variant="dark">SI</b-button>
              </div>
            </b-popover>
            <div class="row my-2">
              <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              </div>
              <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                <b-button 
                  id="note-confirm"
                  ref="button"
                  class="float-right mr-2"
                >Generar Nota</b-button>
                <b-button
                  variant="dark" 
                  @click="viewNote" 
                  class="float-right mr-2"
                >Vista Previa <i class="fa fa-search-plus" aria-hidden="true"></i></b-button>
              </div>
            </div>
          </div>
        </a-spin>
      </div>
    </modal-form>
    <!-- revisar hide para cerrar -->
    <modal-list-invoice  
      :cite="citeQuotation"
      :invoices="invoiceItems" 
      :visible="visibleListInvoice" 
      @hide="closeModalListInvoice"
      @open-invoice-detail="visibleInvoice = true"
      @set-invoice-form="setInvoiceForm" 
    ></modal-list-invoice>
    <modal-invoice 
      :visible="visibleInvoice" 
      @hide="closeModalInvoice" 
    ></modal-invoice>
    <modal-note  
      v-if="checkNote" 
      :note="checkNote" 
      :visible="visibleNote" 
      @hide="closeModalNote"
    ></modal-note>
    <div class="row justify-content-center">
      <div class="table-responsive">
        <div class="container">
          <div class="row p-2 bg-secondary">
            <div class="col-md-6">
              <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
                <i class="fa fa-check-square-o"></i>
              </b-button>
              <b-button title="Descargar PDF" @click="pdfListQuotation" variant="danger" class="ml-2">
                <i class="fa fa-file-pdf-o"></i>
                <span v-if="itemsExecuted.length > 0">({{ itemsExecuted.length }})</span>
              </b-button>
              <b-button title="Descargar EXCEL" @click="excelListQuotation" variant="success" class="ml-2">
                <i class="fa fa-file-excel-o"></i>
                <span v-if="itemsExecuted.length > 0">({{ itemsExecuted.length }})</span>
              </b-button>
            </div>
            <div class="col-md-2 ml-auto">
              <div class="menu" style="border-radius: 4px; float: right; background: #f6f6f6; padding: 0.2em;"/>
              </div>
            </div>
          </div>
          <kendo-datasource
            ref="datasource1"
            :schema-total="'meta.total'"
            :schema-data="'data'"
            :transport-read="{ url: `${url}/quotations/executed`, beforeSend: readData }"
            :transport-parameter-map="parameterMap"
            :page-size="10"
            :server-paging="true"
            :server-filtering="true"
            :server-sorting="true"
            :schema-model-fields="dsSchemaFields"
          ></kendo-datasource>
          <kendo-grid
            ref="grid"
            :data-source-ref="'datasource1'"
            :no-records="true"
            :messages-no-records="'NO EXISTEN RESULTADOS'"
            :groupable="true"
            :filterable="filterableConfig"
            :navigatable="true"
            :pageable-always-visible="true"
            :pageable-page-sizes="[10, 20, 50, 100]"
            :pageable-button-count="3"
            :pageable-responsive="false"
            :pageable-refresh="true"
            :sortable="true"
            @change="onChange"
            @databound="dataBound"
          >
            <kendo-grid-column :selectable="true" :width="30"></kendo-grid-column>
            <kendo-grid-column
              :field="'cite'"
              :title="'CITE'"
              :width="105"
              :template="templateCite"
              :filterable-cell-operator="'contains'"
              :filterable-cell-suggestion-operator="'contains'"
            ></kendo-grid-column>
            <!-- <kendo-grid-column
              :field="'date'"
              :title="'FECHA'"
              :format="'{0:dd/MM/yyyy}'"
              :width="110"
            ></kendo-grid-column> -->
            <kendo-grid-column
              :field="'condition'"
              :title="'CONDICIÓN'"
              :width="110"
              :template="templateCondition"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="stateCondition"
            ></kendo-grid-column>
            <kendo-grid-column :field="'amount'" :title="'MONTO'" :width="50" :filterable="false"></kendo-grid-column>
            <kendo-grid-column
              :field="'customer'"
              :title="'CLIENTE'"
              :width="150"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="customerFilter"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'user'"
              :title="'USUARIO'"
              :width="85"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="userFilter"
            ></kendo-grid-column>
            <kendo-grid-column
              :command="[{name: ' ', iconClass: 'fa fa-file-text-o', click: setVoucher}]" 
              :width="45"
            ></kendo-grid-column>
          </kendo-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
import permission from '../../mixins/permission'
import {VMoney} from 'v-money'
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import QuotationService from "../../services/quotation.service"
import OfficeService from '../../services/office.service'
import CustomerService from '../../services/customer.service'
import ProductService from '../../services/product.service'
import InvoiceService from '../../services/invoice.service'
import NoteService from '../../services/note.service'
import LicenseService from '../../services/license.service'
import VoucherService from '../../services/voucher.service'
import ModalForm from "../widgets/Modals/ModalFormInvoice.vue"
import ModalListInvoice from "../widgets/Modals/ModalListInvoice.vue"
import ModalInvoice from "../widgets/Modals/ModalInvoice.vue" //ddd
import ModalNote from "../widgets/Modals/ModalNote.vue"
import Invoice from '../../models/Invoice'
import Note from '../../models/Note'
import Money from '../../models/Money'
import formatter from '../../mixins/formatter'

export default {
  data() {
    return {
      invoice: new Invoice(),
      note: new Note(),
      success: true,
      offices: [],
      customers: [],
      productsList: [],
      product: null,
      details: [],
      money: new Money(),
      url: API_URL,
      dsSchemaFields: {
        cite: { type: "string" },
        condition: { type: "string" },
        amount: { type: "string" },
        state: { from: "state.title" },
        customer: { from: "customer.business_name" },
        user: { from: "user.name" }
      },
      filterableConfig: {
        mode: "row",
        operators: {
          string: {
            qe: "Es igual a",
            neq: "No es igual a",
            contains: "Contiene",
            doesnotcontain: "No contiene",
            startswitch: "Comienza con",
            endswitch: "Termina en"
          },
          date: {
            lte: "Antes o igual a",
            gte: "Después o igual a"
          }
        }
      },
      selectedItem: null,
      voucher: 'invoice',
      showCategoryVoucher: false,
      showVoucherInvoice: null,
      showVoucherNote: null,
      visibleForm: false,
      visibleListInvoice: false,
      visibleInvoice: false,
      visibleNote: false,
      popoverInvoice: false,
      popoverNote: false,
      showNitName: false,
      invoiceItems: null,
      citeQuotation: null,
      checkNote: null,
      products: [],
      error: null,
    }
  },

  mixins: [formatter],

  directives: {
    money: VMoney,
  },

  watch: {
    product: function (value) {
      if(value) this.addProduct()
    }
  },

  computed: {
    ...mapGetters(["itemsGeneral", "itemsExecuted", "currentUser"]),

    subTotal() {
      let total = this.products.reduce((acc, item) => {
        let val = 0
        val = parseInt(item.quantity) * parseFloat(this.toFloat(item.price)).toFixed(2)
        item.subtotal = parseFloat(val).toFixed(2)
        return acc + val
      }, 0)
      return isNaN(total) ? 0 : total
    },

    grandTotal() 
    {
      let total = 0
      if(this.showVoucherInvoice) {
        total = this.subTotal
        this.invoice.total = Number(parseFloat(total).toFixed(2))
      } else {
        total = (this.subTotal - this.toFloat(this.note.discount))
        this.note.total = Number(parseFloat(total).toFixed(2))
      }
      return isNaN(total) ? 0 : total
    }
  },

  components: {
    "modal-form": ModalForm,
    "modal-list-invoice": ModalListInvoice,
    "modal-invoice": ModalInvoice,
    "modal-note": ModalNote,
  },

  mounted() {
    let grid = this.$refs.grid.kendoWidget()
    let ds = []
    for (let i = 1, max = grid.columns.length; i < max; i++) {
      ds.push({
        encoded: false,
        text:
          "<label class='k-checkbox-label' for='"+ i +"'><input id='"+ i +"' type='checkbox' checked='checked' " +
          " class='check k-checkbox' data-field='" +
          grid.columns[i].field +
          "'/>" +
          "<strong class='ml-2'> "+ grid.columns[i].title + "</strong>" +
          "</label>"
      })
    }

    $(".menu").kendoMenu({
      dataSource: [
        {
          text: "Columnas",
          items: ds
        }
      ],
      openOnClick: {
        rootMenuItems: true
      },
      closeOnClick: true,
      open: function() {
        let selector
        $.each(grid.columns, function() {
          if (this.hidden) {
            selector = "input[data-field='" + this.field + "']"
            $(selector).prop("checked", false)
          }
        })
      },
      select: function(e) {
        if ($(e.item).parent().filter("div").length) return
        let input = $(e.item).find("input.check")
        let field = $(input).data("field")
        if ($(input).is(":checked")) {
          grid.showColumn(field)
        } else {
          grid.hideColumn(field)
        }
      }
    })
  },

  methods: {
    openModalForm() {
      this.visibleInvoice = false
      this.visibleForm = true
    },
    
    setInvoiceForm(flag) {
      if(flag){
        let obj = this.invoiceItems.reduce(function(prev, current) {
            if (+current.id > +prev.id) {
                return current
            } else {
                return prev
            }
        })
        // console.log(obj)
        this.invoice.office_id = obj.license.office.id//fixme
        this.invoice.user_id = obj.user//fixme
        this.invoice.quotation_id = this.selectedItem.id
        this.invoice.customer_id = obj.customer_data
        this.invoice.nit = obj.customer_data.nit
        this.invoice.title = obj.title
        this.invoice.footer = obj.footer
        this.details = obj.details
        let [...objProducts] = obj.products
        this.products = objProducts
        // console.log(obj)
      } else {
        this.invoice.office_id = this.currentUser.office.id
        this.invoice.user_id = this.currentUser.id
        this.invoice.quotation_id = this.selectedItem.id
        this.invoice.customer_id = this.selectedItem.customer_data
        this.invoice.nit = this.selectedItem.customer_data.nit
        this.invoice.title = ''
        this.invoice.footer = ''
        let [...objProducts] = this.selectedItem.products
        this.products = objProducts
      }
      // this.showCategoryVoucher = false
      // this.visibleInvoice = false
      this.showVoucherInvoice = true 
      this.visibleForm = true
    },

    addItemDetail() {
      this.details.push({description: ''})
    },

    deleteItemDetail(index) {
      if (index > -1) this.details.splice(index, 1)
    },

    showFormVoucher() {
      if(this.voucher == 'invoice') {
        this.invoice.office_id = this.currentUser.office.id
        this.invoice.user_id = this.currentUser.id
        this.invoice.quotation_id = this.selectedItem.id
        this.invoice.customer_id = this.selectedItem.customer_data
        this.invoice.nit = this.selectedItem.customer_data.nit
        let [...obj] = this.selectedItem.products
        this.products = obj
        this.showCategoryVoucher = false
        this.showVoucherInvoice = true 
      } else {
        this.note.office_id = this.currentUser.office.id
        this.note.user_id = this.currentUser.id
        this.note.quotation_id = this.selectedItem.id
        this.note.customer_id = this.selectedItem.customer_data
        this.note.nit = this.selectedItem.customer_data.nit
        let [...obj] = this.selectedItem.products
        this.products = obj
        this.note.discount = this.selectedItem.discount
        this.showCategoryVoucher = false
        this.showVoucherNote = true
      }
    },

    async viewInvoice() {
      try {
        let data = {office: this.invoice.office_id}
        const response = await LicenseService.getLicense(data)
        if (response.status === 200) {
          let invoice = {
            date: this.invoice.date,
            total: this.invoice.total,
            title: this.invoice.title,
            footer: this.invoice.footer,
            // oc: this.invoice.oc,
            // hea: this.invoice.hea,
            details: this.details,
            state_data: {title: 'VÁLIDO'},
            license: response.data.data,
            products: this.products,
            customer_data: {
              business_name: this.invoice.nit_name === '' ? this.invoice.customer_id.business_name : this.invoice.nit_name,
              nit: this.invoice.nit
            }
          }
          this.$bus.$emit('getCheckInvoice', invoice)
          // this.invoiceItems = invoice
          this.visibleInvoice = true
          // this.visibleForm = false
          
        }
      } catch (err) {
        this.visibleInvoice = false
      }
    },

    async viewNote() {
      try {
        let data = {office: this.note.office_id}
        const response = await VoucherService.getVoucher(data)
        if (response.status === 200) {
          let note = {
            date: this.note.date,
            subtotal: this.subTotal,
            total: this.note.total,
            discount: this.note.discount,
            voucher: response.data.data,
            products: this.products,
            customer_data: {
              business_name: this.note.customer_id.business_name,
              nit: this.note.nit
            }
          }
          this.checkNote = note
          // console.log(this.checkNote)
          this.visibleNote = true
        }
      } catch (err) {
        this.visibleNote = false
      }
    },

    listOffices: async function() {
      const offices = await OfficeService.listOffices()
      if (offices.status === 200) {
        this.offices = offices.data
        this.success = false
      }
    },

    backToCategoryVoucher() {
      if(this.invoiceItems) {
        // this.visibleInvoice = true
        // this.showCategoryVoucher = false
        this.showVoucherInvoice = false
        this.details = []
        this.visibleForm = false
      } else {
        this.showCategoryVoucher = true
        this.showVoucherInvoice = false
        this.showVoucherNote = false
      }
      // this.cleanDataVoucher()
    },

    cleanDataVoucher() {
      this.invoice = new Invoice()
      this.note = new Note()
      this.showNitName = false
      // this.invoiceItems = null
      this.checkNote = null
      this.error = null
      this.products = []
      // this.details = []
      // this.showCategoryVoucher = false
      // this.showVoucherInvoice = null
      // this.showVoucherNote = null 
    },

    closeModalForm() {
      this.cleanDataVoucher()
      this.visibleForm = false
      this.showVoucherInvoice = false
      this.showVoucherNote = false
      this.details = []
      // this.selectedItem = null
      this.showCategoryVoucher = false
      // this.showVoucherInvoice = null
      // this.showVoucherNote = null 
      // this.backToCategoryVoucher()
    },

    closeModalListInvoice() {
      this.visibleListInvoice = false
      this.invoiceItems = null
    },

    closeModalInvoice() {
      this.visibleInvoice = false
      // this.invoiceItems = null ojo aqui
    },

    closeModalNote() {
      this.visibleNote = false
      this.checkNote = null
    },

    setVoucher(ev) {
      ev.preventDefault()
      let gridWidget = this.$refs.grid.kendoWidget()
      let tr = $(ev.target).closest('tr')
      let data = gridWidget.dataItem(tr)
      this.selectedItem = data
      if (data.invoice) {
        this.invoiceItems = Array.from(data.invoice)
        this.citeQuotation = data.cite
        this.visibleListInvoice = true
      } else if (data.note) {
        this.checkNote = data.note
        this.visibleNote = true
      } else {
        this.showCategoryVoucher = true
        this.visibleForm = true
      }
      this.listOffices()
    },

    setNewCustomer() {
      if (!this.showNitName) {
        this.showNitName = true
        this.invoice.nit = ''
      } else {
        this.showNitName = false
        this.invoice.nit = this.invoice.customer_id.nit
        this.invoice.nit_name = ''
      }
    },

    getProductsQuotation: async function(quotation) {
      try {
        this.success = true
        const response = await QuotationService.showQuotation(`quotations/products/${this.selectedItem.id}`)
        if (response.status === 200) {
          this.products = response.data.data.products
          this.success = false
        }
      } catch (err) {
        this.success = false
      }
    },

    addProduct() {
      if (this.product) {
        let obj = {
          id: this.product.id,
          name: this.product.name,
          description: '',
          quantity: 1,
          price: 0,
          subtotal: 0,
        }
        this.products.push(obj)
      }
    },

    filterKey(e){
      const key = e.key;
      if (key === '-') return e.preventDefault();
      if (key === '+') return e.preventDefault();
      if (key === '.') return e.preventDefault();
      if (key === 'e') return e.preventDefault();
    },

    change(product) {
      if (product.quantity == '' || product.quantity == 0) product.quantity = 1
    },

    removeItem(index) {
      if (index > -1) this.products.splice(index, 1)
    },

    removeAllProducts() {
      this.products = []
    },

    total(product) {
      return parseInt(product.quantity) * this.toFloat(product.price) 
    },

    onSearchCustomer(search, loading) {
      loading(true)
      this.searchCustomer(loading, search, this)
    },

    searchCustomer: _.debounce(async (loading, search, vm) => {
      const data = {
        column: 'business_name',
        value: search
      }
      try {
        const customers = await CustomerService.searchCustomer(data)
        if (customers.status === 200) {
          vm.customers = customers.data.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.customers = []
          loading(false)
        }
      }
    }, 350),

    onSearchProduct(search, loading) {
      loading(true)
      this.searchProduct(loading, search, this)
    },

    searchProduct: _.debounce(async (loading, search, vm) => {
      const data = {
        column: 'name',
        value: search
      }
      try {
        const products = await ProductService.searchProduct(data)
        if (products.status === 200) {
          vm.productsList = products.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.productsList = []
          loading(false)
        }
      }
    }, 350),
     
    onClosePopoverInvoice() {
      this.popoverInvoice = false
    },

    onClosePopoverNote() {
      this.popoverNote = false
    },

    async submit() {
      this.invoice.details = this.details.map(obj => obj.description).join('|')
      // console.log(this.invoice)
      let products = this.products.map(item => {
        let obj = new Object()
        let price = this.toFloat(item.price)
        obj.id = item.id
        obj.name = item.name
        obj.description = item.description
        obj.quantity = item.quantity
        obj.price = price
        obj.subtotal = item.subtotal
        return obj
      })
      this.onClosePopoverInvoice()
      this.onClosePopoverNote()
      this.error = null
      this.success = true
      this.$validator.errors.clear()
      try {
        let data = null
        let method = null
        if(this.showVoucherInvoice) {
          data = {invoice: this.invoice, products: products, showNitName: this.showNitName}
          method = 'downloadInvoice'
          this._save = await InvoiceService.storeInvoice(data)
        } else {
          data = {note: this.note, products: products}
          method = 'downloadNote'
          this._save = await NoteService.storeNote(data)
        }

        if (this._save.status === 201) {
          this.$refs.grid.kendoWidget().dataSource.read()
          this.visibleListInvoice = false
          this.closeModalForm()
          this[method](this._save.data.data.id)
          this.$message.success(this._save.data.message)
          this.success = false
        }
      } catch (err) {
        this.onClosePopoverInvoice()
        this.onClosePopoverNote()
        if (err.response.status === 422) {
          this.$setErrorsFromResponse(err.response.data)
          this.error = err.response.data.errors
        }
        if (err.response.status === 406) {
          this.closeModalForm()
          this.$notification.warning({
            message: 'Nota',
            description: err.response.data,
            duration: 10,
            placement: 'bottomRight'
          })
        }
        this.success = false
      }
    },

    downloadNote: async function(note) {
      const key = 'updatable'
      try {
        this.$message.loading({ content: 'Descargando nota espere...', key, duration: 4})
        const response = await NoteService.downloadNote(note)
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Nota.pdf'
          link.click()
          this.$message.success({ content: 'Documento Listo!', key, duration: 2 })
        }
      } catch (err) {
        this.$message.error({ content: 'No es posible descargar el documento', key })
      }
    },

    downloadInvoice: async function(invoice) {
      const key = 'updatable'
      try {
        this.$message.loading({ content: 'Descargando factura espere...', key, duration: 4})
        const response = await InvoiceService.downloadInvoice(invoice, 'ORIGINAL')
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Factura.pdf'
          link.click()
          // let file = new Blob([response.data], {type: 'application/pdf'})
          // let fileUrl = URL.createObjectURL(file)
          // window.open(fileUrl) 
          this.$message.success({ content: 'Documento Listo!', key, duration: 2 })
        }
      } catch (err) {
        this.$message.error({ content: 'No es posible descargar el documento', key })
      }
    },

    templateCite(dataItem) {
      return (
        "<a href='/servicios/cotizaciones/" + dataItem.id +"' class='btn btn-link'>" +
        kendo.htmlEncode(dataItem.cite) +
        "</a>"
      )
    },

    stateCondition(element) {
      let condition = [
        { title: "S/C", id: 1 },
        { title: "FACTURADO", id: 0 },
        { title: "REMITIDO", id: 2 },
      ]

      element.element.kendoDropDownList({
        dataSource: condition,
        dataTextField: "title",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          title: "-Seleccione-",
          id: ""
        }
      })
    },

    templateCondition(dataItem) {
      switch (Number(dataItem.condition)) {
        case 0:
          return (
            "<span class='badge badge-custom-1'>" +
            'FACTURADO' +
            "</span>"
          );
          break;
        case 1:
          return (
            "<span class='badge badge-custom-2'>" +
            'S/C' +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-3'>" +
            'REMITIDO' +
            "</span>"
          );
      }
    },

    readData: function(xhr) {
      let self = this
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"))
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      xhr.setRequestHeader("Accept-Language", "en")
      xhr.setRequestHeader("Accept", "application/json")
      xhr.done(function(data) {
        self.$emit("ejecutado", false)
      })
      xhr.fail(function(data) {
        if (data.status === 403) self.$router.push({ path: '/system/403' })
        if (data.status === 401 || data.responseJSON.message == "Unauthenticated.") {
          self.$store.dispatch('responseMessage', {
            type: 'warning',
            text: 'No tiene una sesión activa, por favor vuelva a iniciar sesión.',
            title: 'Sesión Expirada!',
            modal: true
          })
          .then(async() => {
            await self.$store.dispatch('cleanSession')
            self.$router.push({ path: '/system/login' })
          })
        }
      })
    },

    customerFilter(element) {
      let dataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: `${API_URL}/customers/listing`,
            dataType: "json"
          }
        }
      })

      element.element.kendoDropDownList({
        filter: "contains",
        dataSource: dataSource,
        dataTextField: "business_name",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          business_name: "-Seleccione-",
          id: ""
        }
      })
    },

    userFilter(element) {
      let dataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: `${API_URL}/users/listing`,
            dataType: "json"
          }
        }
      })

      element.element.kendoDropDownList({
        filter: "contains",
        dataSource: dataSource,
        dataTextField: "name",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          name: "-Seleccione-",
          id: ""
        }
      })
    },

    parameterMap: function(data, type) {
      if (type == "read" && data.filter !== undefined) {
        let dates = data.filter.filters.filter(e => e.operator == "lte" || e.operator == "gte")
        if (dates.length > 0) {
          data.filter.filters.forEach(item => {
            if (dates.includes(item)) {
              item.value = kendo.toString(item.value, "yyyy-MM-dd")
            }
          })
        }
        return data
      } else return data
    },

    emptyGridSelected() {
      this.$store.dispatch("emptyQuotation")
      .then(() => {
        let grid = this.$refs.grid.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsGeneral.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid, ...obj} = grid.dataItem(row)
          obj.date = kendo.toString(obj.date, "dd/MM/yyyy")
          vm.$store.dispatch("setItemQuotation", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemQuotation", index)
        }
      })
    },

    dataBound(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      let itemsToSelect = []
      items.each(function(idx, row) {
        let dataItem = grid.dataItem(row).get("id")
        let index = vm.itemsGeneral.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(2)", function(e) {
        let element = e.target || e.srcElement
        let data = grid.dataItem($(element).closest("tr"))
        vm.$router.push({name: "ShowQuotation", params: { id: data.id }})
      })
    },

    async pdfListQuotation() {
      this.$store.dispatch("showLoader")
      let data = this.itemsGeneral.map(item => item.id)
      try {
        const quotations = await QuotationService.pdfListQuotation({quotation: data})
        if (quotations.status === 200) {
          let blob = new Blob([quotations.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = "Lista.pdf"
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },

    async excelListQuotation() {
      this.$store.dispatch("showLoader")
      let data = this.itemsGeneral.map(item => item.id)
      try {
        const quotations = await QuotationService.excelListQuotation({quotation: data})
        if (quotations.status === 200) {
          let blob = new Blob([quotations.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = "Lista.xlsx"
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-close {
  font-size: .650rem;
  line-height: 1.5;
  border-radius: .2rem;
}
$white: #fff;
$gray:#4f5b63;
.middle {
  font-size: 1.2em;
  width: 100%;
  text-align: center;
  input[type="radio"] {
    display: none;
    &:checked {
      + .box {
        background-color: $gray;
        span {
          color: white;
          transform: translateY(70px);
          &:before {
            transform: translateY(0px);
            opacity: 1;
          }
        }
      }
    }
  }
  .box {
    width: 200px;
    height: 200px;
    background-color: $white;
    transition: all 250ms ease;
    will-change: transition;
    display: inline-block;
    text-align: center;
    cursor: pointer;
    position: relative;
    // font-family: $font;
    font-weight: 900;
    &:active {
      transform: translateY(10px);
    }
    span {
      position: absolute;
      transform: translate(0, 60px);
      left: 0;
      right: 0;
      transition: all 300ms ease;
      font-size: 1.5em;
      user-select: none;
      color: $gray;
      &:before {
        font-size: 1.2em;
        font-family: FontAwesome;
        display: block;
        transform: translateY(-80px);
        opacity: 0;
        transition: all 300ms ease-in-out;
        font-weight: normal;
        color: white;
      }
    }
  }
  .front-end {
    span {
      &:before {
        content: "\f155";
      }
    }
  }
  .back-end {
    span {
      &:before {
        content: "\f022";
      }
    }
  }
}

</style>
<style scoped src="../../assets/css/grid.css"></style>
<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .1s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

fieldset {
  background-color: #e9e4e6;
  border-radius: 4px;
}

legend {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  font-size: 17px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}

.fieldset {
  border: 3px groove threedface;
  margin: 2px;
  margin-top: 10px;
  position: relative;
  padding: 15px 12px 10px;
}
.fieldset .legend {
  position: absolute;
  top: -11px;
  left: 11px;
  background: white;
  padding-left: 2px;
  padding-right: 2px;
}
  #light-table {
    width: 100%;  
    padding-top: 0;
    padding-bottom: 0;
    text-align: left;
  }

  #invoice-table {
    border: 2px solid #9e0207;
    border-radius: 7px;
    border-spacing: 0;
    box-sizing: border-box;
    clear: both;
    margin: 2mm 0mm;
    height: 50mm;
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
</style>