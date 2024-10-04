# Script BD

La base de datos utilizada es Firestore de Firebase. La estructura de la colección es la siguiente:

- **Collection**: "users"
  - **Documentos**: Cada documento representa un usuario con los siguientes campos:
    - `firstName`: (String) El primer nombre del usuario.
    - `lastName`: (String) El apellido del usuario.
    - `age`: (Number) La edad del usuario.
    - `gender`: (String) El género del usuario.
    - `email`: (String) El correo electrónico del usuario.
    - `country`: (String) El país de residencia del usuario.
    - `city`: (String) La ciudad de residencia del usuario.
    - `picture`: (String) URL de la imagen de perfil del usuario.

No es necesario ejecutar un script SQL. La estructura de la base de datos se crea dinámicamente a medida que los usuarios son agregados mediante la aplicación.
