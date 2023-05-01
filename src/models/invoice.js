import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const invoiceSchema = new Schema({
  CantReg: Number,
  PtoVta: Number,
  CbteTipo: Number,
  Concepto: Number,
  DocTipo: Number,
  DocNro: Number,
  CbteDesde: Number,
  CbteHasta: Number,
  ImpTotal: Number,
  ImpTotConc: Number,
  ImpNeto: Number,
  ImpOpEx: Number,
  ImpIVA: Number,
  ImpTrib: Number,
  MonId: String,
  MonCotiz: Number,
  FchVtoPago: String,
  Iva: [
    {
      Id: Number,
      BaseImp: Number,
      Importe: Number,
    },
  ],
});

invoiceSchema.plugin(paginate);

const Invoice = model("Invoice", invoiceSchema);

export default Invoice;
