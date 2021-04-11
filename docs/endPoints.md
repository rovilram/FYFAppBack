# ENDPOINTS

Los endpoint marcados con (TOKEN AUTH) requieren que sea enviado un token JWT por el campo AUTHORIZATION

## COURSES

**OK** **courses?search=""** _GET_ (TOKEN AUTH) Devuelve los cursos con una determinada búsqueda.

**courses/fav** _GET_ (TOKEN AUTH) Devuelve los cursos favoritos del usuario.

## AUTH

**OK** **/login** _POST_ Logea con email y contraseña.

**OK** **/signup** _POST_ Registra usuario con email y contraseña (y se añaden otros datos de usuario).

**OK** **/logout** _GET_ (TOKEN AUTH) Desconecta al usuario.

**OK** **/authuser** _GET_ (TOKEN AUTH) Confirma si el token del usuario es válido. **Por si es necesario para front**

**OK** **/google-link** _GET_ pasamos por query params `?action=login` o `?action=signup` en función de si queremos un tipo de link u otro, back envía un link para el botón de google correspondiente

**/google-oauth** _GET_ envía el código de un solo uso de google OAuth para verificar identidad.

**OK** **/newpass** _POST_ recoge un email y envía un correo electrónico con un JWT firmado por la pass guardada en BD.

**OK** **/changepass** _POST_ (PASS RECOVERY TOKEN AUTH) recoje una nueva contraseña y la asigna al correo del token válido. cambia también la clave secreta.

## USERS

**/user** _GET_ (TOKEN AUTH) Devuelve los datos de perfil del usuario.

**/user** _PATCH_ (TOKEN AUTH) Modifica alguno de los datos de perfil del usuario.
