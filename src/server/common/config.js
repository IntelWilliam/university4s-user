import mongoosePaginate from 'mongoose-paginate'

// configuración global para la paginación
mongoosePaginate.paginate.options = {
    lean:  true,
    leanWithId:  true,
    limit: 20
};
