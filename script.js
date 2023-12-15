class File {
  constructor(name, content = '') {
    this.name = name;
    this.content = content;
    this.isDirectory = false;
    this.created = new Date();
  }
}

// Clase que representa un directorio
class Directory {
  constructor(name) {
    this.name = name;
    this.isDirectory = true; // Siempre es un directorio
    this.children = []; // Almacena archivos y subdirectorios
    this.created = new Date();
  }
}

// Clase que gestiona la estructura del sistema de archivos
class FileManager {
  constructor() {
    this.root = new Directory('root'); // El directorio raíz
  }

  // Agrega un archivo o directorio al nodo padre
  addFileOrDirectory(parent, name, isDirectory = true, content = '') {
    const newNode = isDirectory ? new Directory(name) : new File(name, content);
    parent.children.push(newNode);
    return newNode;
  }

  // Busca un nodo por nombre en la estructura del sistema de archivos
  findNodeByName(node, name) {
    if (node.name === name) {
      return node;
    }

    if (node.isDirectory) {
      for (const child of node.children) {
        const result = this.findNodeByName(child, name);
        if (result) {
          return result;
        }
      }
    }

    return null;
  }

  // Obtiene los hijos de un nodo
  getChildren(node) {
    return node.children;
  }

  // Elimina un archivo o directorio del nodo padre por nombre
  deleteFileOrDirectory(parent, name) {
    parent.children = parent.children.filter((child) => child.name !== name);
  }

  // Muestra la estructura del directorio en la consola
  displayDirectoryStructure(node, depth = 0) {
    console.log(
      '  '.repeat(depth) +
        node.name +
        (node.isDirectory ? '/' : ':') +
        '\n' +
        '  '.repeat(depth) +
        (node.isDirectory ? '' : node.content)
    );
    if (node.isDirectory) {
      for (const child of node.children) {
        this.displayDirectoryStructure(child, depth + 1);
      }
    }
  }
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-');
}

// Crea una instancia de la clase FileManager
const fileManager = new FileManager();

// Crea la estructura de directorios y archivos
const root = fileManager.root;
const documents = fileManager.addFileOrDirectory(root, 'documents');
const pictures = fileManager.addFileOrDirectory(root, 'pictures');
const vacation = fileManager.addFileOrDirectory(pictures, 'vacation');
const work = fileManager.addFileOrDirectory(documents, 'work');
const mate = fileManager.addFileOrDirectory(work, 'mate');

const report = fileManager.addFileOrDirectory(
  work,
  'report',
  false,
  'Content of the report.\nlorem ipsum dolor sit amet.'
);

// Función para renderizar la estructura de directorios en una interfaz de usuario
function renderDirectories(node = root) {
  const goBack = document.createElement('li');
  var lastDir;
  const currentDir = fileManager.findNodeByName(
    node,
    document.getElementById('directories').lastElementChild.lastElementChild
      .innerHTML
  );

  const display = document.getElementById('files');

  fileManager.getChildren(currentDir).forEach((child, i) => {
    const tr = document.createElement('tr');
    const num = document.createElement('td');
    const name = document.createElement('td');
    const type = document.createElement('td');
    const date = document.createElement('td');
    const icon = document.createElement('i');

    num.innerHTML = i + 1;
    date.innerHTML = formatDate(child.created);

    if (child.isDirectory) {
      type.innerHTML = 'Directorio';
      icon.classList = 'fa-solid fa-folder';
      name.appendChild(icon);
      tr.addEventListener('click', function () {
        lastDir = currentDir;
        console.log(lastDir);
        display.innerHTML = '';

        const strong = document.createElement('strong');
        const li = document.createElement('li');
        strong.innerHTML = child.name;
        strong.onclick = goToDirectory;
        li.appendChild(strong);
        li.setAttribute('id', parseInt(document.getElementById('directories').lastElementChild.id) + 1);
        document.getElementById('directories').append(li);
        renderDirectories(child);
      });
      display.appendChild(tr);
    } else {
      type.innerHTML = 'Archivo';
      icon.classList = 'fa-solid fa-file';
      name.appendChild(icon);
      tr.addEventListener('click', function () {
        const view = document.getElementById('view');
        view.innerHTML = '';
        lastDir = currentDir;
        console.log(lastDir);
        display.innerHTML = '';
        var h4 = document.createElement('h4');
        h4.textContent = child.name + ':';
        var pre = document.createElement('pre');
        pre.textContent = child.content;
        view.appendChild(h4);
        view.appendChild(pre);
      });
    }
    name.append(child.name);
    tr.appendChild(num);
    tr.appendChild(name);
    tr.appendChild(type);
    tr.appendChild(date);

    // Verifica si el directorio actual no es el directorio raíz
    // if (currentDir.name !== 'root') {
    //   goBack.textContent = '..';

    //   // Agrega el botón "Atrás" al principio de la lista
    //   tr.appendChild(goBack);

    //   // Agrega un evento al botón "Atrás" para retroceder al directorio anterior
    //   goBack.addEventListener('click', () => {
    //     console.log(lastDir.name); // Imprime el nombre del directorio anterior en la consola
    //     display.innerHTML = ''; // Limpia el área de visualización
    //     renderDirectories(lastDir); // Renderiza el contenido del directorio anterior
    //   });
    // }
    display.appendChild(tr); // Agrega la lista al área de visualización
  });
}

// Función para crear un nuevo archivo
function createFile() {
  const currentDir = fileManager.findNodeByName(
    root,
    document.getElementById('dir').innerHTML
  );
  const name = document.getElementById('input').value;
  if (name === '') return; // Si no se proporciona un nombre, sale de la función
  fileManager.addFileOrDirectory(currentDir, name, false); // Agrega un nuevo archivo al directorio actual
  document.getElementById('input').value = '';
  document.getElementById('files').innerHTML = '';
  renderDirectories(currentDir); // Renderiza el contenido del directorio actual
}

// Función para crear un nuevo directorio
function createDir() {
  const currentDir = fileManager.findNodeByName(
    root,
    document.getElementById('dir').innerHTML
  );
  const name = document.getElementById('input').value;
  if (name === '') return; // Si no se proporciona un nombre, sale de la función
  fileManager.addFileOrDirectory(currentDir, name, true); // Agrega un nuevo directorio al directorio actual
  document.getElementById('input').value = '';
  document.getElementById('files').innerHTML = '';
  renderDirectories(currentDir); // Renderiza el contenido del directorio actual
}

// Función para eliminar un archivo o directorio
function removeFileOrDir() {
  const currentDir = fileManager.findNodeByName(
    root,
    document.getElementById('dir').innerHTML
  );
  const name = document.getElementById('input').value;
  fileManager.deleteFileOrDirectory(currentDir, name); // Elimina el archivo o directorio del directorio actual
  document.getElementById('input').value = '';
  document.getElementById('files').innerHTML = '';
  renderDirectories(currentDir); // Renderiza el contenido del directorio actual
}

function goToDirectory() {
  const directory = event.target.innerHTML;
  const pointedDir = fileManager.findNodeByName(root, directory);

  const limit = parseInt(document.getElementById('directories').lastElementChild.id);
  for (let i = 1; i <= limit; i++) {
    if (parseInt(document.getElementById('directories').children[i].id) > parseInt(event.target.parentElement.id)) {
      document.getElementById('directories').children[i].remove();
    }
  }
  document.getElementById('files').innerHTML = '';
  renderDirectories(pointedDir);
}
