const { BlobServiceClient } = require('@azure/storage-blob');

module.exports = async function (context, req) {
    const name = req.body?.payer || "Unknown";
    const now = new Date().toISOString();
    const content = `Pago recibido de ${name} el ${now}`;
    const filename = `pago-${Date.now()}.txt`;

    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient("pagos");

    await containerClient.createIfNotExists();
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    await blockBlobClient.upload(content, Buffer.byteLength(content));

    context.res = {
        status: 200,
        body: "Archivo creado correctamente"
    };
};
