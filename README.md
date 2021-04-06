# FYFApp

## Requisitos del proyecto

<br>

Se pide desarrollar una aplicación web de búsqueda y gestión de `ofertas laborales en España / proyectos freelance en todo el mundo / cursos on-line sobre desarrollo web` .
Dicha app deberá contemplar las siguientes vistas y funcionalidades:
<br>
<br>

### Menú

<br>
Estará presente en todas las vistas de la app.

Tendrá los siguientes enlaces:

- Inicio : `/`
- Registrarse : `/registro`
- Ingresar : `/ingresar`
- Salir : `/salir` (redirige a `/`)
- Favoritos : `/favoritos`

<br>
<br>

### Vista inicial (home)

<br>

`/` : Vista de inicio de la app. Tendrá como mínimo un input de texto y un botón para efectuar la búsqueda. Una vez realizada la misma, se mostrará debajo una lista de "tarjetas" que contengan los datos más relevantes de cada resultado y un botón para guardar cada una de ellas en `favoritos`.
Cada "tarjeta" contendrá un enlace a la fuente original de la información, que se abrirá en una pestaña nueva del navegador.  
Cada vez que se realice una nueva búsqueda, los resultados anteriores dejarán de mostrarse.

#### Sobre guardar en favoritos:

El botón para guardar en favoritos se muestra solo en el caso de que el usuario esté logueado. Si no lo está, el botón no se muestra.
<br>
<br>

### Vista registro

<br>

<strong>`/registro`</strong> : Registro de usuario nuevo. Tendrá como mínimo un formulario de email y contraseña como credenciales de entrada a la app. Además, deberá ofrecer la alternativa de identificación mediante Google, Facebook u otro proveedor de autenticación a elección.
<br>
<br>

### Vista ingresar

<br>

<strong>`/ingresar`</strong> : Validación de credenciales, abrir sesión y redirección **home**.

<br>
<br>

---

---

_Opcional: Se podrá ofrecer la opción de recuperar contraseña. Esto implica construir dos vistas nuevas:_

_- Recuperar password : <strong>`/recuperarpassword`</strong>_

_Tendrá un input para ingresar el e-mail y un botón. Al hacer click se enviará al e-mail (previa comprobación de que corresponde a un usuario existente en la BD) un link que redirija a "/reestablecerpassword" y que además contendrá un JWT._

_- Reestablecer password : <strong>`/reestablecerpassword`</strong>_

_Tendrá un input para ingresar la nueva contraseña. Dicha actualización impactará en la BD previa comprobación de la validez del JWT._

---

---

<br>
<br>

### Vista favoritos

<br>

<strong>`/favoritos`</strong> : Mostrará los resultados seleccionados por el usuario como favoritos, del mismo modo en que se muestran los resultados de búsqueda. Cada "tarjeta" tendrá un botón para borrar la selección de favoritos. Esta vista será privada y solo se podrá acceder si el usuario está logueado.

<br>
<br>

### Notas adicionales

<br>

Sobre el control de acceso
La aplicación debe estar protegida a entradas indebidas de usuarios no registrados (o autorizados por un proveedor externo), de manera que el endpoint asociado a la zona privada (`/favoritos`) comprobará si la sesión está abierta, y en caso contrario redireccionará al área `login` de la app.
<br>
<br>

Para el `login` con credenciales email y contraseña, deberá hacerse mediante JWT. Para la parte de login con uno o más proveedores de terceros deberá hacerse mediante `OAuth` (con o sin Firebase, a elegir; en cualquier caso, con un proveedor OAuth será suficiente).

<br>
<br>

### Sobre el modelo de datos

<br>

El almacenamiento y la búsqueda de los datos, se realizará de la siguiente manera:

Toda la información relativa a los `usuarios` de la plataforma (credenciales y otras cuestiones de acceso, así como la asociación de favoritos a usuarios) se almacenará en una base de datos relacional SQL.

Los datos de las búsquedas provendrán del scraping de al menos dos webs distintas que deberán seleccionarse previo análisis.

El modelo de datos dependerá de la información que pueda recogerse de las plataformas elegidas.

<br>
<br>

### Sobre la UX/UI

<br>

La aplicación debe ser `mobile-first`.

Se valorará positivamente que además sea `PWA` (progressive web app), si bien esto último es totalmente opcional.
<br>
<br>

### Sobre los recursos de terceros

Se permite (y recomienda, si con ello se minimiza el tiempo de desarrollo y se acelera así el de entrega) el `uso de cualquier recurso de terceros` (librerías, paquetes npm, etc.) además del código propio.

<br>
<br>

### Sobre la metodología

<br>

Durante el desarrollo del proyecto completo, se seguirá una metodología ágil tipo SCRUM.

Esto implicará el establecimiento de un backlog de tareas, un sprint con sus story points y reparto de tareas.

_Opcionalmente, se valorará positivamente aplicar TDD (e2e y pruebas unitarias)._

<br>
<br>

---

---

<br>

### Especificaciones para grupo de <span style="color:green">OFERTAS LABORALES</span>

<br>

- Las ofertas de empleos en programación que ofrezca el buscador serán _sin experiencia previa_

<br>
<br>

### Especificaciones para grupo de <strong><span style="color:purple">PROYECTOS FREELANCE</span></strong>

<br>

- Las ofertas de proyectos freelance en programación deben ser pequeños proyectos.

<br>
<br>

### Especificaciones para grupo de <strong><span style="color:orange">CURSOS DE PROGRAMACIÓN</span></strong>

<br>

- El objetivo de esta búsqueda es que la app ofrezca todos los resultados de los cursos encontrados destacando visualmente el que la app defina como "recomendado".
