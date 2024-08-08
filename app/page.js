'use client'
import React, { useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from './firebase';

export default function Home() {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', quantity: '' });
  const [total, setTotal] = useState(0);
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Edamam API credentials
  const APP_ID = 'fbb94be9';
  const APP_KEY = 'dfdb7ba8ee363abae757bec39fdeb6f7';

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name !== '' && newItem.quantity !== '') {
      await addDoc(collection(db, 'items'), {
        name: newItem.name.trim(),
        quantity: newItem.quantity,
      });
      setNewItem({ name: '', quantity: '' });
    }
  };

  // Read items from database
  useEffect(() => {
    const q = query(collection(db, 'items'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let itemsArr = [];

      querySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });
      setItems(itemsArr);

      // Read total from itemsArr
      const calculateTotal = () => {
        const totalQuantity = itemsArr.reduce(
          (sum, item) => sum + parseFloat(item.quantity),
          0
        );
        setTotal(totalQuantity);
      };
      calculateTotal();
    });
    return () => unsubscribe();
  }, []);

  // Delete items from database
  const deleteItem = async (id) => {
    await deleteDoc(doc(db, 'items', id));
  };

  // Generate recipes based on pantry items
  const generateRecipes = async () => {
    setIsLoading(true);
    setRecipes([]); // Clear previous recipes
    
    const ingredients = items.map(item => item.name).join(',');
    const url = `https://api.edamam.com/search?q=${ingredients}&app_id=${APP_ID}&app_key=${APP_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.hits);
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Failed to fetch recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-between sm:p-24 p-4'>
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm ">
        <h1 className='text-4xl p-4 text-center'>Pantry Tracker</h1>
        <div className='bg-slate-800 p-4 rounded-lg'> 
          <form className='grid grid-cols-6 items-center text-black'>
            <input 
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className='col-span-3 p-3 border' 
              type="text" 
              placeholder='Enter Item'
            />
            <input 
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              className='col-span-2 p-3 border mx-3'
              type="number" 
              placeholder='Qty'
            />
            <button 
              onClick={addItem}
              className='text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl'
              type="submit"
            >
              +
            </button>           
          </form>
          <ul>
            {items.map((item, id) => (
              <li 
                key={id} 
                className='my-4 w-full flex justify-between bg-slate-950'
              >
                <div className='p-4 w-full flex justify-between'>
                  <span className="text-white">{item.name}</span>
                  <span className="text-white">{item.quantity}</span>
                </div>
                <button onClick={() => deleteItem(item.id)} className='ml-8 p-4 border-l-2 border-slate-900 hover:bg-slate-900 w-16 text-white'>
                  X
                </button>
              </li>
            ))}
          </ul>
          {items.length < 1 ? ('') : (
            <div className='flex justify-between p-3'>
              <span className="text-white">Total</span>
              <span className="text-white">{total}</span>
            </div>
          )}
          <button 
            onClick={generateRecipes}
            disabled={isLoading || items.length === 0}
            className={`mt-4 w-full text-white p-3 rounded ${
              isLoading || items.length === 0
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Generating...' : 'Generate Recipes'}
          </button>
        </div>
        {recipes.length > 0 && (
          <div className='mt-8'>
            <h2 className='text-2xl mb-4'>Generated Recipes</h2>
            <ul>
              {recipes.map((recipe, index) => (
                <li key={index} className='mb-4 p-4 bg-slate-800 rounded'>
                  <h3 className='text-xl text-white'>{recipe.recipe.label}</h3>
                  <p className='text-gray-300'>Ingredients: {recipe.recipe.ingredientLines.join(', ')}</p>
                  <a href={recipe.recipe.url} target="_blank" rel="noopener noreferrer" className='text-blue-400 hover:text-blue-300'>
                    View Recipe
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {recipes.length === 0 && !isLoading && (
          <p className='mt-4 text-center text-gray-400'>No recipes generated yet. Add items to your pantry and click "Generate Recipes".</p>
        )}
      </div>
    </main>
  );
}