import Afip from "@afipsdk/afip.js";
import Invoice from "./../models/invoice";
import fs from "fs";
import path from "path";

const routeCerts = "./src/assets/certs";

export const index = async (req, res) => {
  return res.status(400).json({ msg: "Index Route" });
};

export const saveCert = (req, res) => {
  const { cert, key } = req.body;

  // Crea las subcarpetas si no existen
  if (!fs.existsSync(routeCerts)) {
    fs.mkdirSync(routeCerts, { recursive: true });
  }

  fs.writeFile(`${routeCerts}/cert`, cert, (err) => {
    if (err) throw err;
    console.log("El cert ha sido creado exitosamente!");
  });

  fs.writeFile(`${routeCerts}/key`, key, (err) => {
    if (err) throw err;
    console.log("El key ha sido creado exitosamente!");
  });

  return res.status(200).json({ msg: "Certs Updated" });
};

export const salesPoint = async (req, res) => {
  const afip = createAfipInstance(req.query);

  try {
    const points = await afip.ElectronicBilling.getSalesPoints();
    return res.status(200).json(points);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const lastVoucher = async (req, res) => {
  const { salesPoint, invoiceType } = req.query;

  const afip = createAfipInstance(req.query);

  try {
    const lastVoucher = await afip.ElectronicBilling.getLastVoucher(
      salesPoint,
      invoiceType
    );
    return res.status(200).json(lastVoucher);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const serverStatus = async (req, res) => {
  const afip = createAfipInstance(req.query);

  try {
    const serverStatus = await afip.ElectronicBilling.getServerStatus();
    return res.status(200).json(serverStatus);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export const store = async (req, res) => {
  const {
    ptoVta,
    cbteTipo, // Tipo de comprobante (ver tipos disponibles)
    concepto, // concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
    docTipo, // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
    docNro, // Número de documento del comprador (0 consumidor final)
    impTotal, // Importe total del comprobante
    impTotConc, // Importe neto no gravado
    impNeto, // Importe neto gravado
    impOpEx, // Importe exento de IVA
    impIVA, //Importe total de IVA
    impTrib, //Importe total de tributos
    iva, // Alícuotas asociadas al comprobante
    cbteDesde,
    cbteHasta,
  } = req.body;

  const dateNow = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const afip = createAfipInstance(req.query);
  let invoiceData = {
    CantReg: 1,
    CbteDesde: cbteDesde,
    CbteFch: parseInt(dateNow.replace(/-/g, "")),
    CbteHasta: cbteHasta,
    CbteTipo: cbteTipo,
    Concepto: concepto,
    DocNro: docNro,
    DocTipo: docTipo,
    ImpIVA: impIVA,
    ImpNeto: impNeto,
    ImpOpEx: impOpEx,
    ImpTotal: impTotal,
    ImpTotConc: impTotConc,
    ImpTrib: impTrib,
    Iva: iva,
    MonCotiz: 1,
    MonId: "PES",
    PtoVta: ptoVta,
  };

  try {
    console.log("Invoice To Send");
    console.log(invoiceData);
    const data = await afip.ElectronicBilling.createVoucher(
      JSON.parse(JSON.stringify(invoiceData)),
      true
    );
    console.log("Response AFIP");
    console.log(data);
    const invoice = await Invoice.create({ ...invoiceData, ...data });
    console.log("Invoice Save in DB");
    return res.status(200).json(invoice);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const createAfipInstance = ({ cuit, production, token }) => {
  let afipData = {
    CUIT: cuit,
    production: production === "true" ? true : false,
    res_folder: routeCerts,
  };

  if (production === "true")
    return new Afip({ ...afipData, access_token: token });
  return new Afip(afipData);
};
