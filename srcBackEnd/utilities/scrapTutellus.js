const cheerio=require('cheerio');
const  axios = require('axios');
const { each } = require('bluebird');
const search="";


async function scrapTutellus (url) {

    let arrayDataCourse=[];
    let response=  axios.get(url)
    .then((response) => {
       
 
    transform: body => cheerio.load(response.data);
     let $= cheerio.load(response.data);
    
   $('div.m-coursebox').each(function (i, e) {
        
        let title=$(e).children('span').attr('title')
        let img=$(e).children('span').children('img').attr('src')
        let price= $(e).children('div.course-stats').children('div.price').children('strong.final-price').text()
        if (price === "Gratis"){
          price = parseInt(0)
        } else {
          price = parseInt(price.replace("€","").trim())
        }
        let author =$(e).children('div.course-info').children('img').attr('alt')
        let   currentRating =$(e).children('div.course-stats').children('div.m-stars').children('span.ion-android-star').text()
        currentRating = parseFloat(currentRating, 10);
        let urlDetalle=$(e).children('div.course-info').children('h3.course-title').children('a').attr('href')
        let url=`https://www.tutellus.com${urlDetalle}`;
           const    dataCourse={
                    favorito: false,
                    img :img,    
                    title :title,
                    author :author,
                    price : price,
                    currentRating :  currentRating , 
                    url : url, 
                    resume:""
                }
             
                arrayDataCourse.push(dataCourse)
                })
              
    return arrayDataCourse;
    
    })
    .catch((error) => {
        throw error;
      });
    return  response;

}
async function scrapDetalle (href) {
    let response= await axios.get(href)
      .then((response) => {
          
         transform: body => cheerio.load(response.data);
       let $= cheerio.load(response.data);
       let resume= $('main.col3of4').children('div.block-text').children('p').text(); 
       
      
        return  resume;
      })
      .catch((error) => {
        throw error;
      });
     return await response;
  }    
async function addFields (arrayCursos){
    
const addFields = await arrayCursos.map(
    (objeto) =>{
        const secondScrap = scrapDetalle(objeto.url)
        .then((response)=>{
            objeto.resume = response;
            return objeto
        })
        .catch((error) => {
            throw error;
          });
        return secondScrap;
    })
    
   return Promise.all(addFields);

}

async function main(search) {

    const url=`https://www.tutellus.com/buscador/${search}/cursos`
    const arrayTutellus = await scrapTutellus(url);
    const arrayTutellusTotal = await addFields(arrayTutellus);   
    //console.log(arrayTutellusTotal);
    return arrayTutellusTotal;
}

main("java");
exports.main = main;