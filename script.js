// Clase que representa un archivo
class File {
  constructor(name, content = '') {
    this.name = name;
    this.content = content;
    this.isDir = false; // Indica si es un directorio o no
  }
}

// Clase que representa un directorio
class Directory {
  constructor(name) {
    this.name = name;
    this.isDir = true; // Siempre es un directorio
    this.children = []; // Almacena archivos y subdirectorios
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

    if (node.isDir) {
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
        (node.isDir ? '/' : ':') +
        '\n' +
        '  '.repeat(depth) +
        (node.isDir ? '' : node.content)
    );
    if (node.isDir) {
      for (const child of node.children) {
        this.displayDirectoryStructure(child, depth + 1);
      }
    }
  }
}

// Crea una instancia de la clase FileManager
const fileManager = new FileManager();

// Crea la estructura de directorios y archivos
const root = fileManager.root;
const documents = fileManager.addFileOrDirectory(root, 'documents');
const pictures = fileManager.addFileOrDirectory(root, 'pictures');
const vacation = fileManager.addFileOrDirectory(pictures, 'vacation');
const work = fileManager.addFileOrDirectory(documents, 'work');
const report = fileManager.addFileOrDirectory(
  work,
  'report',
  false,
  'Content of the report.\nlorem ipsum dolor sit amet.'
);

// Función para renderizar la estructura de directorios en una interfaz de usuario
function renderDirectories(node = root) {
  const currentDir = fileManager.findNodeByName(
    node,
    document.getElementById('dir').innerHTML
  );
  const ul = document.createElement('ul');
  const display = document.getElementById('files');
  const goBack = document.createElement('li');
  var lastDir;

  fileManager.getChildren(currentDir).forEach((child) => {
    const li = document.createElement('li');

    // Verifica si el directorio actual no es el directorio raíz
    if (currentDir.name !== 'root') {
      goBack.textContent = '..';

      // Agrega el botón "Atrás" al principio de la lista
      ul.appendChild(goBack);

      // Agrega un evento al botón "Atrás" para retroceder al directorio anterior
      goBack.addEventListener('click', () => {
        console.log(lastDir.name); // Imprime el nombre del directorio anterior en la consola
        display.innerHTML = ''; // Limpia el área de visualización
        renderDirectories(lastDir); // Renderiza el contenido del directorio anterior
      });
    }

    if (child.isDir) {
      li.textContent = child.name + '/'; // Agrega una barra "/" al final del nombre del directorio
      li.addEventListener('click', function () {
        lastDir = currentDir; // Almacena el directorio actual antes de cambiar
        console.log(lastDir); // Imprime el directorio actual en la consola
        display.innerHTML = ''; // Limpia el área de visualización
        document.getElementById('dir').innerHTML = child.name; // Actualiza el nombre del directorio en la interfaz
        renderDirectories(child); // Renderiza el contenido del nuevo directorio
      });
    } else {
      li.textContent = child.name; // Agrega el nombre del archivo
      li.addEventListener('click', function () {
        lastDir = currentDir; // Almacena el directorio actual antes de cambiar
        console.log(lastDir); // Imprime el directorio actual en la consola
        display.innerHTML = ''; // Limpia el área de visualización
        document.getElementById('dir').innerHTML = child.name; // Actualiza el nombre del archivo en la interfaz
        var pre = document.createElement('pre');
        pre.textContent = child.content;
        display.appendChild(pre); // Muestra el contenido del archivo en un área de visualización
      });
    }

    ul.appendChild(li); // Agrega el elemento de lista al elemento de lista principal
  });

  display.appendChild(ul); // Agrega la lista al área de visualización
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
