const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');

const AnalisisTinta = ('../models/analisis-tinta')

const app = express();
app.use(fileUpload());

app.put('/api/upload/:tipo/:id', (req, res)=>{

    let tipo = req.params.tipo;
    let id = req.params.id;

    if(!req.files){
        return res.status(400)
                .json({
                    ok:false,
                    err:{
                        message:'No se ah seleccionado ningun archivo'
                    }
        });
    }

    //validad tipo
    let tipoValido = ['analisis'];
    if( tipoValido.indexOf( tipo ) < 0 ){
        return res.status( 400 ).json({
            ok:false,
            err:{
                message:'Error de url'
            }
        })
    }


    let archivo = req.files.archivo;
    let NombreSep = archivo.name.split('.');
    let extension = NombreSep[NombreSep.length - 1];

    let extensionesValidas = ['png', 'jpg', 'jpeg'];

    if(extensionesValidas.indexOf( extension ) < 0){
        return res.status( 400 ).json({
            ok:false,
            err:{
                message:'Extension de archivo no valido'
            }
        })
    }

    //cambiar nombre de la imagen
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`; 
    console.log(nombreArchivo)

    archivo.mv(`src/uploads/${tipo}/${nombreArchivo}`, (err)=>{
        if(err){
            return res.status(500)
                        .json({
                            ok:false,
                            err
            });
        }

        if(tipo === 'analisis'){
            res.json(
               { img:nombreArchivo}
            )
        }

    });

});

function AnalisisTintas(id, res, nombreArchivo){
    AnalisisTinta.findById(id,(err,usuarioDB)=>{
        if( err ){
            borrarArchivo(nombreArchivo, 'analisis')
            return res.status(500).json({
                ok:false,
                err
            });
        }

        if(!usuarioDB){
            borrarArchivo(nombreArchivo, 'analisis')
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'analisis no existe'
                }
            });
        }
        
        borrarArchivo(usuarioDB.img, 'analisis')

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, imageUpdated)=>{

            res.json({
                ok:true,
                usuario:usuarioDB,
                img:nombreArchivo
            })


        });

    });
}


module.exports = app;