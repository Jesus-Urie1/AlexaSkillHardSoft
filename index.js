exports.handler = async (event) => {
  const { MongoClient, ServerApiVersion } = require("mongodb");

  const uri = "aqui va la url";
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const collection = client.db("hsi").collection("servicios");
    const result = await collection.find({}).toArray();
    const serviciosCompletados = result.filter(
      (servicio) => servicio.completado === true
    );
    const serviciosPendientes = result.filter(
      (servicio) => servicio.completado === false
    );
    const serviciosAlta = result.filter(
      (servicio) =>
        servicio.completado === false && servicio.prioridad === "alta"
    );
    const serviciosMedia = result.filter(
      (servicio) =>
        servicio.completado === false && servicio.prioridad === "media"
    );
    const serviciosBaja = result.filter(
      (servicio) =>
        servicio.completado === false && servicio.prioridad === "baja"
    );
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        serviciosTotal: result.length,
        serviciosCompletados: serviciosCompletados.length,
        serviciosPendientes: serviciosPendientes.length,
        serviciosAlta: serviciosAlta.length,
        serviciosMedia: serviciosMedia.length,
        serviciosBaja: serviciosBaja.length,
      }),
    };
    return response;
  } catch (err) {
    console.log(err);
    const response = {
      statusCode: 500,
      body: JSON.stringify({ error: err }),
    };
    return response;
  } finally {
    await client.close();
  }
};
