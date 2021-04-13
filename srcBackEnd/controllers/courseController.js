const scrapping = require('../utilities/scrapping');
const { doQuery } = require('../utilities/doQuery');
const { manipulateResults } = require('../utilities/manipulateResults');
const { buscaComparaFav } = require('../utilities/buscaComparaFav');
const jwt = require('jsonwebtoken');

exports.getCourses = async (req, res) => {
  const { search } = req.query;
  let idUsuario;

  const authorization = req.headers.authorization;

  if (authorization) {
    const token = authorization.split(' ')[1];

    const payload = jwt.decode(token);

    if (!payload) {
      idUsuario = -1;
    } else {
      const { idUser } = payload;
      let sql = `SELECT * FROM usuario WHERE id = ${idUser}`;

      const response = await doQuery(sql);

      if (response) {
        const { secreto } = response[0];

        try {
          jwt.verify(token, secreto);
          idUsuario = idUser;
        } catch (error) {
          idUsuario = -1;
        }
      } else {
        idUsuario = -1;
      }
    }
  } else {
    idUsuario = -1;
  }

  scrapping
    .scrappingCourses(search)
    .then(async (courses) => {
      let sql = `SELECT * FROM favoritos	WHERE idUsuario = ${idUsuario}`;

      const results = await doQuery(sql);
      let favoritosUsu = manipulateResults(results);
      for (let i = 0; i < courses.length; i++) {
        let course = courses[i];

        buscaComparaFav(course, idUsuario, favoritosUsu);
      }
      res.status(200).send({
        OK: 1,
        message: `cursos de la búsqueda ${search}`,
        courses: courses,
      });
    })
    .catch((error) =>
      res.status(500).send({
        OK: 0,
        message: `Error en búsqueda de cursos: ${error}`,
      }),
    );
};

exports.getFav = async (req, res) => {
  let { idUser } = res.user;

  try {
    let sql = 'SELECT * FROM favoritos 	WHERE idUsuario = ' + `${idUser}`;

    const results = await doQuery(sql);
    if (results.length !== 0) {
      const favoritos = results.map((el) => {
        el.favoritoID = el.id;
        return el;
      });
      res.send({
        OK: 1,
        message: `favoritos de usuario ${idUser} recibidos`,
        fav: manipulateResults(favoritos),
      });
    } else {
      res.status(404).send({
        OK: 0,
        message: `El usuario ${idUser} no tiene favoritos`,
      });
    }
    // res.json(resultados);
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: `Error al recoger favoritos: ${error}`,
    });
  }
};

exports.getCourse = async (req, res) => {
  let id = req.params.id;
  try {
    let sql = 'SELECT * FROM favoritos 	WHERE id = ' + `${id}`;
    const results = await doQuery(sql);
    res.json(results);
  } catch (error) {
    if (error) {
      res.status(400).send(error);
    }
  }
};

exports.deleteCourse = async (req, res) => {
  let id = req.params.id;

  try {
    let sql = `DELETE FROM favoritos	WHERE id = ${id}`;
    const results = await doQuery(sql);
    if (results.affectedRows === 1) {
      res.send({ OK: 1, message: 'curso borrado de favoritos' });
    } else {
      res.status(404).send({ OK: 0, message: `Error al borrar curso ${id}` });
    }
  } catch (error) {
    res.status(500).send({ OK: 0, message: `Error al borrar curso ${id}` });
  }
};

exports.addFav = async (req, res) => {
  try {
    let favorito = true;
    let idUsuario = res.user.idUser;
    let price = req.body.price;
    let currentRating = req.body.currentRating;
    let author = req.body.author;
    let title = req.body.title;
    let resume = req.body.resume;
    let image = req.body.image;
    let level = req.body.level;
    let url = req.body.url;
    let tags = req.body.tags;
    let popularity = req.body.popularity;

    let sql = `SELECT * FROM favoritos WHERE idUsuario = ${idUsuario} AND url = "${url}"`;
    const existsInFavorites = await doQuery(sql);
    if (existsInFavorites == false) {
      sql = `INSERT INTO favoritos(favorito,idUsuario,price,currentRating,author,url,tags,popularity,title,resume,image,level)values(${favorito},${idUsuario},"${price}","${currentRating}","${author}","${url}","${tags}","${popularity}","${title}","${resume}","${image}","${level}")`;

      const results = await doQuery(sql);
      if (results.affectedRows === 1) {
        res.status(200).send({
          OK: 1,
          message: 'favorito añadido',
          insertId: results.insertId,
        });
      } else {
        res.status(404).send({
          OK: 0,
          message: 'Error al añadir el favorito.',
        });
      }
    } else {
      res.status(409).send({
        OK: 0,
        message: `Error al añadir el favorito, ${url} ya existe.`,
      });
    }
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: 'Error al añadir favorito ' + error,
    });
  }
};
