










let data = JSON.parse(localStorage.getItem("cart")) || [];
let userId = JSON.parse(localStorage.getItem("userId"))
console.log(userId);
async function getdata(){
    let res = await fetch(`http://127.0.0.1:9090/cart?userId=${userId}`)
    let newData = await res.json()
   
    console.log(newData);
    append(newData[0].products); 
}

getdata()

const append = (data) => {
    const container = document.querySelector(".div4");
    container.innerHTML = null;

    data.forEach((el) => {
     
        const div = document.createElement("div");

        const img = document.createElement("img");
        const div1=document.createElement("div");
        const h3 = document.createElement("h3");
        const priceP = document.createElement("p");
     
        const qty = document.createElement("button");
        const remove = document.createElement("button");
        const movetowishlist=document.createElement("button")
   


        img.src = el.image;
        
        h3.innerText = el.productName;
        priceP.innerText = `Price-${el.price}`;
   
        qty.innerText = `Qty - ${el.qty}`
        remove.innerText = "Remove";
        movetowishlist.innerText="Move to Wishlist"
    


        remove.addEventListener("click", () => {
            data = data.filter((ele) => {
                return ele.id !== el.id;
            })
            localStorage.setItem("cart", JSON.stringify(data))
            append(data)
            totalPrice(data);
        })

        // // Addind eventlistener on increase button
        // increment.addEventListener("click", () => {
        //     el = el.qty++;
        //     localStorage.setItem("cart", JSON.stringify(data))
        //     append(data);
        //     totalPrice(data);
        // })

        // // Addind eventlistener on deccrease button
        // decrement.addEventListener("click", () => {
        //     if (el.qty > 1) {
        //         el = el.qty--;
        //         localStorage.setItem("cart", JSON.stringify(data))
        //         append(data);
        //         totalPrice(data);
        //     }
        // })

        movetowishlist.addEventListener("click", () => {
      
          });

       div1.append(h3,qty,remove,movetowishlist)

   
        div.append(img,div1, priceP,remove)
        container.append(div);
    })
}































// let data = JSON.parse(localStorage.getItem("cart")) || [];

// // const totalPrice = (data) => {
// //     let total = 0;
// //     data.map((el) => {
// //         total += el.price * el.qty;
// //     })
// //     const span = document.querySelector("#totalPriceSpan")
// //     span.innerText = total;
// // }
// // totalPrice(data);
// let userId = JSON.parse(localStorage.getItem("userId"))
// async function getdata(){
//     let res = await fetch(`http://127.0.0.1:9090/cart?id=${userId}`)
//     data = await res.json()
//     console.log(data);
// }
// getdata()
// const append = (data) => {
//     const container = document.querySelector(".div4");
//     container.innerHTML = null;

//     data.forEach((el) => {
//         //1.create all htmls
//         const div = document.createElement("div");

//         const img = document.createElement("img");
//         const div1=document.createElement("div");
//         const h3 = document.createElement("h3");
//         const priceP = document.createElement("p");
     
//         const qty = document.createElement("button");
//         const remove = document.createElement("button");
//         const movetowishlist=document.createElement("button")
   

//         //2.giving style and attribute to the tag
//         img.src = el.image;
        
//         h3.innerText = el.productName;
//         priceP.innerText = `Price-${el.price}`;
//        // brandP.innerText = `Brand Name-${el.brand}`
//         qty.innerText = `Qty - ${el.qty}`
//         remove.innerText = "Remove";
//         movetowishlist.innerText="Move to Wishlist"
    

//         // Adding eventlistener on remove button
//         remove.addEventListener("click", () => {
//             data = data.filter((ele) => {
//                 return ele.id !== el.id;
//             })
//             localStorage.setItem("cart", JSON.stringify(data))
//             append(data)
//             totalPrice(data);
//         })

//         // // Addind eventlistener on increase button
//         // increment.addEventListener("click", () => {
//         //     el = el.qty++;
//         //     localStorage.setItem("cart", JSON.stringify(data))
//         //     append(data);
//         //     totalPrice(data);
//         // })

//         // // Addind eventlistener on deccrease button
//         // decrement.addEventListener("click", () => {
//         //     if (el.qty > 1) {
//         //         el = el.qty--;
//         //         localStorage.setItem("cart", JSON.stringify(data))
//         //         append(data);
//         //         totalPrice(data);
//         //     }
//         // })

//         movetowishlist.addEventListener("click", () => {
//             // Code to move item to wishlist
//           });

//        div1.append(h3,qty,remove,movetowishlist)

//         //4.Append
//         div.append(img,div1, priceP,remove)
//         container.append(div);
//     })
// }

// //append(data);