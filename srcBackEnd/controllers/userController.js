exports.getUser = () => {};

exports.updateUser = async (req, res) => {

    // **/user** _PATCH_ (TOKEN AUTH) Modifica alguno de los datos de perfil del usuario.

    const user = req.body.id;
    const nombre = req.body.nombre;
    const apellidos = req.body.apellidos;
    const foto = req.body.foto;
  
    //Validamos los campos user y password
    if (isValidUserPass(user, password, res)) {
      //generamos una clave secreta para el JWT del usuario
      const secret = nanoid();
        
        if (nombre) {
                try {
                    const response = await dbConnection.query("UPDATE TABLE SET nombre = ?" , [nombre]);
                    res.send({
                    OK: 1,
                    message: 'Profile updated'
                    });
                } catch (error) {
                    if (error.code === 11000) {
                    res.status(409).send({
                        OK: 0,
                        error: 409,
                        message: error.message,
                    });
                    }
                    res.status(500).send({
                    OK: 0,
                    error: 500,
                    message: error.message,
                    });
                }
        }
        else if (apellidos) {
            try {
                const response = await dbConnection.query("UPDATE TABLE SET apellidos = ?" , [apellidos]);
                res.send({
                OK: 1,
                message: 'Profile updated'
                });
            } catch (error) {
                if (error.code === 11000) {
                res.status(409).send({
                    OK: 0,
                    error: 409,
                    message: error.message,
                });
                }
                res.status(500).send({
                OK: 0,
                error: 500,
                message: error.message,
                });
            }
        }
        else if (foto) {
            try {
                const response = await dbConnection.query("UPDATE TABLE SET foto = ?" , [foto]);
                res.send({
                OK: 1,
                message: 'Profile updated'
                });
            } catch (error) {
                if (error.code === 11000) {
                res.status(409).send({
                    OK: 0,
                    error: 409,
                    message: error.message,
                });
                }
                res.status(500).send({
                OK: 0,
                error: 500,
                message: error.message,
                });
            }
        }
    }
  };


exports.deleteUser = () => {};
