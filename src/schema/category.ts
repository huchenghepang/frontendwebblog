import * as Yup from 'yup';
export const addCategoriesSchema = Yup.object({
    name:Yup.string().required('姓名是必须的'),
    parentId:Yup.number().required('父类是必须的'), // 必须是正数
    level:Yup.number().required('级别是必须的') 
})