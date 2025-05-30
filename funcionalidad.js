const API_URL = 'https://restcountries.com/v3.1/all'; // constante que guarda la base de la API
const resultSection = document.getElementById('results'); // constante en la que se encuentra una referencia al primer objeto que se encuentra con el id "results"

document.getElementById('filterBtn').addEventListener('click', function(){
    applyFilters(); // aplica los filtros al hacer click en el botón 
});
document.getElementById('searchByName').addEventListener('input', function(){
    searchByName(); // filtra por nombre mientras lo vas escribriendo
});

let countriesData = []; // variable donde se iran almacenando la lista completa de los paises que descargamos de la API (los cuales estan en forma de objetos)

fetch(API_URL) // hace una solicitud HTTP a la URL de la API
  .then(function(response){
    return response.json(); // transforma el formato de la respuesta a JSON
    }) 
  .then(function(data){ //data es un JSON con paises
    countriesData = data; // se le asignan los datos a la variable countriesData
    renderCountries(countriesData); // se llama a la función renderCountries lo cual hace que se muestre la información de cada país
    })
  .catch(function(error){ // captura errores en el caso de que los haya, los errores suelen aparecer o en el fetch() o el .then  
    console.error('Error al obtener los datos:', error); // aqui lanza un mensaje de error en caso de que se encuentre uno         
    });

function renderCountries(countries) { // define una funcion que se llama renderCountries con el parametro countries
  resultSection.innerHTML = ''; // hace que se limpie el contenido del contenedor para evitar que se acumulen resultados antiguos
  if (countries.length === 0) { // cuenta la cantidad de paises que hay en countries y comprueba si este esta vacio
    resultSection.innerHTML = '<p>No countries were found.</p>'; // en caso de que no haya paises añade un <p> con el mensaje de que no se ha encontrado ningun pais
    return; // sale de la funcion para no seguir con renderizado vacio
  }

  countries.forEach(country => { // bucle que recorre cada elemento del array countries (forEach hace referencia al ir pasando de elemento en elemento y country es el objeto individual de cada país)
    const div = document.createElement('div'); // crea un nuevo elemento <div>
    div.className = 'country'; // le asigna la clase country al div que se acaba de crear
    
    let capital; // crea la variable capital
    if (country.capital) { // comprueba si country tiene valores en el atributo capital, es decir, que no es null ni undefined
      capital = country.capital[0]; // entre le da el valor de la capital del pais a la variable que se acababa de crear
    } else {                            
      capital = 'Sin datos'; // en caso de que no haya valores en el atributo capital del pais, se da un mensaje expresando la falta de datos
    }

    let idiomas; // crea la variable idiomas
    if (country.languages) { // comprueba si country tiene valores en el atributo languages
      idiomas = Object.values(country.languages).join(', '); // en caso de que si, crea un array de todos los idiomas que se hablan en ese país separados por comas
    } else {
      idiomas = 'Desconocido'; // en caso opuesto, es decir, que no se haya datos sobre los idiomas que se hablan en ese país, da un mensaje expresando que es desconocido
    }

    div.innerHTML = ` 
      <div class="country">
        <div class="info-container">
          <div class="text-info"
            <h3>${country.name.common}</h3>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Languages:</strong> ${idiomas}</p>
          </div>
          <div class="flag-container">
            <img class="flag" src="${country.flags.png}" alt="Flag of ${country.name.common}">
          </div>
        </div>
      </div>
    `; /* define el contenido HTML del <div> ⚠️NOTA⚠️: ${} sirve para hacer referencia a datos que estan fuera de la cadena de texto
        en la primera linea añade el nombre(name) comun(common) del pais(country --> objeto con la informacion de los paises, esta información la obtiene conforme va pasando por los paises es como un for elem in list: en python), entrando en cada una de las partes del JSON
        en la segunda, añade la informacion de la variable capital
        en la tercera, simplremente añade el nombre de la región en la que se encuentra
        en la cuarta, añade la cantidad de habitantes que hay en el país, haciendo uso de la función toLocaleString para ponerlo de forma que se entienda de mejor forma, es decir, separando los miles por puntos
        en la quinta, añade la informacion de la variable idiomas que habia sido previamente definida
        en la ultima, se añade la foto de la bandera del país, llamando a country, en este caso llama a flags y más concretamente a la version que está en png
    */  
    resultSection.appendChild(div); // agrega el div del país a la seccion de seccion de resultados de la página || el appendChild() hace que se creen unos debajo de otros
  });
}

function searchByName() { // define una función que se llama searchByName
  const name = document.getElementById('searchByName').value.toLowerCase(); // guarda en una constante que se llama name la información que se le pasa desde el input; DESGLOSE --> document.getElementById('searchByName') accede al input del HTML cuyo id sea igual a searchByName || .value accede a esa información que el usuario escribe || .toLowerCase() hace que todo texto se trate como minusculas, y que asi no haya problemas a la hora de buscar teniendo todo en mayúsculas ni nada parecido
  const filtered = countriesData.filter(function(c) { // countriesData es la lista con objetos de los paises || .filter es un metodo que va pasando por cada uno de los elementos del array y devuelve un true o false, si es true lo añade al nuevo array y si es false lo descarta 
  return c.name.common.toLowerCase().includes(name); // mira a ver si lo que el usuario a pasado por el input(name) esta dentro de alguno de los paises por los que se va pasando gracias al .filter en caso de que si, los devuelve
});
  renderCountries(filtered); // cuando el .function() haya pasado ya por cada uno de los paises y haya comprobado si name coincidia con la parte de alguno de ellos, devuelve de manera visual las coincidencias que se han encontrado a través del metodo renderCountries(), el cual hace que se muestre la informcaión de los paises que se han encontrado.
}

function applyFilters() { // crea una funcion que se llama applyFilters()
  const continent = document.getElementById('filterContinent').value; // almacena los datos del input cuyo id sea igual a filterContinent (con el .value y el getElementById) en una constante que se llama continent   
  const minPop = parseInt(document.getElementById('minPopulation').value) || 0; // almacena los datos del input cuyo id sea igual a minPopulation (con el .value y el getElementById) en una constante que se llama minPop; además se pone que el valor predeterminado 0
  const maxPop = parseInt(document.getElementById('maxPopulation').value) || Infinity; // almacena los datos del input cuyo id sea igual a maxPopulation (con el .value y el getElementById) en una constante que se llama maxPop; además se pone como valor predeterminado infinito
  const language = document.getElementById('filterLanguage').value.toLowerCase(); // almacena los datos del input en una constante llamada language, cuyo id sea igual a filterLanguage (con el .value y el getElementById) y lo pasa a minusculas para que no haya problemas en las coincidencias con el .toLowerCase()

  const filtered = countriesData.filter(function(c) { // al igual que antes; countriesData es la lista con objetos de los paises || .filter es un metodo que va pasando por cada uno de los elementos del array y devuelve un true o false, si es true lo añade al nuevo array y si es false lo descarta 
  const inContinent = !continent || c.region === continent; // hace varias cosas || 1. comprueba que haya datos en continent a través de !continent || 2. comprueba si el región del país (c.region) coincide con el lo que se pasa a través del input (continent) || 3. y esto lo guarda en una constante llamada inContinent en la cuál solo se encontrara un true o un false, ya que se guarda el resultado de una operación lógica || ⚠️ el significado de "||" es el equivalente a 'or' en muchos otros lenguajes ⚠️
  const inPopulation = c.population >= minPop && c.population <= maxPop; // aqui tambien pasan bastantes cosas || 1. comprueba que los datos de población sean mayores o iguales a la población mínima que se la ha pasado por el input (minPop) y también mira que los datos de población sean menores o iguales a la población máxima que se le ha pasado por el input (maxPop) y lo guarda en una constante que se llama inPopulation, la cual también puede ser solo true o false 
  const hasLanguage = !language || ( // se declara la constante hasLanguage, en la cual se va a guardar el resultado de una seria de comparaciones que se le vana a ir haciendo, la primera, por ejemplo será comprobar que hay datos en language por medio de !language
    c.languages && // comprueba si el país tiene la propiedad languages
    Object.values(c.languages).some(function(lang) { // Object.values(c.languages) convierte el objeto de idiomas en un array de valores, en el que estaran los idiomas en formato de texto y se usa .some(), el cual devuelve true si alguno de los idiomas cumple la condición que se encuentra dentro del .some() 
      return lang.toLowerCase().includes(language); // esta es la condición que tiene que intentar cumplir alguna de los paises que se encuentran de la lista de paises en formato de texto, la condición se basa en que lo que se recibe del input (language) sea parte o se incluya en alguno de los idiomas de la colección (lang) 
    })
  );
  return inContinent && inPopulation && hasLanguage; // comprueba que se cumplan todas las condiciones, es decir, que lo que contengan las constantes inContinent, inPopulation y hasLanguage sea igual a true
});

  renderCountries(filtered); // ejecuta renderCountries(filtered), el cual va recorrer los paises que hay en filtered (los cuales son los que cumplen las condiciones que el usuario a puesto a través de los filtros) y los va a mostrar en pantalla como se venia haceindo antes 
}
