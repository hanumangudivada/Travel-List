import { useState } from "react";

export default function App(){
  const[items,setItems]=useState([]);
  function handleItems(item){
    setItems((items)=>[...items,item]) //using spread operator to add current array to previous array.
  }
  function handleDelete(id){
    setItems(items=>items.filter(item=>item.id !==id))
  }
  function handleToogleItem(id){
    setItems((items)=>items.map((item)=>item.id===id? {...item,packed:!item.packed}:item)); //updating the object

  }
  function handleClearList(){
    const confirmed=window.confirm("Are you sure you want to delete all items");
     if (confirmed) setItems((items)=>[])
  }
return(<div className="app">
  <Logo/>
  <Form onAddItems={handleItems}/>
  <PackingList items={items} onDeleteitem={handleDelete} OnToggleItem={handleToogleItem} clearList={handleClearList} />
  <Stats items={items} />
</div>)
}
function Logo(){
  return(<h1>🐥Far away🐇</h1>)

}
function Form({onAddItems}){
  const[description,setdescripition]=useState("");
  const[quantity,setquantity]=useState(1);
  
  function handlesub(e){
    e.preventDefault();
    console.log(e);
    if(!description){
      return
    }
    const newItem={description,quantity,packed:false ,id:Date.now()}
    console.log(newItem);
    onAddItems(newItem);
    // sets the values to default
    setdescripition("");
    setquantity(1);


  }
  //Array.from() method is used to create an array of required length
  return(
    <form className="add-form" onSubmit={handlesub}>
      <h3>What do you need for your trip?😍</h3>
      <select value={quantity} onChange={(e)=>setquantity(Number(e.target.value))}>
        {
        Array.from({length:20},(_,i)=>i+1).map(num=><option value={num} key={num}>{num}</option>)}
      </select>
      <input type="text" placeholder="Item..." value={description} 
        onChange={(e)=>setdescripition(e.target.value)}></input>
      <button>Add</button>
    </form>
   
  )
}
function PackingList({items,onDeleteitem,OnToggleItem,clearList}){
  //sorting items based on selected criteria ...
  const [sortBy,setsortBy]=useState("packed");
  let sorteditems;
  if(sortBy==='input') sorteditems=items;
  if(sortBy==='description') sorteditems=items.slice().sort((a,b)=>a.description.localeCompare(b.description));
  if(sortBy==="packed") sorteditems=items.slice().sort((a,b)=>Number(a.packed)-Number(b.packed));

  return(<div className="list">
  <ul>
    {sorteditems.map((item)=><Item item={item} onDeleteitem={onDeleteitem} OnToggleItems={OnToggleItem} key={item.id}/>)}
</ul>
<div>
  <select value={sortBy} onChange={(e)=>setsortBy(e.target.value)}>
    <option value='input'>Sort by input order</option>
    <option value="description">Sort by description</option>
    <option value="packed">Sort by packed status</option>
  </select>
  <button onClick={()=>clearList()}>Clear list</button>
</div>
</div>)
  
}

//emojis for window --> window+.
function Stats({items}){
  const numitems=items.length;
  const numpacked=items.filter((item)=>item.packed).length;
  const percentage=Math.round(numpacked/numitems)*100;
  if(items.length===0){
    return(
      <p className="stats">
        <em>Start adding some items to your packing list🚀</em> 
      </p>
    )
  }
  return <footer className="stats">
    <em>
      {
        percentage===100? "You got everything to go ✈":
       `🧸You have ${numitems} items on your list,and you already packed ${numpacked} (${percentage})`
      }
      </em>
  </footer>
}
function Item({item,onDeleteitem,OnToggleItems}){
  return(
    <li>
      <input type="checkbox" value={item.packed} onChange={()=>OnToggleItems(item.id)}/>
      <span style={item.packed? {textDecoration:'line-through'}:{}}>{item.quantity} {item.description}</span>
      <button onClick={()=>onDeleteitem(item.id)}>❌</button>
      </li>
  )

}
/*important points
--->Data can flow from parent component to child component, it cannot be shared with the siblilig(same order) components
--->the best practise is to add state which is required for two or more components in the <App/> component
----> we can share the data to other components (childs) using "props" functionality.
---->Data can flow down to children components (via props),not sideways to siblings
---> State was lifted to the closest common parent 
--->Using props we can send the function also as a whole so that it will be used to update state in parent component from children component
--->It is important to update the state when we create a state variable.
---->child to parent--->function() in parent and use it as props.

---->parent to child
*/
