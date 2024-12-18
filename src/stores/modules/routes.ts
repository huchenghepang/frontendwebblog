import { extractNestedField } from '@/utils/extract';
import { type RouteLocationNormalizedGeneric, type RouteRecordRaw } from 'vue-router';
import { defineStore } from "pinia";


export const useRoutesStore = defineStore("routesStore", {
    state() {
        const cacheRoutes: Set<RouteRecordRaw> = new Set();
        const cacheTags:Set<RouteLocationNormalizedGeneric> = new Set()
        return {
            cacheRoutes,
            cacheTags
        }
    },
    actions: {
        addRoute(route: RouteRecordRaw) {
            this.cacheRoutes.add(route)
        },
        removeRoute(route: RouteRecordRaw) {
            this.cacheRoutes.forEach((cachedRoute) => {
                if (cachedRoute.name === route.name) {
                    this.cacheRoutes.delete(cachedRoute);
                }
            });
        },
        addTag(tag:RouteLocationNormalizedGeneric){
            const cancheNames =  extractNestedField(Array.from(this.cacheTags),"name");
            const cancheRoutesNames = extractNestedField(Array.from(this.cacheRoutes),"name");
            if(!cancheNames.includes(tag.name) && cancheRoutesNames.includes(tag.name)){
                this.cacheTags.add(tag)
            }
        },
        deleteTag(tagName:string){
            this.cacheTags.forEach(cacheTag=>{
                if(cacheTag.name === tagName){
                    this.cacheTags.delete(cacheTag)
                    return 
                }
            })
        },
        clearTags(){
            this.cacheTags.clear()
        }
    }
})