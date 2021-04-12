async function buscaComparaFav(courses,idUsuario,favoritosUsu){
   
  

    for(let i=0;i<favoritosUsu.length;i++){
      
    
          if (favoritosUsu[i].url === courses.url){
   
          courses.favorito = true;
          //añado este campo para poder hacer luego borrado por id de favorito
          courses.favoritoID = favoritosUsu[i].id;
      
      
    }
  
    
    }
  
  }

  exports.buscaComparaFav= buscaComparaFav;