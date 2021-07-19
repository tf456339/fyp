import {parseCookies} from 'nookies'
import baseUrl from '../helpers/baseUrl'
import {useEffect,useRef} from 'react'
import UserRoles from '../components/UserRoles'
const Account = ({orders})=>{
    const orderCard = useRef(null)
    const cookie = parseCookies()
    const user = cookie.user ? JSON.parse(cookie.user): ""
  
    useEffect(()=>{
        M.Collapsible.init(orderCard.current)
    },[])
  const OrderHistory = ()=>{
        return(
            <ul className="collapsible" ref={orderCard}>

                {orders.map(item=>{
                    return(
                     <li key={item._id}>
                        <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                        <div className="collapsible-body">
                            <h4>Total  ₹ {item.total}</h4> 
                            {
                                item.products.map(pitem=>{
                                  return <h6 key={pitem._id}>{pitem.product.name} X {pitem.quantity}</h6>  
                                })
                            }
                
                             <button>Order Recived as per Description</button><br></br>
                            <button>Order Recieved with following defects</button>
                            
                            <textarea rows="20" ></textarea>
                        </div>
                    </li>   
                    )
                })}
                    
                
           </ul>
        
        )
  }

  const OrderHistoryAdmin = ()=>{
    return(
        <ul className="collapsible" ref={orderCard}>

            {orders.map(item=>{
                return(
                 <li key={item._id}>
                    <div className="collapsible-header"><i className="material-icons">folder</i>{item.createdAt}</div>
                    <div className="collapsible-body">
                        <h4>Total  ₹ {item.total}</h4> 
                        {
                            item.products.map(pitem=>{
                              return <h6 key={pitem._id}>{pitem.product.name} X {pitem.quantity}</h6>  
                            })
                        }
            
                         
                        <h5>Following is the Feedback of Buyer:</h5>
                        
                        <textarea rows="20" ></textarea>
                    </div>
                </li>   
                )
            })}
                
            
       </ul>
    
    )
}

    return(
        <div className="container">
            <div className="center-align white-text" style={{marginTop:"10px",backgroundColor:"#1565c0",padding:"3px"}} >
                <h4>Welcome {user.name}</h4>
                <h4>You are currently logged in from {user.email}</h4>
            </div>
            <h3>Order History</h3>
            {
            orders.length == 0?
              <div className="container">
                    <h5>Your have no order History</h5>
                </div>
            :<OrderHistory />
            }
            {user.role == "root"
            &&<UserRoles />&&<h1>Status of Orders is as Follows:</h1>&&
            <OrderHistoryAdmin />
            } 
        </div>
    )
}


export async function getServerSideProps(ctx){
  const {token} = parseCookies(ctx)
  if(!token){
      const {res} = ctx
      res.writeHead(302,{Location:"/login"})
      res.end()
  }

  const res = await fetch(`${baseUrl}/api/orders`,{
      headers:{
          "Authorization":token
      }
  })
  const res2 =  await res.json()
  console.log(res2)

  return {
      props:{orders:res2}
  }
}




export default Account