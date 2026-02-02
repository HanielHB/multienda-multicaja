# Actualización Backend - API Clientes

## ⚠️ IMPORTANTE: Cambios Requeridos en el Backend

El frontend ha sido actualizado para usar `nro_documento` en lugar de `email` para el módulo de clientes. **Debes actualizar tu backend API** para que funcione correctamente.

## 📋 Cambios Necesarios en el Backend

### 1. **Base de Datos**

Ejecuta el archivo de migración incluido en este proyecto:

```bash
mysql -u tu_usuario -p tienda_multicaja < migration_clientes_email_to_nro_documento.sql
```

O manualmente ejecuta:

```sql
USE tienda_multicaja;

-- Agregar columna nro_documento
ALTER TABLE clientes 
ADD COLUMN nro_documento VARCHAR(20) NULL AFTER nombre;

-- Eliminar columna email
ALTER TABLE clientes 
DROP COLUMN email;
```

### 2. **Modelo de Clientes (Backend)**

Actualiza tu modelo de `Cliente` para incluir `nro_documento` en lugar de `email`:

**Antes:**
```javascript
{
  id: Number,
  nombre: String,
  email: String,      // ❌ Eliminar
  direccion: String,
  celular: String
}
```

**Después:**
```javascript
{
  id: Number,
  nombre: String,
  nro_documento: String,  // ✅ Agregar
  direccion: String,
  celular: String
}
```

### 3. **Controlador de Clientes**

Actualiza las funciones de crear y actualizar clientes:

**POST /api/clientes** - Crear cliente:
```javascript
// Antes
const { nombre, email, direccion, celular } = req.body;

// Después
const { nombre, nro_documento, direccion, celular } = req.body;
```

**PUT /api/clientes/:id** - Actualizar cliente:
```javascript
// Antes
const { nombre, email, direccion, celular } = req.body;

// Después
const { nombre, nro_documento, direccion, celular } = req.body;
```

### 4. **Validaciones**

Si tenías validación de email, remuévela o cámbiala por validación de número de documento:

**Antes:**
```javascript
if (!email || !isValidEmail(email)) {
  return res.status(400).json({ error: 'Email inválido' });
}
```

**Después:**
```javascript
// La validación de nro_documento es opcional
// Puedes agregar validación según tus necesidades
if (nro_documento && nro_documento.length > 20) {
  return res.status(400).json({ error: 'Número de documento muy largo' });
}
```

### 5. **Consultas SQL**

Actualiza tus queries SQL:

**Antes:**
```sql
INSERT INTO clientes (nombre, email, direccion, celular) 
VALUES (?, ?, ?, ?)

UPDATE clientes 
SET nombre = ?, email = ?, direccion = ?, celular = ? 
WHERE id = ?
```

**Después:**
```sql
INSERT INTO clientes (nombre, nro_documento, direccion, celular) 
VALUES (?, ?, ?, ?)

UPDATE clientes 
SET nombre = ?, nro_documento = ?, direccion = ?, celular = ? 
WHERE id = ?
```

## ✅ Testing

Después de hacer estos cambios:

1. Reinicia tu servidor backend
2. Prueba crear un nuevo cliente con número de documento
3. Verifica que se guarde correctamente en la base de datos
4. Prueba editar un cliente existente
5. Verifica la búsqueda por número de documento

## 📝 Ejemplo Completo (Node.js/Express)

```javascript
// Crear cliente
router.post('/clientes', async (req, res) => {
  try {
    const { nombre, nro_documento, direccion, celular } = req.body;
    
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }
    
    const [result] = await db.query(
      'INSERT INTO clientes (nombre, nro_documento, direccion, celular) VALUES (?, ?, ?, ?)',
      [nombre, nro_documento, direccion, celular]
    );
    
    res.status(201).json({ 
      message: 'Cliente creado exitosamente',
      id: result.insertId 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cliente
router.put('/clientes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, nro_documento, direccion, celular } = req.body;
    
    await db.query(
      'UPDATE clientes SET nombre = ?, nro_documento = ?, direccion = ?, celular = ? WHERE id = ?',
      [nombre, nro_documento, direccion, celular, id]
    );
    
    res.json({ message: 'Cliente actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 🔍 Verificación

Para verificar que todo funciona:

```sql
-- Ver la estructura de la tabla
DESCRIBE clientes;

-- Debería mostrar nro_documento en lugar de email
```

---

**Nota**: Estos cambios son necesarios para que el frontend funcione correctamente. Sin estos cambios en el backend, los clientes no se guardarán con el número de documento.
