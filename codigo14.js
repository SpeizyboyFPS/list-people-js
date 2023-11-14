"use strict"


const IDBRequestt = indexedDB.open("dataBase",1);

IDBRequestt.addEventListener("upgradeneeded",()=>{
    const db = IDBRequestt.result;
    db.createObjectStore("nombres",{
        autoIncrement: true,
    })
    console.log("se creo correctamente");
})

IDBRequestt.addEventListener("success",()=>{
    leerObj();
    console.log("Todo salio bien");
})

IDBRequestt.addEventListener("error",()=>{
    console.log("ocurrió un error");
})

document.getElementById("add").addEventListener("click",()=>{
    let nombre = document.getElementById("nombre").value;
    if(nombre.length > 0) {
        if(document.querySelector(".posible") != undefined){
            if(confirm("Hay elementos sin guardar ¿Quieres continuar?")) {
                addObj({nombre:nombre});
                leerObj();
            }
        } else {
            addObj({nombre:nombre});
            leerObj();
        }
    }
})

const addObj = obj=>{
    const IDBData = getIDBData("readwrite");
    IDBData[0].add(obj);
    IDBData[1].addEventListener("complete",()=>{
        console.log("objeto agradado correctamente");
    })
}

const leerObj = ()=>{
    const IDBData = getIDBData("readonly");
    const cursor = IDBData[0].openCursor();
    const fragment = document.createDocumentFragment();
    document.querySelector(".nombres").innerHTML = "";
    cursor.addEventListener("success",()=>{
        if(cursor.result){
            let elemento = nombresHTML(cursor.result.key, cursor.result.value);
            fragment.appendChild(elemento);
            cursor.result.continue();
        } else document.querySelector(".nombres").appendChild(fragment);
    })
}

const modificarObj = (key,obj)=>{
    const IDBData = getIDBData("readwrite");
    IDBData[0].put(obj,key);
    IDBData[1].addEventListener("complete",()=>{
        console.log("objeto modificado correctamente");
    })
}

const borrarObj = key=>{
    const IDBData = getIDBData("readwrite");
    IDBData[0].delete(key);
    IDBData[1].addEventListener("complete",()=>{
        console.log("objeto eliminado correctamente");
    })
}

const getIDBData = mode=>{
    const db = IDBRequestt.result;
    const IDBtransaction = db.transaction("nombres",mode);
    const objStore = IDBtransaction.objectStore("nombres");
    return [objStore,IDBtransaction];
}

const nombresHTML = (id,name)=>{
    const container = document.createElement("div");
    const h2 = document.createElement("h2");
    const options = document.createElement("div");
    const saveBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    saveBtn.textContent = "Guardar";
    deleteBtn.textContent = "Eliminar";
    h2.textContent = name.nombre;

    container.classList.add("nombre");
    options.classList.add("options");

    saveBtn.classList.add("imposible");
    deleteBtn.classList.add("delete");

    h2.setAttribute("contentEditable",true);
    h2.setAttribute("spellcheck",false);

    options.appendChild(saveBtn);
    options.appendChild(deleteBtn);

    container.appendChild(h2);
    container.appendChild(options);

    h2.addEventListener("keyup",()=>{
        saveBtn.classList.replace("imposible","posible");
    })

    saveBtn.addEventListener("click",()=>{
        if(saveBtn.classList == "posible") {
            modificarObj(id,{nombre: h2.textContent});
            saveBtn.classList.replace("posible","imposible")
        }
    })

    deleteBtn.addEventListener("click",()=>{
        borrarObj(id);
        document.querySelector(".nombres").removeChild(container);
    })

    return container;
}