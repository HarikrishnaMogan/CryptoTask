
import {useEffect,useState} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";

function App()
{   
    const [eth,seteth] = useState({});
    const [wallet,setWallet] = useState(20000);
    const [buy,setbuy] = useState("");
    const [sell,setsell] = useState("");
    const [value,setValue] = useState("");

    //to get data 
   let getData = async()=>{
       try{
        const {data} = await axios.get("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false");
        seteth(data[0]);
       }
       catch(err)
       {
           console.log(err);
       }
        
       
    }

   
      
     useEffect(()=>{
      
        setInterval(()=>{getData()},1200);
  
        let data = localStorage.getItem("data") && JSON.parse(localStorage.getItem("data"));
        if(data)
        {
            setbuy(data.buy);
            setWallet(data.wallet);
            setsell(data.sell);
        }
         
    
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[])
     

     //to buy and sell when value matches
     useEffect(()=>{
         
         if(eth.current_price=== +buy && buy<=wallet)
         {
                    
             setWallet(wallet-buy);
             setbuy("");
         }
         if(eth.current_price=== +sell)
         {
             setWallet(wallet+ +sell);
             setsell("");
         }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     },[eth,buy,sell,wallet])
     

     //to persist data
     useEffect(()=>{
        localStorage.setItem("data",JSON.stringify({buy,sell,wallet}));
     },[buy,sell,wallet]);
    

    return (
         <div className="container ">
            <h1 className=" text-center">wallet : {wallet.toFixed(2)} usd</h1>

            <div className="d-flex justify-content-center align-items-center">

             <div className="card">
              <div className="card-body">
                  <img src={eth.image} className="img-top" alt="ethereum"/>
             <h1>{eth.id}</h1>
            <p className="text-danger">Price: {eth.current_price} usd</p>
            </div>
             </div>
            
                
             </div >
             <div className="form-group">
            <label>Enter the amount to buy or sell: </label>
              <input className="form-control" type="number" placeholder="4000" value={value} onChange={(e)=>{setValue(e.target.value)}} />
              </div>
            <button className="btn btn-primary mt-3 mx-3" disabled={buy>wallet} onClick={()=>{setbuy(value)}}>Buy</button>
            <button className="btn btn-danger mt-3" onClick={()=>{setsell(value)}}>Sell</button>
             {buy !=="" && <p>Buy at {buy}</p>}
             {sell !=="" &&<p>sell at {sell}</p>}
         </div>
    );
}

export default App;