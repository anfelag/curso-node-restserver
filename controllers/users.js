const { response } = require('express');

const usersGet = (req, res = response) => {

    const { q, name = 'No name', apikey } = req.query;

    res.json({
        msg: 'get API - controlador',
        q,
        name,
        apikey
    });
}

const usersPost = (req, res = response) => {

    const { name, age } = req.body;

    res.json({
        msg: 'post API - controlador',
        name,
        age
    });
}

const usersPut = (req, res = response) => {

    const { id } = req.params;
    res.json({
        msg: 'put API - controlador',
        id,
    });
}

const usersPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usersDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
}


module.exports = {
    usersGet,
    usersPost,
    usersPut,
    usersPatch,
    usersDelete
}