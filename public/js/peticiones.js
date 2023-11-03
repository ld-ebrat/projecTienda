async function getUser(token) {

    try {
        const response = await fetch("/read-infoUser", {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                "authorization": token
            }
        })

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            console.log(response.status)
        }
    } catch (err) {
        console.log('Error al hacer el fetch en getUser -> ', err)
    }
}
async function getAllUser(user){
    try{
        const response = await fetch("/read-user",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({user})
        })

        if(response.ok){
            const data = await response.json()
            return data
        }else{
            response.status
        }
    }catch(err){
        console.log(err)
    }
}
async function getPro() {
    try {
        const response = await fetch('/read-pro')
        if (response.ok) {
            const data = await response.json()
            return data
        } else {
            console.log(response.status)
        }
    } catch (err) {
        console.log("Error -> ", err)
    }
}
async function getCategoria(){
    try{
        const response = await fetch("/read-cate")

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log(err)
    }
}
async function getCar(){
    try{
        const response = await fetch("/read-car")

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){

    }
}
async function getPedido(){
    try{
        const response = await fetch("/read-pedido")

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log(err)
    }
}
async function getPostCar(idUser=undefined,allCarUser=undefined,idPedido=undefined) {
    if(idUser){
        try {
            const response = await fetch("/read-car", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idUser })
            })
            if (response.ok) {
                const data = await response.json()
                return data
            }
        } catch (err) {
            console.log("Error en el fetch de getCar -> ", err)
        }
    }else if(allCarUser){
        try {
            const response = await fetch("/read-car", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ allCarUser })
            })
            if (response.ok) {
                const data = await response.json()
                return data
            }
        } catch (err) {
            console.log("Error en el fetch de getCar -> ", err)
        }
    }else if(idPedido){
        try {
            const response = await fetch("/read-car", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idPedido })
            })
            if (response.ok) {
                const data = await response.json()
                return data
            }
        } catch (err) {
            console.log("Error en el fetch de getCar -> ", err)
        }
    }
}
async function getPostCarPro(idCar) {
    try {
        const response = await fetch('/read-carPro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idCar })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log("Error an el fetch de gePostCarPro -> ", err)
    }
}
async function getPostPro(idPro) {
    try {
        const response = await fetch('/read-pro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPro })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log('Error al realizar el fetch en getPro header -> ', err)
    }
}
async function getPostPedido(idPedido, state = undefined ) {

    if(!state){
        try {
            const response = await fetch("/read-pedido", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idPedido })
            })
    
            if (response.ok) {
                const data = await response.json()
                return data
            }
        } catch (err) {
    
        }
    }else{
        try {
            const response = await fetch("/read-pedido", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ idPedido,state })
            })
    
            if (response.ok) {
                const data = await response.json()
                return data
            }
        } catch (err) {
    
        }
    }
}
async function postPedido(total = 0) {
    const date = new Date().toLocaleString()
    const metodoPago = ''
    const state = 'En Espera'
    try {
        const response = await fetch('/create-pedido', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date, metodoPago, state, total })
        })
        if (response.ok) {
            const data = response.json()
            return data
        } else {
            console.log(response.status)
        }
    } catch (err) {
        console.log(err)
    }
}
async function postCar(idUser, idPedido) {
    const state = 'Activo'
    try {
        const response = await fetch('/create-car', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idPedido, idUser, state })
        })

        if (response.ok) {
            const data = response.json()
            return data
        } else {
            console.log(response.status)
        }
    } catch (err) {
        console.log('Erro en el fetch de car -> ', err)
    }
}
async function postCarPro(idCar, idPro, amountPro = 1) {
    const amount = amountPro
    try {
        const response = await fetch('/create-carpro', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idCar, idPro, amount })
        })

        if (response.ok) {
            const data = response.json()
            return data
        }
    } catch (err) {
        console.log('Error en el fetch de carPro -> ', err)
    }
}
async function putCar(idCar,state="En Espera") {
    try {
        const response = await fetch("/update-car", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idCar, state })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log("Error al ahcer el fetch en putCar carrito -> ", err)
    }
}
async function putCarPro(idCarPro, amoutUpdate) {
    try {
        const response = await fetch('/update-carPro', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ idCarPro, amoutUpdate })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        } else {
        }
    } catch (err) {
        console.log('Error al hacer el fetch putCarPro -> ', err)
    }
}
async function putPedido(idPedido, total = 0 ,metodo="",state ="En Espera") {
    const date = new Date().toLocaleString()
    try {
        const response = await fetch("/update-pedido", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ idPedido, date, metodo, state, total })
        })

        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (err) {
        console.log("Error al hacer el fetch putPedido en carrito -> ", err)
    }
}
async function deleteUser(idUser){
    try{
        const response = await fetch("/delete-user",{
            method: "DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({idUser})
        })

        if(response.ok){
            const data = await response.json()
            return data
        }
    }catch(err){
        console.log(err)
    }
}

export {
    getUser,
    getAllUser,
    getPro,
    getCategoria,
    getCar,
    getPedido,
    getPostCar,
    getPostCarPro,
    getPostPro,
    getPostPedido,
    postPedido,
    postCar,
    postCarPro,
    putCar,
    putCarPro,
    putPedido,
    deleteUser
}
