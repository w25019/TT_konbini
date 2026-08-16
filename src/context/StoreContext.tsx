"use client";
import React,{createContext,useContext,useEffect,useMemo,useState}from"react";
import {Product,products}from"../data/products";
type Item={product:Product;quantity:number};
type Store={items:Item[];favorites:string[];add:(p:Product)=>void;remove:(id:string)=>void;change:(id:string,n:number)=>void;clear:()=>void;toggleFavorite:(id:string)=>void;subtotal:number;count:number};
const C=createContext<Store|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){const [items,setItems]=useState<Item[]>([]);const[favorites,setFavorites]=useState<string[]>([]);const[ready,setReady]=useState(false);
useEffect(()=>{try{setItems(JSON.parse(localStorage.getItem("tt-cart")||"[]"));setFavorites(JSON.parse(localStorage.getItem("tt-favs")||"[]"))}catch{}setReady(true)},[]);
useEffect(()=>{if(ready){localStorage.setItem("tt-cart",JSON.stringify(items));localStorage.setItem("tt-favs",JSON.stringify(favorites))}},[items,favorites,ready]);
const value=useMemo(()=>({items,favorites,add:(p:Product)=>setItems(x=>{const q=x.find(i=>i.product.id===p.id);return q?x.map(i=>i.product.id===p.id?{...i,quantity:i.quantity+1}:i):[...x,{product:p,quantity:1}]}),remove:(id:string)=>setItems(x=>x.filter(i=>i.product.id!==id)),change:(id:string,n:number)=>setItems(x=>n<1?x.filter(i=>i.product.id!==id):x.map(i=>i.product.id===id?{...i,quantity:n}:i)),clear:()=>setItems([]),toggleFavorite:(id:string)=>setFavorites(x=>x.includes(id)?x.filter(v=>v!==id):[...x,id]),subtotal:items.reduce((s,i)=>s+i.product.price*i.quantity,0),count:items.reduce((s,i)=>s+i.quantity,0)}),[items,favorites]);return <C.Provider value={value}>{children}</C.Provider>}
export const useStore=()=>useContext(C)!;export const favProducts=(ids:string[])=>products.filter(p=>ids.includes(p.id));
