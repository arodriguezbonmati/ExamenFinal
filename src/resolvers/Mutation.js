import "babel-polyfill"
import { ObjectID } from "mongodb";
import { PubSub } from "graphql-yoga";
import * as uuid from 'uuid'
const Mutation = {
    
    signUp: async (parent, args, ctx, info) => {
        const { email, password, type } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection = db.collection("usuarios");

        if (await collection.findOne({ email })) {
            throw new Error(`Email ${email} is not available.`)
        }

        const result = await collection.insertOne({ email, password, type});

        return {
            _id: result.ops[0]._id,
            email,
            password,
            type
        }
    },

    login: async (parent, args, ctx, info) => {
        const { email, password } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection = db.collection("usuarios");

        const result = await collection.findOne({email, password});

        async function tiempo (){
            await collection.updateOne({email}, { $set: {token: null}});
        }

        
        if(result){
            await collection.updateOne({email}, { $set: {token: uuid.v4()}});
            setTimeout(tiempo, 1800000);
        }

        if(!result){
            throw new Error(`Wrong email or password`)
        }

        const result2 = await collection.findOne({email});

        return result2;
    },

    logout: async (parent, args, ctx, info) => {
        const { email, token } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection = db.collection("usuarios");

        const result = await collection.findOne({email, token});

        if(result){
            await collection.updateOne({email}, { $set: {token: null}});
        }

        if(!result){
            throw new Error(`Error`)
        }

        const result2 = await collection.findOne({email});

        return result2;
    },

    addPost: async (parent, args, ctx, info) => {
        const { email, token, title, description } = args;
        const { client, pubsub } = ctx;

        const db = client.db("EXAMEN");
        const collection2 = db.collection("usuarios");
        const collection = db.collection("posts");

        const autor = 1;

        if(!await collection2.findOne({email, token})){
            throw new Error(`Author must be logged in.`)
        }
        
        if(!await collection2.findOne({email, type: autor})){
            throw new Error(`Only AUTHORS can write posts.`)
        }

        if(await collection.findOne({title})){
            throw new Error(`Title ${title} is not available.`)
        }

        await collection.insertOne({title, description, author: email});
        const result = await collection.findOne({title});

        pubsub.publish(
            email,
            {
                subAuthor: result
            }
        )

        return result;
    },

    removeUser: async (parent, args, ctx, info) => {
        const { email, token } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection2 = db.collection("usuarios");
        const collection = db.collection("posts");

        if(!await collection2.findOne({email, token})){
            throw new Error(`User must be logged in.`)
        }

        const autor = 1;
        const lector = 0;

        if(await collection2.findOne({email, type: autor})){
            await collection2.findOneAndDelete({email});
            await collection.deleteMany({author: email});
        }

        if(await collection2.findOne({email, type: lector})){
            await collection2.findOneAndDelete({email});
        }

        return `User ${email} successfully deleted.`
    },

    removePost: async (parent, args, ctx, info) => {
        const { email, token, _id } = args;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection2 = db.collection("usuarios");
        const collection = db.collection("posts");

        if(!await collection2.findOne({email, token})){
            throw new Error(`User must be logged in.`)
        }

        const result = await collection.findOne({_id: ObjectID(_id), author: email});

        if(!result){
            throw new Error(`You cannot delete posts from another user.`)
        }

        if(! await collection.findOne({_id: ObjectID(_id)})){
            throw new Error(`Post not found.`)
        }

        await collection.findOneAndDelete({_id: ObjectID(_id)});

        return `Post ${_id} successfully deleted.`
    }
}

export {Mutation as default}