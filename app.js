const debug = require('debug')('app:inicio');
//const dbDebug = require('debug')('app:db');
const express =require('express');
const config = require('config');
const Joi = require('joi');
const route =require('./route');
const morgan = require('morgan');
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended:true}));
app.use(express.static('public'));

app.use(route);

/* app.use(function(req, res, next) {
    console.log('Autenticando...');
    console.log(res.url)
    next();
}); */
//Configuracion de entornos
console.log('La aplicacion :'+ config.get('nombre'));
console.log('BD server: '+config.get('configDB.host'));


//use de morgan para las rutas 
if(app.get('env')==='development'){
    app.use(morgan('tiny'));
    //console.log('Morgan Activado')
    debug('Morgan esta habilitado.');
}

//Trabajos con la base de datos 
debug('Conectando con la base de datos');

const usuarios = [
    {id:1, nombre:'Minenick121'},
    {id:2, nombre:'Jose'},
    {id:3, nombre:'Ana'}
];

app.get('/', (req, res) => {
    res.send('Hola Mundo desde Express xd');
});

app.get('/api/usuarios', (req, res) => {
    res.send(usuarios);
});

app.get('/api/usuarios/:id', (req, res) => {
    let usuario = existeUsuario(req.params.id);
    if(!usuario) res.status(404).send('El usuario no fue encontrado');
    res.send(usuario);
});

app.get('/api/usuarios/:year/:mes', (req, res) => {
    res.send(req.query);
});

app.post('/api/usuarios', (req, res) => {

    
    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    });
    const {error,value} = validarUsuario(req.body.nombre);

    if(!error){
        const usuario={
            id:usuarios.length+1,
            nombre:value.nombre
        };
        usuarios.push(usuario);
        res.send(usuario); 
    }else{
        res.status(400).send(error.details[0].message);
    }



});

const port = process.env.PORT || 3000;
 
app.listen(port,()=>{
    console.log(`Encuchando en el puerto ${port}..`)
});

app.put('/api/usuarios/:id', (req, res)=>{

    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
   
    const {error,value} =validarUsuario(req.body.nombre) ;

    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    usuario.nombre=value.nombre;
    res.send(usuario);
});

app.delete('/api/usuarios/:id', (req, res)=>{
    let usuario = existeUsuario(req.params.id);
    if(!usuario){
        res.status(404).send('El usuario no fue encontrado');
        return;
    }
    const index = usuarios.indexOf(usuario);
    usuarios.splice(index,1);

    res.send(usuario);
});

function existeUsuario(id){
    return (usuarios.find(u =>u.id ===parseInt(id)));
};

function validarUsuario(nom){

    const schema = Joi.object({
        nombre: Joi.string()
            .min(3)
            .required()
    });
    return (schema.validate({ nombre: nom }));
}