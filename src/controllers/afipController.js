import Afip from "@afipsdk/afip.js";
import fs from "fs";

const routeCerts = "./src/assets/certs";

const index = async (req, res) => {
  return res.status(400).json({ msg: "Index Route" });
};

const saveCert = (req, res) => {
  const { cert, key } = req.body;

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

const salesPoint = async (req, res) => {
  const { cuit, production } = req.query;

  try {
    const points = await getPoints(cuit, production);
    return res.status(200).json(points);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const lastVoucher = async (req, res) => {
  const { cuit, production, salesPoint, invoiceType } = req.query;

  const afip = new Afip({
    CUIT: cuit,
    production: production === "true" ? true : false,
    res_folder: routeCerts,
  });

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

const store = async (req, res) => {
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
  } = req.body;

  const { cuit, production } = req.query;

  const dateNow = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  const invoiceDataDefault = {
    CantReg: 1,
    CbteFch: parseInt(dateNow.replace(/-/g, "")),
    MonId: "PES",
    MonCotiz: 1,
  };

  const afip = new Afip({
    CUIT: cuit,
    production: production === "true" ? true : false,
    res_folder: routeCerts,
  });

  try {
    const lastVoucher = await afip.ElectronicBilling.getLastVoucher(
      ptoVta,
      cbteTipo
    );

    invoiceDataDefault.CbteDesde = lastVoucher + 1;
    invoiceDataDefault.CbteHasta = lastVoucher + 1;

    const data = await afip.ElectronicBilling.createVoucher(
      {
        ...invoiceDataDefault,
        PtoVta: ptoVta,
        CbteTipo: cbteTipo,
        Concepto: concepto,
        DocTipo: docTipo,
        DocNro: docNro,
        ImpTotal: impTotal,
        ImpTotConc: impTotConc,
        ImpNeto: impNeto,
        ImpOpEx: impOpEx,
        ImpIVA: impIVA,
        ImpTrib: impTrib,
        Iva: iva,
      },
      true
    );
    console.log("Invoice Created");
    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

async function getPoints(cuit, production) {
  const afip = new Afip({
    CUIT: cuit,
    production: production === "true" ? true : false,
    res_folder: routeCerts,
  });

  return await afip.ElectronicBilling.getSalesPoints();
}

export { index, store, salesPoint, saveCert, lastVoucher };
