const scrapping = require('../utilities/scrapping');
//const dbConnection = require('../utilities/db');
const { doQuery } = require('../utilities/doQuery');
const { manipulateResults } = require('../utilities/manipulateResults');
const { buscaComparaFav } = require('../utilities/buscaComparaFav');

exports.getCourses = (req, res) => {
  const search = req.query.search;
  // const idUsuario=res.user.idUser;
  const idUsuario = 2;
  scrapping
    .scrappingCourses(search)
    .then(async (courses) => {
      let sql =
        'SELECT * FROM favoritos fav	WHERE fav.idUsuario = ' + `${idUsuario}`;

      const results = await doQuery(sql);
      let favoritosUsu = manipulateResults(results);
      console.log(favoritosUsu);
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
  let idUsuarioBack = req.params.idUsuario;

  try {
    let sql = 'SELECT * FROM favoritos 	WHERE idUsuario = ' + `${idUsuarioBack}`;

    const results = await doQuery(sql);
    res.json(manipulateResults(results));
    res.json(resultados);
    console.log(manipulateResults(results));

    res.send(manipulateResults(results));
  } catch (error) {
    if (error) {
      res.status(400).send(error);
    }
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

    console.log("idUsuario: " + idUsuario);
    let sql = `SELECT * FROM favoritos WHERE idUsuario = ${idUsuario}`;
    const existsInFavorites = await doQuery(sql);
    console.log("existsInFavorites: " + existsInFavorites);
    if (existsInFavorites == false){
      sql = `INSERT INTO favoritos(favorito,idUsuario,price,currentRating,author,url,tags,popularity,title,resume,image,level)values(${favorito},${idUsuario},"${price}","${currentRating}","${author}","${url}","${tags}","${popularity}","${title}","${resume}","${image}","${level}")`;

      const results = await doQuery(sql);
      console.log(results);
      if (results.affectedRows === 1) {
        res.status(200).send({
          OK: 1,
          message: 'favorito añadido',
        });
      } else {
        res.status(404).send({
          OK: 0,
          message: 'Error al añadir el favorito.',
        });
      }
    } else{
        res.status(404).send({
          OK: 0,
          message: 'Error al añadir el favorito.',
        });
    }
  } catch (error) {
    res.status(500).send({
      OK: 0,
      message: 'Error al añadir favorito ' + error,
    });
  }
};
