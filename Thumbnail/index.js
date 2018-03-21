const stream = require('stream');
const storage = require('azure-storage');
const blobService = storage.createBlobService();

module.exports = (context, myBlob) => {

    context.log(JSON.stringify(context));

    context.log('BEFORE create stream');
    const readStream = stream.PassThrough();
    readStream.end(myBlob);
    context.log('AFTER create stream');

    const options = {
        contentSettings: { contentType: 'image/png'}
    };

    context.log(`Blob length from blob: ${myBlob.length}`);
    context.log(`Blob length from context: ${context.bindingData.properties.length}`);

    //const length = myBlob.length;  <-- returns the incorrect length value

    const length = context.bindingData.properties.length;

    context.log('BEFORE blobService.createBlockBlobFromStream');
    blobService.createBlockBlobFromStream('thumbnails', 'test.png', readStream, length, options, (err) => {

        context.log('CALLBACK from blobService.createBlockBlobFromStream');

        if(err) context.log(JSON.stringify(err));

        context.log('COMPLETE');
        context.done();
    });

};