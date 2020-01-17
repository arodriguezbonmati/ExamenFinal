import "babel-polyfill"
import { ObjectID } from "mongodb";
const Query = {
    getPosts: async (parent, args, ctx, info) => {
        const { email, token } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection2 = db.collection("usuarios");
        const collection = db.collection("posts");

        if(!await collection2.findOne({email, token})){
            throw new Error(`User must be logged in.`)
        }

        return await collection.find({}).toArray();
    },

    getAuthorsPosts: async (parent, args, ctx, info) => {
        const { email, token, emailAuthor } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection2 = db.collection("usuarios");
        const collection = db.collection("posts");

        if(!await collection2.findOne({email, token})){
            throw new Error(`User must be logged in.`)
        }

        return await collection.find({author: emailAuthor}).toArray();
    },

    getOnePost: async (parent, args, ctx, info) => {
        const { email, token, _id } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection2 = db.collection("usuarios");
        const collection = db.collection("posts");

        if(!await collection2.findOne({email, token})){
            throw new Error(`User must be logged in.`)
        }

        return await collection.findOne({_id: ObjectID(_id)});
    }
}

export {Query as default}