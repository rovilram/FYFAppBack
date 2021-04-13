const manipulateResults = (resultados) => {
    let coursesP=[];
     favoritos = resultados.map(function (resultado, index, array) {
      
         
       coursesP.push(resultado)
    

     
    });
   
    return coursesP
    }


    exports.manipulateResults= manipulateResults;