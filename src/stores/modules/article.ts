import { defineStore } from 'pinia'
import { reqGetStatistics } from '@/api/articles'
import type { CountItem } from '@/types/customResponse';


interface NoteInfo {
    "name": string,
    "fileID": string,
    "reading": number
}

export const useArticleStore = defineStore('article', {
    state: function () {
        return {
            categoryCounts: [] as CountItem[],
            tagCounts: [] as CountItem[],
            notesCounts:[] as NoteInfo[]
        }
    },
    actions: {
        async getAricleTagAndCategoryInfo() {
            try {
                const { code, data: { categoryCounts, tagCounts,noteCounts } } = await reqGetStatistics();
                if (code === 200) {
                    this.categoryCounts = categoryCounts.filter((item, index) => {
                        return item.note_count > 0
                    });
                    this.tagCounts = tagCounts.filter((item, index) => {
                        return item.note_count > 0
                    });
                    this.notesCounts = noteCounts
                    return {
                        code,
                        categoryCounts,
                        tagCounts,
                        noteCounts
                    }
                }
            } catch (error) {
                console.error(error)
            }
        }
    },
    getters:{
        categoriesNumber:(state)=>{
            return state.categoryCounts.length
        },
        tagsNumber:(state)=>{
            return state.tagCounts.length
        },
        articlesNumber:(state)=>{
            return state.categoryCounts.reduce((pre,item:{note_count:number},index,arrs)=>{
                pre += item.note_count
                return pre
            },0)
        }
    }

}) 