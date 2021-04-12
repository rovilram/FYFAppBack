const scrapping = require('../utilities/scrapping');
const dbConnection = require('../../src/configs/db');
const {doQuery}= require('../utilities/doQuery')
const {manipulateResults}=require('../utilities/manipulateResults')
const {buscaComparaFav}=require('../utilities/buscaComparaFav')




exports.getCourses = (req, res) => {
  const search = req.query.search;
  // const idUsuario=res.user.idUser;
  const idUsuario=2;
  scrapping
    .scrappingCourses(search)
    .then(async (courses) => {
    
    let sql =('SELECT * FROM favoritos fav	WHERE fav.idUsuario = '+`${idUsuario}`);
  
    const results = await doQuery(sql);
    let favoritosUsu=manipulateResults(results)
    console.log(favoritosUsu)
     for(let i=0;i<courses.length;i++){
       let course=courses[i];
      
       buscaComparaFav(course,idUsuario,favoritosUsu)
      
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



exports.getFav= async (req, res) => {
 
    let idUsuarioBack=req.params.idUsuario;
    
    try{
    let sql =('SELECT * FROM favoritos 	WHERE idUsuario = '+`${idUsuarioBack}`);
 
    const results = await doQuery(sql);
 res.json(manipulateResults(results))
    res.json(resultados)
   console.log(manipulateResults(results));
      
          res.send(manipulateResults(results));
    } catch (error) {
      if (error) {
        res.status(400).send(error);
  };
}
}

exports.getCourse = async (req, res) => {
 let id =req.params.id;
try{
  let sql =('SELECT * FROM favoritos 	WHERE id = '+`${id}`);
  const results = await doQuery(sql);
  res.json(results)

} catch (error) {
       if (error) {
           res.status(400).send(error);
                   }
};

}


exports.deleteCourse = async (req,res)=>{
    let id=req.params.id;
  
   try {
       
      let sql =('DELETE FROM favoritos fav	WHERE fav.id = '+`${id}`);
      const results = await doQuery(sql);
      res.send("curso borrado de favoritos") 

    } catch (error) {
    res.status(400).send(error);
    }
   
}


exports.addFav= async (req,res)=>{

  try {
    
 
  let favorito=true;
  let idUsuario=req.params.idUsuario;
 
  let id=req.body.id;
  
  let price=req.body.price;
  
  let currentRating=req.body.currentRating;
  
  let author=req.body.author;
  
  let title=req.body.title;
  
  let resume=req.body.resume;

  
  let image=req.body.image;
  
  let level=req.body.level;

  let url=req.body.url;

  let tags=req.body.tags;

  let popularity=req.body.popularity;

    
  let sql =(`INSERT INTO favoritos(favorito,id,idUsuario,price,currentRating,author,url,tags,popularity,title,resume,image,level)values(${favorito},"${id}",${idUsuario},"${price}","${currentRating}","${author}","${url}","${tags}","${popularity}","${title}","${resume}","${image}","${level}")`);

  const results = await doQuery(sql);
    console.log(results)
  res.json(results)
} catch (error) {
  res.status(400).send(error);
}

}
