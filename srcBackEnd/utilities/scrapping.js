const cheerio = require('cheerio');
const axios = require('axios');
const base64url = require('base64url');
const EIT_URL = 'https://escuela.it/api/course/get-all';
const scrapTutellus = require('./scrapTutellus')

async function scrapDetalle(href) {
  //recogemos la info con axios
  let response = await axios
    .get(href)
    .then((response) => {
      let dataCourse;
      //transformamos los datos con transform:body
      //para poder leer el html
      transform: (body) => cheerio.load(response.data);
      let $ = cheerio.load(response.data);
      let price = $('.Course-price-promo').text();

      if (price === "Gratis"){
        price = parseInt(0)
      } else {
        price = parseInt(price.replace("€","").trim())
      }

      let rating = $('.Course-interaction-ratings');
      let currentRating = rating.children('eit-rating').attr('currentrating');
      currentRating = parseFloat(currentRating, 10);
      let author = $('.Person-name').text();
      dataCourse = {
        price: price,
        currentRating: currentRating,
        author: author,
      };
      return dataCourse;
    })
    .catch((error) => {
      throw error;
    });
  return await response;
}

async function eitScrapping(url) {
  const result = await axios
    .get(url)
    .then((response) => response.data)
    .then((courses) => {
      if (!courses.error) {
        const newCourses = courses.data.map((curso) => {
          const object = {
            //no hacemos una propiedad id, vamos a basar los favoritos en
            //la propiedad url
            //id: `eit-${curso.id}`,
            //id: base64url(curso.extra.url),
            favorito: false,
         
            title: curso.title,
            resume: curso.excerpt,
            image: `https://escuela.it//storage/${curso.image_thumbnail}`,
            // level: curso.extra.level_number,
            url: curso.extra.url,
            // popularity: curso.extra.popularity,
            // tags:
            //   curso.related_tags.reduce((acc, tag) => {
            //     acc = acc + ' ' + tag.name;
            //     return acc;
            //   }, ' ') +
            //   ' ' +
            //   curso.extra.plainCategories +
            //   ' ' +
            //   curso.extra.plain_tags,
          };
          return object;
        });
        return newCourses;
      }
    })
    .catch((error) => {
      throw error;
    });
  return await result;
}

//TODO: cuando tenga filtrada la búsqueda, llenamos con el resto de datos que necesitamos
function eitCoursesFilter(courses, filter) {
  const regex = new RegExp(filter, 'i');
  return courses.filter((course) =>
    regex.test(course.title + course.tags + course.resume),
  );
}

async function eitAddFields(courses) {
  const coursesPromise = await courses.map((course) => {
    const secondScrap = scrapDetalle(course.url).then((response) => {
      course.price = response.price;
      course.currentRating = response.currentRating;
      course.author = response.author;

      return course;
    });
    return secondScrap;
  });
  return Promise.all(coursesPromise);
}

async function scrappingCourses(filter) {
  return await eitScrapping(EIT_URL)
    .then((courses) => eitCoursesFilter(courses, filter))
    .then((courses) => eitAddFields(courses))
    .then(async(data) => {
      const arrayTutellus = await scrapTutellus.main(filter)
      const allCoursesScrap = data.concat(arrayTutellus);

      allCoursesScrap
        .sort((a,b)=> (a.price > b.price ? 1 : -1))
        .sort((a,b)=> (a.currentRating < b.currentRating))

      return allCoursesScrap;
    })
    .catch((err) => {
      console.log('ERROR:');
      throw err;
    });
}

async function udemyAPI() {
  /* Nombre	FYFApp
Identificación del cliente	l6peixchfRVvngLsy2a0gr1pKmp3TqBa9p7ZS1Gj
Secreto de cliente	UIQ7wJu23Q25kfT7PpP398N3TQx6g06LZMljgjX7pCgFww1Zwjgc1AhMT0Tya50cvqSFCnT1NSInEIycLaE4w0N2nnCsjZLeWOTpJ0NUtbRBVBC7SdSfxKMJjTBFvLSn
Descripción	Estamos desarrollando una app como desarrolladores fullstack sobre plataformas de aprendizaje en el modo IT y Desarrollo web. Pedimos acceso a la información de vuestra api para ver y mostrar en nuestra app cómo está la situación actual de formación.
Sitio web	https://fyf-app.000webhostapp.com/
Estado	Aprobado */

  /* {
    title: OK,
    resume: OK "headline",
    image: OK https://img-b.udemycdn.com/course/480x270/980450_7fc0_3.jpg?secure=lTj3wdXKxHHW_AN7ObWXAw%3D%3D%2C1618152908,
    level: 2,
    url: 'https://escuela.it/cursos/back-edge-desarrollo-web-al-limite-nodejs-es6-npm-mongodb',
    popularity: 4.857142857142857,
    tags: '  Express NodeJS Javascript Backend backend  Express NodeJS Javascript Backend ',
    price: OK,
    currentRating: '5',
    author: OK "visible_instructors[0]."title"'
  }, */

  const token =
    'Basic bDZwZWl4Y2hmUlZ2bmdMc3kyYTBncjFwS21wM1RxQmE5cDdaUzFHajpVSVE3d0p1MjNRMjVrZlQ3UHBQMzk4TjNUUXg2ZzA2TFpNbGpnalg3cENnRnd3MVp3amdjMUFoTVQwVHlhNTBjdnFTRkNuVDFOU0luRUl5Y0xhRTR3ME4ybm5Dc2paTGVXT1RwSjBOVXRiUkJWQkM3U2RTZnhLTUpqVEJGdkxTbg==';

  const result = await axios.get(
    'https://www.udemy.com/api-2.0/courses/?search=javascript?fields=@all',
    {
      headers: {
        Authorization:
          'Basic bDZwZWl4Y2hmUlZ2bmdMc3kyYTBncjFwS21wM1RxQmE5cDdaUzFHajpVSVE3d0p1MjNRMjVrZlQ3UHBQMzk4TjNUUXg2ZzA2TFpNbGpnalg3cENnRnd3MVp3amdjMUFoTVQwVHlhNTBjdnFTRkNuVDFOU0luRUl5Y0xhRTR3ME4ybm5Dc2paTGVXT1RwSjBOVXRiUkJWQkM3U2RTZnhLTUpqVEJGdkxTbg==',
      },
    },
  );

  console.log(result.data.results.length);
}

//udemyAPI();

exports.scrappingCourses = scrappingCourses;
