const cheerio = require('cheerio');
const axios = require('axios');
const base64url = require('base64url');
const EIT_URL = 'https://escuela.it/api/course/get-all';

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
      let rating = $('.Course-interaction-ratings');
      let currentRating = rating.children('eit-rating').attr('currentrating');
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
            //id: `eit-${curso.id}`,
            id: base64url(curso.extra.url),
            title: curso.title,
            resume: curso.excerpt,
            image: `https://escuela.it//storage/${curso.image_thumbnail}`,
            level: curso.extra.level_number,
            url: curso.extra.url,
            popularity: curso.extra.popularity,
            tags:
              curso.related_tags.reduce((acc, tag) => {
                acc = acc + ' ' + tag.name;
                return acc;
              }, ' ') +
              ' ' +
              curso.extra.plainCategories +
              ' ' +
              curso.extra.plain_tags,
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
    .then((data) => {
      //TODO: añadir aquí la función del otro proveedor de cursos, homogeneizar y unir los dos arrays
      return data;
    })
    .catch((err) => {
      console.log('ERROR:');
      throw err;
    });
}

//scrappingCourses('deno').then((data) => console.log(data));

exports.scrappingCourses = scrappingCourses;
