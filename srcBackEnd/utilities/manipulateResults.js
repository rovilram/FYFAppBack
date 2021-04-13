const manipulateResults = (resultados) => {
  console.log(resultados);
    let coursesP=[];
     favoritos = resultados.map(function (resultado, index, array) {
      
         
       coursesP.push(resultado)
    

     
    });
    console.log(coursesP)
    return coursesP
    }


    exports.manipulateResults= manipulateResults;