
interface CategoryInfo {
    "id": number,
    "name": string,
    "parent_id": number,
    "level": number,
    "slug": string,
    'children'?: CategoryInfo[]
}
interface CategoryParam {
    name:string,
    parentId:number,
    level:number
}
