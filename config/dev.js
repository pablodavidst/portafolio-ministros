module.exports ={
    jwt: {
        secreto:'Este es un secreto de desarrollo',
        tiempoDeExpiracion:'24h'
    },
    dbconfig:{
        user: 'xxx',
        password: 'xxx',
        server: 'xxx', 
        //server: '190.244.222.7',
        database: 'xxx',
        options: {
            encrypt: false,
        },
//        MultipleActiveResultSets:true 
    }
}