const app = require('./app');
const port = process.env.PORT || 3000; 


process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

app.listen(port, () => {
    console.log(`The application is listening on port ${port}`);
});