var matrixInputs = [];

//создание инпутов для ввода матрицы
function createMatrixInputs(node) {
  matrixInputs = []
  
var size = document.getElementsByClassName("matrix-size")[0].value
  size = document.getElementsByClassName("matrix-size")[0].value 

  if(node.rows.length != 0) {
    for (var i = node.rows.length -1; i >= 0; i -= 1) {
      var row = node.deleteRow(i)
    }
  }


    for (var i = 0; i < size; i += 1) {
      let caption = node.createCaption();
      caption.textContent = 'Матрица смежности';
      var row = node.insertRow()
      var inputsRow = []
      matrixInputs.push(inputsRow)
      for (var j = 0; j < size; j += 1) {
        var cell = row.insertCell()
        cell.style.padding = '1px'
        var input = document.createElement('input')
        inputsRow.push(input)
        input.type = 'text'
        input.style.width = '18px'
        input.style.height = '18px'
        input.style.padding = '5px 10px';
        cell.appendChild(input)
      }
    }
    return matrixInputs
  }

  
  //получить значения матрицы
function getMatrixValues(matrixInputs) {
    var res = []
    for (var i = 0; i < matrixInputs.length; i += 1) {
        var inputsRow = matrixInputs[i]
        var valuesRow = []
        for (var j = 0; j < inputsRow.length; j += 1) {
            var input = inputsRow[j]
            var valueNum = parseFloat(input.value)
            if (isNaN(valueNum)) {
                valueNum = 0
            }
            valuesRow.push(valueNum)
        }
        res.push(valuesRow)
    }
    return res
}

//получение неориентированного графа
function getNonoriented (matrix) {
  for (var i = 0; i < matrix.length; i++) {
    for (var j = 0; j < matrix.length; j++) {
      if(j > i) {
        if (matrix[i][j] != matrix[j][i]) {
          if (matrix[i][j] == 0) {
            matrix[i][j] = 1;
          }
          else if (matrix[j][i] == 0) {
            matrix[j][i] = 1;
          }
        }
      }

    }
  }

  return matrix;
}

//расчет показателей цетрализации
function centralization () {
  var matrix = getMatrixValues(matrixInputs);
  // var size = document.getElementsByClassName("matrix-size")[0].value;

    // var matrix = [
  //   [0,-1,4,99,99],
  //   [99,0,3,2,2],
  //   [99,99,0,99,99],
  //   [99,1,5,0,99],
  //   [99,99,99,-3,0]
  // ];
  // var matrix = [
  //   [0,0,0,1,0,1],
  //   [1,0,1,1,0,0],
  //   [0,0,0,1,0,0],
  //   [1,0,0,0,0,1],
  //   [0,0,0,1,0,0],
  //   [0,0,1,0,1,0]
  // ];

  var nonoriented = [];
  for(var i = 0; i < matrix.length; i++) {
    nonoriented[i] = [];
    for(var j = 0; j < matrix.length; j++) {
      nonoriented[i][j] = matrix[i][j];
    }
  }

  nonoriented = getNonoriented(nonoriented);

  console.log('nonor',nonoriented)

  var paths = search_path(matrix);
  var nonorpaths = search_path(nonoriented);

  var Q = 0;
  for (var i = 0; i < paths.length; i++) {
    for (var j = 0; j < paths.length; j++) {
      Q += paths[i][j];
    }
  }

  var Qnon = 0;
  for (var i = 0; i < nonorpaths.length; i++) {
    for (var j = 0; j < nonorpaths.length; j++) {
      Qnon += nonorpaths[i][j];
    }
  }

  var Z = [];
  for (var i = 0; i < paths.length; i++) {
    Z[i] = 0;
    for (var j = 0; j < paths.length; j++) {
      Z[i] += paths[i][j];
    }
    Z[i] = Q/2/Z[i];
  }

  var Znon = [];
  for (var i = 0; i < nonorpaths.length; i++) {
    Znon[i] = 0;
    for (var j = 0; j < nonorpaths.length; j++) {
      Znon[i] += nonorpaths[i][j];
    }
    Znon[i] = Qnon/2/Znon[i];
  }

  var sigma = 0;
  sigma = (paths.length-1)*(2*Math.max.apply(null, Z)-paths.length)/(Math.max.apply(null, Z)*(paths.length-2));
  
  var sigmanon = 0;
  sigmanon = (nonorpaths.length-1)*(2*Math.max.apply(null, Znon)-nonorpaths.length)/(Math.max.apply(null, Znon)*(nonorpaths.length-2));
  

  console.log('sigma',sigma)
  console.log('Q',Q)
  console.log('Z',Z)

  console.log('sigman',sigmanon)
  console.log('Qn',Qnon)
  console.log('Zn',Znon)

  var node = document.querySelector('.dataEntryOr');

  var size = paths.length;

  for (var i = 0; i < size; i++) {
    let caption = node.createCaption();
    caption.textContent = 'Матрица кратчайших путей (ориентированный граф)';
    var row = node.insertRow()
    var inputsRow = []
    matrixInputs.push(inputsRow)
    for (var j = 0; j < paths.length; j++) {
      var cell = row.insertCell()  
      var number = document.createTextNode(paths[i][j])
      cell.style.border = '1px solid black'
      // if (paths[i][j] == 99) {
      //   cell.style.backgroundColor = '#ff4848';
      // } else if (paths[i][j] == 0) {
      //   cell.style.backgroundColor = '#4d84ff';
      // } else {
      //   cell.style.backgroundColor = '#37ff37';
      // }
      cell.appendChild(number)
    }
  }
  node.append()

  var centr = document.querySelector('.centralizationOr');
  centr.innerHTML += `Q = ` + Q + '<br>';
  for (var i = 0; i < Z.length; i++) {
    var i1 = i + 1
    centr.innerHTML += `Z` + '('+ i1 +') = ' + Z[i] + '<br>' ;
  }
  centr.innerHTML += `σ = ` + sigma + '<br>';
  

  node = document.querySelector('.dataEntryNonOr');

  for (var i = 0; i < size; i++) {
    let caption = node.createCaption();
    caption.textContent = 'Матрица кратчайших путей (неориентированный граф)';
    var row = node.insertRow()
    var inputsRow = []
    matrixInputs.push(inputsRow)
    for (var j = 0; j < nonorpaths.length; j++) {
      var cell = row.insertCell()  
      var number = document.createTextNode(nonorpaths[i][j])
      cell.style.border = '1px solid black'
      // if (paths[i][j] == 99) {
      //   cell.style.backgroundColor = '#ff4848';
      // } else if (paths[i][j] == 0) {
      //   cell.style.backgroundColor = '#4d84ff';
      // } else {
      //   cell.style.backgroundColor = '#37ff37';
      // }
      cell.appendChild(number)
    }
  }

  centr = document.querySelector('.centralizationNonOr');
  centr.innerHTML += `Q = ` + Qnon + '<br>';
  for (var i = 0; i < Znon.length; i++) {
    var i1 = i + 1
    centr.innerHTML += `Z` + '('+ i1 +') = ' + Znon[i] + '<br>' ;
  }
  centr.innerHTML += `σ = ` + sigmanon + '<br>';
  

}

//поиск кратчайших путей
function search_path(matrix) 
{ 
  var size = matrix.length;
  var graph = [];

  var k = 0;
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      if (matrix[i][j] != 0 && matrix[i][j] != 99) {
        graph[k] = new Array;
        graph[k][0] = i;
        graph[k][1] = j;
        graph[k][2] = matrix[i][j];
        k++;
      }
    }
  }

  var V = size;
  var E = graph.length
  // console.log('V', V)
  // console.log('E', E)
  // console.log('g', graph)

  var paths = [];
  var  p;

  for (var i = 0; i < size; i++) {
    paths[i] = BellmanFord(graph, V, E, i);
  }

  console.log(paths)

  return paths;
} 

function BellmanFord(graph, V, E, src) {
  var dis = [V]; 
  for (var i = 0; i < V; i++) 
    dis[i] = Number.MAX_VALUE; 

  dis[src] = 0; 

  for (var i = 0; i < V - 1; i++) { 
    for (var j = 0; j < E; j++) { 
      if (dis[graph[j][0]] + graph[j][2] < dis[graph[j][1]]) 
        dis[graph[j][1]] = dis[graph[j][0]] + graph[j][2]; 
    } 
  } 

  for (var i = 0; i < E; i++) { 
    var x = graph[i][0]; 
    var y = graph[i][1]; 
    var weight = graph[i][2]; 
    if (dis[x] != Number.MAX_VALUE && dis[x] + weight < dis[y]) 
      console.log("Graph contains negative weight cycle")
  } 

  for (var i = 0; i < V; i++) {
      if(dis[i] > 99) {
        dis[i] = 0;
      }
  }

  return dis;
} 


