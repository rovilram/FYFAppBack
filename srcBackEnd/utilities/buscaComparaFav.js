const {doQuery}= require('./doQuery')
const {manipulateResults}=require('./manipulateResults')

async function buscaComparaFav(courses,idUsuario,favoritosUsu){
   
  

    for(let i=0;i<favoritosUsu.length;i++){
      
    
          if (favoritosUsu[i].url === courses.url){
   
          courses.favorito =true;
      
      
    }
  
    
    }
  
  }

  exports.buscaComparaFav= buscaComparaFav;