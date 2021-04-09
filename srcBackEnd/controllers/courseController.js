const scrapping = require('../utilities/scrapping');

exports.getCourses = (req, res) => {
  const search = req.query.search;
  scrapping
    .scrappingCourses(search)
    .then((courses) => {
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

exports.getCourse = (req, res) => {};

exports.getFav = (req, res) => {
 

};
