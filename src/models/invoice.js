import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";

const invoiceSchema = new Schema({
  CantReg: { type: Number, required: true, default: 1 },
  PtoVta: { type: String, required: true },
  CbteTipo: { type: Number, required: true },
  Concepto: { type: Number, required: true },
  DocTipo: { type: String, required: true },
  DocNro: { type: String, required: true },
  CbteDesde: { type: Number, required: true },
  CbteHasta: { type: Number, required: true },
  CbteFch: { type: Number, required: true },
  ImpTotal: { type: Number, required: true },
  ImpTotConc: { type: Number, required: true, default: 0 },
  ImpNeto: { type: Number, required: true },
  ImpOpEx: { type: Number, required: true, default: 0 },
  ImpIVA: { type: Number, required: true },
  ImpTrib: { type: Number, required: true, default: 0 },
  MonId: { type: String, required: true, default: "PES" },
  MonCotiz: { type: Number, required: true, default: 1 },
  Iva: [
    {
      Id: { type: Number, required: true },
      BaseImp: { type: Number, required: true },
      Importe: { type: Number, required: true },
    },
  ],
  FeCabResp: { type: Object, required: false, default: null },
  FeDetResp: { type: Object, required: false, default: null },
});

invoiceSchema.plugin(paginate);

const Invoice = model("Invoice", invoiceSchema);

export default Invoice;
