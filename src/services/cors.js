const corsProxy = require('cors-anywhere');

const PORT = process.env.PORT || 8080;

corsProxy.createServer({
    originWhitelist: [], 
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2'],
}).listen(PORT, () => {
    console.log(`CORS Anywhere server is running on port ${PORT}`);
});
