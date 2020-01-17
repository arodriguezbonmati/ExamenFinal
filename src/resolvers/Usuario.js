import 'babel-polyfill'

const Usuario = {
    posts: async (parent, args, ctx, info) => {
        const email = parent.email;
        const { client } = ctx;

        const db = client.db("EXAMEN");
        const collection = db.collection("posts");

        const result = await collection.find({author: email}).toArray();

        return result;
    }
}

export {Usuario as default}