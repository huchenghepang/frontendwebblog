import { defineStore}from "pinia"

export const useSocketStore = defineStore("socket",{
    state:():{socket:null |Socket}=>{
        
        return {
            socket:null,
        }
    },
    actions:{
        
    },
    getters:{
        
    }
})