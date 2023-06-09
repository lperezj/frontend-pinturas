export default class Color {
    Nombre = "";
    InfoColor = "";
    Precio = "";
    Favorite = "";
    Available = "";
    Referencia = "";
    Imagen = "";
     
    constructor(_name, _info, _precio, _fav, _available, _reference, _imagen) 
    {
        this.Nombre = _name;
        this.InfoColor = _info;
        this.Precio = _precio;
        this.Favorite = _fav;
        this.Available = _available;
        this.Referencia = _reference;
        this.Imagen = _imagen;
    }
    
    getName()
    {
      return this.Nombre;
    }    

    getInfo()
    {
      return this.InfoColor;
    }

    getPrecio()
    {
      return this.Precio;
    }

    getFavorite()
    {
      return this.Favorite;
    }

    getAvailable()
    {
      return this.Available;
    }

    getReferencia()
    {
      return this.Referencia;
    }

    getImagen()
    {
      return this.Imagen;
    }
}