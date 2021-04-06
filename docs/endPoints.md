# ENDPOINTS

Los endpoint marcados con (TOKEN AUTH) requieren que sea enviado un token JWT por el campo AUTHORIZATION

## COURSES

**courses?search=""** _GET_ (TOKEN AUTH) Devuelve los cursos con una determinada búsqueda.

**courses/:id** _GET_ (TOKEN AUTH) Devuelve el curso con un determinado id.

**courses/fav** _GET_ (TOKEN AUTH) Devuelve los cursos favoritos del usuario.

## AUTH

**/login** _POST_ Logea con email y contraseña.

**/signup** _POST_ Registra usuario con email y contraseña (y se añaden otros datos de usuario).

**/logout** _GET_ (TOKEN AUTH) Desconecta al usuario.

**/authuser** _GET_ (TOKEN AUTH) Confirma si el token del usuario es válido. **Por si es necesario para front**

**/google-oauth** _POST_ envía el código de un solo uso de google OAuth para verificar identidad.

## USERS

**/user** _GET_ (TOKEN AUTH) Devuelve los datos de perfil del usuario.

**/user** _PATCH_ (TOKEN AUTH) Modifica alguno de los datos de perfil del usuario.

**/user** DELETE (TOKEN AUTH) Borra la cuenta del usuario ???? **Ver si es necesario hacerlo...**
