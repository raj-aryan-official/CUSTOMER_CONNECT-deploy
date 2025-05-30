import React, { createContext, useState, useContext } from 'react';

const translations = {
  en: {
    common: {
      search: 'Search',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      profile: 'Profile',
      cart: 'Cart',
      orders: 'Orders',
      admin: 'Admin'
    },
    products: {
      addToCart: 'Add to Cart',
      outOfStock: 'Out of Stock',
      price: 'Price',
      quantity: 'Quantity',
      description: 'Description',
      category: 'Category'
    },
    orders: {
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        packed: 'Packed',
        collected: 'Collected'
      },
      total: 'Total',
      date: 'Order Date',
      status: 'Status'
    },
    auth: {
      email: 'Email',
      password: 'Password',
      name: 'Name',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      confirmPassword: 'Confirm Password'
    }
  },
  es: {
    common: {
      search: 'Buscar',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      logout: 'Cerrar Sesión',
      profile: 'Perfil',
      cart: 'Carrito',
      orders: 'Pedidos',
      admin: 'Administrador'
    },
    products: {
      addToCart: 'Añadir al Carrito',
      outOfStock: 'Agotado',
      price: 'Precio',
      quantity: 'Cantidad',
      description: 'Descripción',
      category: 'Categoría'
    },
    orders: {
      status: {
        pending: 'Pendiente',
        confirmed: 'Confirmado',
        packed: 'Empacado',
        collected: 'Recogido'
      },
      total: 'Total',
      date: 'Fecha del Pedido',
      status: 'Estado'
    },
    auth: {
      email: 'Correo Electrónico',
      password: 'Contraseña',
      name: 'Nombre',
      forgotPassword: '¿Olvidaste tu Contraseña?',
      resetPassword: 'Restablecer Contraseña',
      confirmPassword: 'Confirmar Contraseña'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      value = value[k];
      if (!value) return key;
    }
    
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 